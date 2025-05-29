"""
Sistema de Autenticação JWT para FastAPI
Integração com Supabase Auth + validação própria
"""

import os
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
import httpx
from supabase import create_client, Client
import logging

# Configuração
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Logger
logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# JWT Security
security = HTTPBearer(auto_error=False)

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user: Dict[str, Any]

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    organization_id: Optional[str] = None

class User(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None
    role: str = "user"
    organization_id: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None
    organization_id: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar senha com hash bcrypt"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Gerar hash da senha"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Criar token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_supabase_token(token: str) -> Optional[Dict[str, Any]]:
    """Verificar token do Supabase Auth"""
    try:
        # Verificar token com Supabase
        response = supabase.auth.get_user(token)
        if response.user:
            return {
                "user_id": response.user.id,
                "email": response.user.email,
                "role": response.user.user_metadata.get("role", "user"),
                "organization_id": response.user.user_metadata.get("organization_id")
            }
    except Exception as e:
        logger.error(f"Erro ao verificar token Supabase: {e}")
    return None

async def verify_jwt_token(token: str) -> Optional[TokenData]:
    """Verificar token JWT próprio"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        role: str = payload.get("role", "user")
        organization_id: str = payload.get("organization_id")
        
        if user_id is None:
            return None
            
        return TokenData(
            user_id=user_id,
            email=email,
            role=role,
            organization_id=organization_id
        )
    except jwt.ExpiredSignatureError:
        logger.warning("Token expirado")
        return None
    except jwt.JWTError as e:
        logger.error(f"Erro JWT: {e}")
        return None

async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> User:
    """
    Dependency para obter usuário atual
    Suporta tanto tokens Supabase quanto JWT próprios
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not credentials:
        raise credentials_exception

    token = credentials.credentials
    
    # Tentar verificar como token Supabase primeiro
    supabase_user = await verify_supabase_token(token)
    if supabase_user:
        # Buscar dados completos do usuário no Prisma
        from .database import get_user_by_id
        user = await get_user_by_id(supabase_user["user_id"])
        if user:
            return user
    
    # Fallback para JWT próprio
    token_data = await verify_jwt_token(token)
    if not token_data:
        raise credentials_exception
    
    # Buscar usuário no banco
    from .database import get_user_by_id
    user = await get_user_by_id(token_data.user_id)
    if not user:
        raise credentials_exception
    
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency para usuário ativo"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

async def get_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Dependency para usuário admin"""
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

async def get_organization_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Dependency para usuário com organização"""
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User must belong to an organization"
        )
    return current_user

class RLSContext:
    """Context manager para Row Level Security"""
    def __init__(self, user: User):
        self.user = user
        self.organization_id = user.organization_id
        self.role = user.role
    
    def get_filters(self) -> Dict[str, Any]:
        """Retorna filtros RLS baseados no usuário"""
        filters = {}
        
        # Filtro por organização (multi-tenancy)
        if self.organization_id and self.role != "super_admin":
            filters["organization_id"] = self.organization_id
        
        # Filtro por usuário para dados pessoais
        if self.role == "user":
            filters["user_id"] = self.user.id
        
        return filters

def create_rls_context(user: User) -> RLSContext:
    """Factory para contexto RLS"""
    return RLSContext(user)

# Rate limiting por usuário
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

def get_user_id_for_rate_limit(request: Request):
    """Identificador para rate limiting baseado no usuário"""
    try:
        # Tentar obter do token JWT
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            token_data = verify_jwt_token(token)
            if token_data:
                return token_data.user_id
    except:
        pass
    
    # Fallback para IP
    return get_remote_address(request)

limiter = Limiter(key_func=get_user_id_for_rate_limit)

# Middleware de autenticação
async def auth_middleware(request: Request, call_next):
    """Middleware para injetar contexto de autenticação"""
    try:
        # Tentar obter usuário do header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
            # Verificar token
            supabase_user = await verify_supabase_token(token)
            if supabase_user:
                request.state.user_id = supabase_user["user_id"]
                request.state.organization_id = supabase_user.get("organization_id")
                request.state.role = supabase_user.get("role", "user")
            else:
                token_data = await verify_jwt_token(token)
                if token_data:
                    request.state.user_id = token_data.user_id
                    request.state.organization_id = token_data.organization_id
                    request.state.role = token_data.role
    except Exception as e:
        logger.debug(f"Auth middleware error: {e}")
    
    response = await call_next(request)
    return response