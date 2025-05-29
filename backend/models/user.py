"""
=============================================================================
USER MODELS - AGENTES DE CONVERSAÇÃO
Modelos completos para usuários com validação robusta
=============================================================================
"""

from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from enum import Enum

from pydantic import Field, validator, root_validator
from .base import TimestampedModel, BaseModel, Status
from .validators import validate_email, validate_name, email_validator, name_validator

# =============================================================================
# ENUMS
# =============================================================================

class UserStatus(str, Enum):
    """Status do usuário"""
    ACTIVE = "active"
    SUSPENDED = "suspended"
    PENDING_VERIFICATION = "pending_verification"
    DELETED = "deleted"

class UserRole(str, Enum):
    """Papéis do usuário"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"

class OnboardingStep(str, Enum):
    """Etapas do onboarding"""
    WELCOME = "welcome"
    PROFILE = "profile"
    ORGANIZATION = "organization"
    FIRST_AGENT = "first_agent"
    INTEGRATION = "integration"
    TRAINING = "training"
    COMPLETED = "completed"

# =============================================================================
# BASE USER MODELS
# =============================================================================

class UserBase(BaseModel):
    """Base do usuário"""
    
    email: str = Field(..., description="Email do usuário")
    name: Optional[str] = Field(None, description="Nome completo")
    avatar_url: Optional[str] = Field(None, description="URL do avatar")
    phone: Optional[str] = Field(None, description="Telefone")
    locale: str = Field(default="pt-BR", description="Idioma/localização")
    timezone: str = Field(default="America/Sao_Paulo", description="Fuso horário")
    
    # Validadores
    _validate_email = email_validator("email")
    _validate_name = name_validator("name", min_length=2, max_length=100)
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v:
            return v
        
        # Remover caracteres não numéricos
        phone = ''.join(filter(str.isdigit, v))
        
        # Validar formato brasileiro
        if len(phone) not in [10, 11]:  # (11) 99999-9999 ou (11) 9999-9999
            raise ValueError("Telefone deve ter 10 ou 11 dígitos")
        
        return phone
    
    @validator('locale')
    def validate_locale(cls, v):
        valid_locales = ['pt-BR', 'en-US', 'es-ES', 'fr-FR']
        if v not in valid_locales:
            raise ValueError(f"Locale deve ser um de: {valid_locales}")
        return v

class UserCreate(UserBase):
    """Criação de usuário"""
    
    password: str = Field(..., min_length=8, description="Senha")
    organization_name: Optional[str] = Field(None, description="Nome da organização")
    invite_token: Optional[str] = Field(None, description="Token de convite")
    
    @validator('password')
    def validate_password_strength(cls, v):
        from .validators import validate_password
        return validate_password(v)
    
    @validator('organization_name')
    def validate_org_name(cls, v):
        if v:
            return validate_name(v, min_length=2, max_length=100)
        return v

class UserUpdate(BaseModel):
    """Atualização de usuário"""
    
    name: Optional[str] = Field(None, description="Nome completo")
    avatar_url: Optional[str] = Field(None, description="URL do avatar")
    phone: Optional[str] = Field(None, description="Telefone")
    locale: Optional[str] = Field(None, description="Idioma/localização")
    timezone: Optional[str] = Field(None, description="Fuso horário")
    
    # Reutilizar validadores do UserBase
    _validate_name = name_validator("name", min_length=2, max_length=100)
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v:
            return v
        phone = ''.join(filter(str.isdigit, v))
        if len(phone) not in [10, 11]:
            raise ValueError("Telefone deve ter 10 ou 11 dígitos")
        return phone

# =============================================================================
# USER PREFERENCES
# =============================================================================

class UserPreferences(BaseModel):
    """Preferências do usuário"""
    
    # Interface
    theme: str = Field(default="dark", description="Tema da interface")
    language: str = Field(default="pt-BR", description="Idioma preferido")
    
    # Notificações
    email_notifications: bool = Field(default=True, description="Notificações por email")
    push_notifications: bool = Field(default=True, description="Notificações push")
    marketing_emails: bool = Field(default=False, description="Emails de marketing")
    
    # Dashboard
    default_view: str = Field(default="conversations", description="Vista padrão do dashboard")
    items_per_page: int = Field(default=20, ge=10, le=100, description="Itens por página")
    
    # AI Settings
    default_model: Optional[str] = Field(None, description="Modelo de IA padrão")
    default_temperature: float = Field(default=0.7, ge=0.0, le=2.0, description="Temperatura padrão")
    
    @validator('theme')
    def validate_theme(cls, v):
        valid_themes = ['light', 'dark', 'auto']
        if v not in valid_themes:
            raise ValueError(f"Theme deve ser um de: {valid_themes}")
        return v

# =============================================================================
# ONBOARDING
# =============================================================================

class OnboardingProgress(BaseModel):
    """Progresso do onboarding"""
    
    current_step: OnboardingStep = Field(default=OnboardingStep.WELCOME)
    completed_steps: List[OnboardingStep] = Field(default_factory=list)
    skipped_steps: List[OnboardingStep] = Field(default_factory=list)
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = Field(None)
    
    def complete_step(self, step: OnboardingStep) -> None:
        """Marcar etapa como completa"""
        if step not in self.completed_steps:
            self.completed_steps.append(step)
        
        # Avançar para próxima etapa
        steps = list(OnboardingStep)
        current_index = steps.index(self.current_step)
        if current_index < len(steps) - 1:
            self.current_step = steps[current_index + 1]
        
        # Marcar como completo se todas as etapas foram feitas
        if self.current_step == OnboardingStep.COMPLETED:
            self.completed_at = datetime.now(timezone.utc)
    
    def skip_step(self, step: OnboardingStep) -> None:
        """Pular etapa"""
        if step not in self.skipped_steps:
            self.skipped_steps.append(step)
        self.complete_step(step)  # Avançar mesmo assim
    
    @property
    def completion_percentage(self) -> int:
        """Porcentagem de conclusão"""
        total_steps = len(OnboardingStep) - 1  # Excluir COMPLETED
        completed = len(self.completed_steps)
        return min(100, int((completed / total_steps) * 100))

# =============================================================================
# USER SESSIONS
# =============================================================================

class UserSession(TimestampedModel):
    """Sessão do usuário"""
    
    user_id: str = Field(..., description="ID do usuário")
    token_hash: str = Field(..., description="Hash do token")
    device_info: Dict[str, Any] = Field(default_factory=dict, description="Informações do dispositivo")
    ip_address: Optional[str] = Field(None, description="Endereço IP")
    user_agent: Optional[str] = Field(None, description="User agent")
    is_active: bool = Field(default=True, description="Sessão ativa")
    last_activity: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime = Field(..., description="Data de expiração")
    
    @property
    def is_expired(self) -> bool:
        """Verificar se a sessão expirou"""
        return datetime.now(timezone.utc) > self.expires_at
    
    def refresh(self, expires_in_days: int = 30) -> None:
        """Renovar sessão"""
        self.last_activity = datetime.now(timezone.utc)
        self.expires_at = datetime.now(timezone.utc) + timedelta(days=expires_in_days)

# =============================================================================
# COMPLETE USER MODEL
# =============================================================================

class User(TimestampedModel):
    """Modelo completo do usuário"""
    
    # Informações básicas
    email: str = Field(..., description="Email do usuário")
    name: Optional[str] = Field(None, description="Nome completo")
    avatar_url: Optional[str] = Field(None, description="URL do avatar")
    phone: Optional[str] = Field(None, description="Telefone")
    
    # Status e verificação
    status: UserStatus = Field(default=UserStatus.ACTIVE, description="Status do usuário")
    email_verified: bool = Field(default=False, description="Email verificado")
    email_verified_at: Optional[datetime] = Field(None, description="Data de verificação do email")
    
    # Localização
    locale: str = Field(default="pt-BR", description="Idioma/localização")
    timezone: str = Field(default="America/Sao_Paulo", description="Fuso horário")
    
    # Onboarding
    onboarding_completed: bool = Field(default=False, description="Onboarding completo")
    onboarding_progress: Optional[OnboardingProgress] = Field(None, description="Progresso do onboarding")
    
    # Preferências
    preferences: UserPreferences = Field(default_factory=UserPreferences, description="Preferências")
    
    # Atividade
    last_login: Optional[datetime] = Field(None, description="Último login")
    login_count: int = Field(default=0, description="Número de logins")
    
    # Metadados
    signup_source: Optional[str] = Field(None, description="Origem do cadastro")
    referrer: Optional[str] = Field(None, description="Referência")
    
    # Validadores
    _validate_email = email_validator("email")
    _validate_name = name_validator("name", min_length=2, max_length=100)
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v:
            return v
        phone = ''.join(filter(str.isdigit, v))
        if len(phone) not in [10, 11]:
            raise ValueError("Telefone deve ter 10 ou 11 dígitos")
        return phone
    
    def update_login(self) -> None:
        """Atualizar informações de login"""
        self.last_login = datetime.now(timezone.utc)
        self.login_count += 1
    
    def verify_email(self) -> None:
        """Marcar email como verificado"""
        self.email_verified = True
        self.email_verified_at = datetime.now(timezone.utc)
    
    def complete_onboarding(self) -> None:
        """Completar onboarding"""
        self.onboarding_completed = True
        if self.onboarding_progress:
            self.onboarding_progress.completed_at = datetime.now(timezone.utc)
            self.onboarding_progress.current_step = OnboardingStep.COMPLETED

# =============================================================================
# RESPONSE MODELS
# =============================================================================

class UserResponse(BaseModel):
    """Response do usuário (sem dados sensíveis)"""
    
    id: str
    email: str
    name: Optional[str]
    avatar_url: Optional[str]
    status: UserStatus
    email_verified: bool
    locale: str
    timezone: str
    onboarding_completed: bool
    last_login: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    @classmethod
    def from_user(cls, user: User) -> "UserResponse":
        """Converter User para UserResponse"""
        return cls(
            id=user.id,
            email=user.email,
            name=user.name,
            avatar_url=user.avatar_url,
            status=user.status,
            email_verified=user.email_verified,
            locale=user.locale,
            timezone=user.timezone,
            onboarding_completed=user.onboarding_completed,
            last_login=user.last_login,
            created_at=user.created_at,
            updated_at=user.updated_at
        )

class UserProfile(BaseModel):
    """Perfil completo do usuário"""
    
    user: UserResponse
    preferences: UserPreferences
    onboarding_progress: Optional[OnboardingProgress]
    stats: Dict[str, Any] = Field(default_factory=dict, description="Estatísticas do usuário")

# =============================================================================
# AUTHENTICATION MODELS
# =============================================================================

class UserLogin(BaseModel):
    """Login do usuário"""
    
    email: str = Field(..., description="Email")
    password: str = Field(..., description="Senha")
    remember_me: bool = Field(default=False, description="Lembrar login")
    
    _validate_email = email_validator("email")

class UserRegister(UserCreate):
    """Registro de usuário"""
    
    terms_accepted: bool = Field(..., description="Termos aceitos")
    privacy_accepted: bool = Field(..., description="Política de privacidade aceita")
    marketing_consent: bool = Field(default=False, description="Consentimento para marketing")
    
    @validator('terms_accepted')
    def validate_terms(cls, v):
        if not v:
            raise ValueError("Você deve aceitar os termos de uso")
        return v
    
    @validator('privacy_accepted')
    def validate_privacy(cls, v):
        if not v:
            raise ValueError("Você deve aceitar a política de privacidade")
        return v

class PasswordReset(BaseModel):
    """Reset de senha"""
    
    email: str = Field(..., description="Email")
    
    _validate_email = email_validator("email")

class PasswordUpdate(BaseModel):
    """Atualização de senha"""
    
    current_password: str = Field(..., description="Senha atual")
    new_password: str = Field(..., description="Nova senha")
    confirm_password: str = Field(..., description="Confirmação da nova senha")
    
    @validator('new_password')
    def validate_new_password(cls, v):
        from .validators import validate_password
        return validate_password(v)
    
    @root_validator
    def validate_passwords_match(cls, values):
        new_password = values.get('new_password')
        confirm_password = values.get('confirm_password')
        
        if new_password != confirm_password:
            raise ValueError("Nova senha e confirmação não coincidem")
        
        return values

# =============================================================================
# USER STATISTICS
# =============================================================================

class UserStats(BaseModel):
    """Estatísticas do usuário"""
    
    total_conversations: int = Field(default=0, description="Total de conversas")
    total_messages: int = Field(default=0, description="Total de mensagens")
    total_agents: int = Field(default=0, description="Total de agentes")
    avg_satisfaction: Optional[float] = Field(None, description="Satisfação média")
    tokens_used: int = Field(default=0, description="Tokens utilizados")
    cost_total: float = Field(default=0.0, description="Custo total")
    
    # Atividade recente
    conversations_last_30d: int = Field(default=0, description="Conversas últimos 30 dias")
    messages_last_30d: int = Field(default=0, description="Mensagens últimos 30 dias")
    
    # Tempo de uso
    avg_session_duration: Optional[float] = Field(None, description="Duração média da sessão (minutos)")
    most_used_agent: Optional[str] = Field(None, description="Agente mais usado")
    
    @property
    def engagement_score(self) -> float:
        """Calcular score de engajamento (0-100)"""
        score = 0
        
        # Base: conversas recentes
        if self.conversations_last_30d > 0:
            score += min(30, self.conversations_last_30d * 2)
        
        # Mensagens
        if self.messages_last_30d > 0:
            score += min(30, self.messages_last_30d)
        
        # Satisfação
        if self.avg_satisfaction:
            score += (self.avg_satisfaction / 5) * 20
        
        # Agentes criados
        if self.total_agents > 0:
            score += min(20, self.total_agents * 5)
        
        return min(100, score)