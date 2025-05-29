"""
Modelos Pydantic para Auth com validação robusta
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from enum import Enum

from pydantic import Field, validator, EmailStr
from .base import (
    BaseModel, TimestampMixin,
    validate_email, validate_password
)

class AuthProvider(str, Enum):
    """Provedores de autenticação"""
    LOCAL = "local"
    GOOGLE = "google"
    GITHUB = "github"
    MICROSOFT = "microsoft"
    OAUTH2 = "oauth2"

class TokenType(str, Enum):
    """Tipos de token"""
    ACCESS = "access"
    REFRESH = "refresh"
    RESET = "reset"
    VERIFICATION = "verification"
    INVITATION = "invitation"

class SessionStatus(str, Enum):
    """Status da sessão"""
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"
    INVALID = "invalid"

# Modelos base de autenticação
class LoginRequest(BaseModel):
    """Requisição de login"""
    email: EmailStr = Field(..., description="Email do usuário")
    password: str = Field(..., description="Senha do usuário")
    remember_me: bool = Field(False, description="Lembrar login")
    device_name: Optional[str] = Field(None, description="Nome do dispositivo")
    
    @validator('password')
    def validate_password_field(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Senha não pode estar vazia')
        return v

class RegisterRequest(BaseModel):
    """Requisição de registro"""
    email: EmailStr = Field(..., description="Email do usuário")
    password: str = Field(..., description="Senha do usuário")
    name: Optional[str] = Field(None, description="Nome do usuário")
    organization_name: Optional[str] = Field(None, description="Nome da organização")
    invite_token: Optional[str] = Field(None, description="Token de convite")
    terms_accepted: bool = Field(..., description="Termos aceitos")
    privacy_accepted: bool = Field(..., description="Política de privacidade aceita")
    marketing_consent: bool = Field(False, description="Consentimento para marketing")
    
    @validator('password')
    def validate_password_field(cls, v):
        return validate_password(v)
    
    @validator('name')
    def validate_name_field(cls, v):
        if v is not None:
            if len(v.strip()) < 2:
                raise ValueError('Nome deve ter pelo menos 2 caracteres')
            if len(v) > 100:
                raise ValueError('Nome deve ter no máximo 100 caracteres')
            return v.strip()
        return v
    
    @validator('terms_accepted')
    def validate_terms(cls, v):
        if not v:
            raise ValueError('Você deve aceitar os termos de uso')
        return v
    
    @validator('privacy_accepted')
    def validate_privacy(cls, v):
        if not v:
            raise ValueError('Você deve aceitar a política de privacidade')
        return v

class TokenResponse(BaseModel):
    """Resposta de token"""
    access_token: str = Field(..., description="Token de acesso")
    refresh_token: Optional[str] = Field(None, description="Token de refresh")
    token_type: str = Field("Bearer", description="Tipo do token")
    expires_in: int = Field(..., description="Tempo de expiração em segundos")
    expires_at: datetime = Field(..., description="Data de expiração")
    scope: Optional[str] = Field(None, description="Escopo do token")
    
    class Config:
        schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "Bearer",
                "expires_in": 3600,
                "expires_at": "2024-01-01T11:00:00Z",
                "scope": "read write"
            }
        }

class RefreshTokenRequest(BaseModel):
    """Requisição de refresh token"""
    refresh_token: str = Field(..., description="Token de refresh")
    
    @validator('refresh_token')
    def validate_refresh_token(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('refresh_token não pode estar vazio')
        return v.strip()

class PasswordResetRequest(BaseModel):
    """Requisição de reset de senha"""
    email: EmailStr = Field(..., description="Email do usuário")

class PasswordResetConfirm(BaseModel):
    """Confirmação de reset de senha"""
    token: str = Field(..., description="Token de reset")
    new_password: str = Field(..., description="Nova senha")
    confirm_password: str = Field(..., description="Confirmação da nova senha")
    
    @validator('new_password')
    def validate_new_password(cls, v):
        return validate_password(v)
    
    @validator('confirm_password')
    def validate_passwords_match(cls, v, values):
        new_password = values.get('new_password')
        if new_password and v != new_password:
            raise ValueError('Senhas não coincidem')
        return v

class PasswordChangeRequest(BaseModel):
    """Requisição de mudança de senha"""
    current_password: str = Field(..., description="Senha atual")
    new_password: str = Field(..., description="Nova senha")
    confirm_password: str = Field(..., description="Confirmação da nova senha")
    
    @validator('new_password')
    def validate_new_password(cls, v):
        return validate_password(v)
    
    @validator('confirm_password')
    def validate_passwords_match(cls, v, values):
        new_password = values.get('new_password')
        if new_password and v != new_password:
            raise ValueError('Senhas não coincidem')
        return v

class EmailVerificationRequest(BaseModel):
    """Requisição de verificação de email"""
    email: EmailStr = Field(..., description="Email a ser verificado")

class EmailVerificationConfirm(BaseModel):
    """Confirmação de verificação de email"""
    token: str = Field(..., description="Token de verificação")
    
    @validator('token')
    def validate_token(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Token não pode estar vazio')
        return v.strip()

# Modelos OAuth
class OAuthLoginRequest(BaseModel):
    """Requisição de login OAuth"""
    provider: AuthProvider = Field(..., description="Provedor OAuth")
    redirect_uri: Optional[str] = Field(None, description="URI de redirecionamento")
    state: Optional[str] = Field(None, description="State para validação")
    
    @validator('provider')
    def validate_provider(cls, v):
        if v == AuthProvider.LOCAL:
            raise ValueError('LOCAL não é um provedor OAuth válido')
        return v

class OAuthCallbackRequest(BaseModel):
    """Callback OAuth"""
    provider: AuthProvider = Field(..., description="Provedor OAuth")
    code: str = Field(..., description="Código de autorização")
    state: Optional[str] = Field(None, description="State para validação")
    
    @validator('code')
    def validate_code(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Código não pode estar vazio')
        return v.strip()

class OAuthUserInfo(BaseModel):
    """Informações do usuário OAuth"""
    provider: AuthProvider = Field(..., description="Provedor OAuth")
    provider_id: str = Field(..., description="ID no provedor")
    email: EmailStr = Field(..., description="Email do usuário")
    name: Optional[str] = Field(None, description="Nome do usuário")
    avatar_url: Optional[str] = Field(None, description="URL do avatar")
    verified: bool = Field(False, description="Se o email foi verificado")

# Modelos de sessão
class SessionInfo(BaseModel):
    """Informações da sessão"""
    user_id: str = Field(..., description="ID do usuário")
    session_id: str = Field(..., description="ID da sessão")
    device_name: Optional[str] = Field(None, description="Nome do dispositivo")
    ip_address: Optional[str] = Field(None, description="Endereço IP")
    user_agent: Optional[str] = Field(None, description="User agent")
    created_at: datetime = Field(..., description="Data de criação")
    last_activity: datetime = Field(..., description="Última atividade")
    expires_at: datetime = Field(..., description="Data de expiração")
    status: SessionStatus = Field(..., description="Status da sessão")

class SessionCreate(BaseModel):
    """Criação de sessão"""
    user_id: str = Field(..., description="ID do usuário")
    device_name: Optional[str] = Field(None, description="Nome do dispositivo")
    ip_address: Optional[str] = Field(None, description="Endereço IP")
    user_agent: Optional[str] = Field(None, description="User agent")
    expires_in_days: int = Field(30, description="Expiração em dias")
    
    @validator('expires_in_days')
    def validate_expires_in_days(cls, v):
        if not 1 <= v <= 365:
            raise ValueError('expires_in_days deve estar entre 1 e 365')
        return v

class SessionUpdate(BaseModel):
    """Atualização de sessão"""
    last_activity: Optional[datetime] = Field(None, description="Última atividade")
    status: Optional[SessionStatus] = Field(None, description="Status da sessão")
    expires_at: Optional[datetime] = Field(None, description="Nova data de expiração")

class SessionRevoke(BaseModel):
    """Revogação de sessão"""
    session_id: Optional[str] = Field(None, description="ID da sessão específica")
    revoke_all: bool = Field(False, description="Revogar todas as sessões")
    except_current: bool = Field(True, description="Exceto a sessão atual")

# Modelos de token
class TokenClaims(BaseModel):
    """Claims do token JWT"""
    sub: str = Field(..., description="Subject (user ID)")
    email: str = Field(..., description="Email do usuário")
    name: Optional[str] = Field(None, description="Nome do usuário")
    organization_id: Optional[str] = Field(None, description="ID da organização")
    role: Optional[str] = Field(None, description="Role do usuário")
    permissions: List[str] = Field(default_factory=list, description="Permissões")
    iat: int = Field(..., description="Issued at")
    exp: int = Field(..., description="Expiration time")
    aud: str = Field(..., description="Audience")
    iss: str = Field(..., description="Issuer")
    jti: Optional[str] = Field(None, description="JWT ID")

class TokenValidation(BaseModel):
    """Validação de token"""
    token: str = Field(..., description="Token a ser validado")
    token_type: TokenType = Field(TokenType.ACCESS, description="Tipo do token")
    
    @validator('token')
    def validate_token(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Token não pode estar vazio')
        return v.strip()

class TokenValidationResult(BaseModel):
    """Resultado da validação de token"""
    valid: bool = Field(..., description="Se o token é válido")
    expired: bool = Field(False, description="Se o token expirou")
    claims: Optional[TokenClaims] = Field(None, description="Claims do token")
    error: Optional[str] = Field(None, description="Mensagem de erro")

# Modelos de autenticação em dois fatores
class TwoFactorSetupRequest(BaseModel):
    """Requisição de configuração 2FA"""
    method: str = Field(..., description="Método 2FA (totp, sms)")
    phone: Optional[str] = Field(None, description="Telefone para SMS")
    
    @validator('method')
    def validate_method(cls, v):
        allowed_methods = ['totp', 'sms']
        if v not in allowed_methods:
            raise ValueError(f'Método deve ser um de: {", ".join(allowed_methods)}')
        return v
    
    @validator('phone')
    def validate_phone(cls, v, values):
        method = values.get('method')
        if method == 'sms' and not v:
            raise ValueError('Telefone é obrigatório para SMS')
        if v:
            # Validar formato brasileiro
            phone = ''.join(filter(str.isdigit, v))
            if len(phone) not in [10, 11]:
                raise ValueError('Telefone deve ter 10 ou 11 dígitos')
            return phone
        return v

class TwoFactorSetupResponse(BaseModel):
    """Resposta de configuração 2FA"""
    secret: Optional[str] = Field(None, description="Secret TOTP")
    qr_code: Optional[str] = Field(None, description="QR code para TOTP")
    backup_codes: List[str] = Field(default_factory=list, description="Códigos de backup")
    setup_complete: bool = Field(False, description="Se a configuração foi completa")

class TwoFactorVerifyRequest(BaseModel):
    """Verificação 2FA"""
    code: str = Field(..., description="Código 2FA")
    backup_code: Optional[str] = Field(None, description="Código de backup")
    
    @validator('code')
    def validate_code(cls, v):
        if len(v.strip()) not in [6, 8]:  # TOTP ou backup
            raise ValueError('Código deve ter 6 ou 8 dígitos')
        return v.strip()

class TwoFactorDisableRequest(BaseModel):
    """Desabilitação 2FA"""
    password: str = Field(..., description="Senha atual")
    code: Optional[str] = Field(None, description="Código 2FA atual")

# Modelos de auditoria
class AuthEvent(BaseModel, TimestampMixin):
    """Evento de autenticação"""
    id: str = Field(..., description="ID do evento")
    user_id: Optional[str] = Field(None, description="ID do usuário")
    event_type: str = Field(..., description="Tipo do evento")
    provider: AuthProvider = Field(..., description="Provedor de autenticação")
    ip_address: Optional[str] = Field(None, description="Endereço IP")
    user_agent: Optional[str] = Field(None, description="User agent")
    success: bool = Field(..., description="Se o evento foi bem-sucedido")
    error_message: Optional[str] = Field(None, description="Mensagem de erro")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadados adicionais")
    
    @validator('event_type')
    def validate_event_type(cls, v):
        allowed_types = [
            'login', 'logout', 'register', 'password_reset', 'password_change',
            'email_verification', 'oauth_login', 'token_refresh', 'session_revoke',
            'two_factor_setup', 'two_factor_verify', 'two_factor_disable'
        ]
        if v not in allowed_types:
            raise ValueError(f'Tipo de evento deve ser um de: {", ".join(allowed_types)}')
        return v

class AuthAuditLog(BaseModel):
    """Log de auditoria de autenticação"""
    events: List[AuthEvent] = Field(..., description="Lista de eventos")
    total: int = Field(..., description="Total de eventos")
    page: int = Field(..., description="Página atual")
    limit: int = Field(..., description="Itens por página")

# Modelos de permissões
class Permission(BaseModel):
    """Permissão"""
    name: str = Field(..., description="Nome da permissão")
    description: str = Field(..., description="Descrição da permissão")
    resource: str = Field(..., description="Recurso")
    action: str = Field(..., description="Ação")
    
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nome deve ter pelo menos 2 caracteres')
        return v.strip()

class Role(BaseModel):
    """Role com permissões"""
    name: str = Field(..., description="Nome da role")
    description: str = Field(..., description="Descrição da role")
    permissions: List[Permission] = Field(..., description="Permissões da role")
    
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nome deve ter pelo menos 2 caracteres')
        return v.strip()

class UserPermissions(BaseModel):
    """Permissões do usuário"""
    user_id: str = Field(..., description="ID do usuário")
    roles: List[Role] = Field(..., description="Roles do usuário")
    permissions: List[Permission] = Field(..., description="Todas as permissões")
    
    def has_permission(self, resource: str, action: str) -> bool:
        """Verificar se tem permissão específica"""
        return any(
            p.resource == resource and p.action == action
            for p in self.permissions
        )

# Modelos de configuração de segurança
class SecuritySettings(BaseModel):
    """Configurações de segurança"""
    password_min_length: int = Field(8, description="Tamanho mínimo da senha")
    password_require_uppercase: bool = Field(True, description="Requer maiúscula")
    password_require_lowercase: bool = Field(True, description="Requer minúscula")
    password_require_numbers: bool = Field(True, description="Requer números")
    password_require_special: bool = Field(False, description="Requer caracteres especiais")
    session_timeout_hours: int = Field(24, description="Timeout da sessão (horas)")
    max_login_attempts: int = Field(5, description="Máximo de tentativas de login")
    lockout_duration_minutes: int = Field(15, description="Duração do bloqueio (minutos)")
    require_email_verification: bool = Field(True, description="Requer verificação de email")
    enable_two_factor: bool = Field(False, description="Habilitar 2FA")
    
    @validator('password_min_length')
    def validate_password_min_length(cls, v):
        if not 6 <= v <= 128:
            raise ValueError('password_min_length deve estar entre 6 e 128')
        return v
    
    @validator('session_timeout_hours')
    def validate_session_timeout(cls, v):
        if not 1 <= v <= 168:  # 1 hora a 7 dias
            raise ValueError('session_timeout_hours deve estar entre 1 e 168')
        return v

class AccountLockout(BaseModel):
    """Bloqueio de conta"""
    user_id: str = Field(..., description="ID do usuário")
    ip_address: Optional[str] = Field(None, description="IP bloqueado")
    reason: str = Field(..., description="Motivo do bloqueio")
    attempts: int = Field(..., description="Número de tentativas")
    locked_at: datetime = Field(..., description="Data do bloqueio")
    unlocks_at: datetime = Field(..., description="Data de desbloqueio")
    is_active: bool = Field(True, description="Se o bloqueio está ativo")

class AuthStats(BaseModel):
    """Estatísticas de autenticação"""
    period_start: datetime = Field(..., description="Início do período")
    period_end: datetime = Field(..., description="Fim do período")
    
    # Login stats
    total_logins: int = Field(0, description="Total de logins")
    successful_logins: int = Field(0, description="Logins bem-sucedidos")
    failed_logins: int = Field(0, description="Logins falhados")
    unique_users: int = Field(0, description="Usuários únicos")
    
    # Registration stats
    total_registrations: int = Field(0, description="Total de registros")
    email_verifications: int = Field(0, description="Verificações de email")
    oauth_registrations: int = Field(0, description="Registros via OAuth")
    
    # Security stats
    password_resets: int = Field(0, description="Resets de senha")
    account_lockouts: int = Field(0, description="Bloqueios de conta")
    two_factor_setups: int = Field(0, description="Configurações 2FA")
    
    # Provider distribution
    login_by_provider: Dict[str, int] = Field(
        default_factory=dict, 
        description="Logins por provedor"
    )
    
    @property
    def success_rate(self) -> float:
        """Taxa de sucesso de login"""
        if self.total_logins == 0:
            return 0.0
        return (self.successful_logins / self.total_logins) * 100