"""
Modelos base Pydantic com validação robusta
"""

from typing import Any, Dict, List, Optional, Union, Generic, TypeVar
from datetime import datetime
from enum import Enum
from decimal import Decimal

from pydantic import BaseModel as PydanticBaseModel, Field, validator, root_validator
from pydantic.generics import GenericModel

T = TypeVar('T')

class BaseModel(PydanticBaseModel):
    """Modelo base com configurações otimizadas"""
    
    class Config:
        # Performance optimizations
        validate_assignment = True
        use_enum_values = True
        allow_population_by_field_name = True
        
        # JSON optimization
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            Decimal: lambda v: float(v)
        }
        
        # Schema generation
        schema_extra = {
            "examples": {}
        }

class TimestampMixin(BaseModel):
    """Mixin para campos de timestamp"""
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: datetime = Field(..., description="Data da última atualização")

class PaginationParams(BaseModel):
    """Parâmetros de paginação padronizados"""
    page: int = Field(1, ge=1, description="Número da página")
    limit: int = Field(50, ge=1, le=1000, description="Itens por página")
    
    @property
    def skip(self) -> int:
        return (self.page - 1) * self.limit
    
    @property
    def take(self) -> int:
        return self.limit

class PaginatedResponse(GenericModel, Generic[T]):
    """Response paginado padronizado"""
    data: List[T] = Field(..., description="Lista de itens")
    total: int = Field(..., description="Total de itens")
    page: int = Field(..., description="Página atual")
    limit: int = Field(..., description="Itens por página")
    total_pages: int = Field(..., description="Total de páginas")
    has_next: bool = Field(..., description="Possui próxima página")
    has_previous: bool = Field(..., description="Possui página anterior")
    
    @root_validator
    def calculate_pagination_info(cls, values):
        total = values.get('total', 0)
        page = values.get('page', 1)
        limit = values.get('limit', 50)
        
        total_pages = (total + limit - 1) // limit if total > 0 else 1
        has_next = page < total_pages
        has_previous = page > 1
        
        values.update({
            'total_pages': total_pages,
            'has_next': has_next,
            'has_previous': has_previous
        })
        
        return values

class APIResponse(GenericModel, Generic[T]):
    """Response padronizado da API"""
    success: bool = Field(True, description="Indica se a operação foi bem-sucedida")
    data: Optional[T] = Field(None, description="Dados da resposta")
    message: Optional[str] = Field(None, description="Mensagem adicional")
    errors: Optional[List[str]] = Field(None, description="Lista de erros")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadados adicionais")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp da resposta")
    
    @classmethod
    def success_response(cls, data: T = None, message: str = None, metadata: Dict[str, Any] = None):
        """Cria response de sucesso"""
        return cls(
            success=True,
            data=data,
            message=message,
            metadata=metadata
        )
    
    @classmethod
    def error_response(cls, errors: List[str], message: str = None, metadata: Dict[str, Any] = None):
        """Cria response de erro"""
        return cls(
            success=False,
            errors=errors,
            message=message,
            metadata=metadata
        )

class ErrorResponse(BaseModel):
    """Response específico para erros"""
    success: bool = Field(False, description="Sempre false para erros")
    error_code: str = Field(..., description="Código do erro")
    message: str = Field(..., description="Mensagem de erro")
    details: Optional[Dict[str, Any]] = Field(None, description="Detalhes adicionais do erro")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp do erro")
    request_id: Optional[str] = Field(None, description="ID da requisição para debugging")

# Enums padronizados
class MembershipRole(str, Enum):
    """Roles de membership em organizações"""
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"

class AgentModelName(str, Enum):
    """Modelos de IA suportados"""
    GPT_3_5_TURBO = "gpt_3_5_turbo"
    GPT_4 = "gpt_4"
    GPT_4_TURBO = "gpt_4_turbo"
    GPT_4O = "gpt_4o"
    CLAUDE_3_HAIKU = "claude_3_haiku"
    CLAUDE_3_SONNET = "claude_3_sonnet"
    CLAUDE_3_OPUS = "claude_3_opus"

class DatastoreType(str, Enum):
    """Tipos de datastore"""
    TEXT = "text"
    QA = "qa"
    WEB_PAGE = "web_page"
    WEB_SITE = "web_site"
    FILE = "file"

class DatasourceType(str, Enum):
    """Tipos de datasource"""
    FILE = "file"
    WEB_PAGE = "web_page"
    WEB_SITE = "web_site"
    TEXT = "text"

class DatasourceStatus(str, Enum):
    """Status de datasource"""
    UNSYNCHED = "unsynched"
    PENDING = "pending"
    RUNNING = "running"
    SYNCHED = "synched"
    ERROR = "error"

class ConversationStatus(str, Enum):
    """Status de conversas"""
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class WebhookEventType(str, Enum):
    """Tipos de eventos de webhook"""
    USER_REGISTERED = "user.registered"
    USER_UPDATED = "user.updated"
    PAYMENT_CONFIRMED = "payment.confirmed"
    PAYMENT_FAILED = "payment.failed"
    AGENT_CREATED = "agent.created"
    AGENT_UPDATED = "agent.updated"
    AGENT_DELETED = "agent.deleted"
    CONVERSATION_CREATED = "conversation.created"
    CONVERSATION_MESSAGE_ADDED = "conversation.message.added"
    CONVERSATION_ENDED = "conversation.ended"
    INTEGRATION_CONNECTED = "integration.connected"
    INTEGRATION_DISCONNECTED = "integration.disconnected"
    ONBOARDING_STEP_COMPLETED = "onboarding.step.completed"
    ONBOARDING_COMPLETED = "onboarding.completed"

# Validadores customizados
def validate_email(email: str) -> str:
    """Validador customizado para email"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValueError('Email inválido')
    return email.lower()

def validate_password(password: str) -> str:
    """Validador customizado para senha"""
    if len(password) < 8:
        raise ValueError('Senha deve ter pelo menos 8 caracteres')
    if not any(c.isupper() for c in password):
        raise ValueError('Senha deve ter pelo menos uma letra maiúscula')
    if not any(c.islower() for c in password):
        raise ValueError('Senha deve ter pelo menos uma letra minúscula')
    if not any(c.isdigit() for c in password):
        raise ValueError('Senha deve ter pelo menos um número')
    return password

def validate_organization_name(name: str) -> str:
    """Validador para nome de organização"""
    if len(name.strip()) < 2:
        raise ValueError('Nome da organização deve ter pelo menos 2 caracteres')
    if len(name) > 100:
        raise ValueError('Nome da organização deve ter no máximo 100 caracteres')
    return name.strip()

def validate_agent_name(name: str) -> str:
    """Validador para nome de agente"""
    if len(name.strip()) < 2:
        raise ValueError('Nome do agente deve ter pelo menos 2 caracteres')
    if len(name) > 50:
        raise ValueError('Nome do agente deve ter no máximo 50 caracteres')
    return name.strip()

def validate_temperature(temperature: float) -> float:
    """Validador para temperatura do modelo"""
    if not 0.0 <= temperature <= 2.0:
        raise ValueError('Temperatura deve estar entre 0.0 e 2.0')
    return temperature

def validate_max_tokens(max_tokens: int) -> int:
    """Validador para max_tokens"""
    if not 1 <= max_tokens <= 4000:
        raise ValueError('max_tokens deve estar entre 1 e 4000')
    return max_tokens

# Schemas de validação para campos JSON
class AgentConfigSchema(BaseModel):
    """Schema para configuração de agente"""
    system_prompt: Optional[str] = Field(None, max_length=2000)
    user_prompt: Optional[str] = Field(None, max_length=1000)
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(1000, ge=1, le=4000)
    include_sources: bool = Field(True)
    restrict_knowledge: bool = Field(True)
    custom_instructions: Optional[str] = Field(None, max_length=500)

class DatastoreConfigSchema(BaseModel):
    """Schema para configuração de datastore"""
    chunk_size: int = Field(1000, ge=100, le=4000)
    chunk_overlap: int = Field(200, ge=0, le=1000)
    embedding_model: str = Field("text-embedding-ada-002")
    similarity_threshold: float = Field(0.7, ge=0.0, le=1.0)
    max_results: int = Field(5, ge=1, le=20)

class WebhookConfigSchema(BaseModel):
    """Schema para configuração de webhook"""
    url: str = Field(..., regex=r'^https?://.+')
    secret: Optional[str] = Field(None, min_length=16)
    events: List[WebhookEventType] = Field(...)
    active: bool = Field(True)
    retry_count: int = Field(3, ge=0, le=10)
    timeout_seconds: int = Field(30, ge=5, le=120)

# Health check models
class HealthCheck(BaseModel):
    """Modelo para health check"""
    status: str = Field(..., description="Status do serviço")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    version: Optional[str] = Field(None, description="Versão da API")
    database: bool = Field(..., description="Status do banco de dados")
    cache: bool = Field(..., description="Status do cache Redis")
    external_services: Dict[str, bool] = Field(default_factory=dict, description="Status de serviços externos")

# Metadata models
class RequestMetadata(BaseModel):
    """Metadados de requisição"""
    user_id: Optional[str] = Field(None)
    organization_id: Optional[str] = Field(None)
    user_agent: Optional[str] = Field(None)
    ip_address: Optional[str] = Field(None)
    request_id: Optional[str] = Field(None)
    endpoint: Optional[str] = Field(None)
    method: Optional[str] = Field(None)

class ResponseMetadata(BaseModel):
    """Metadados de resposta"""
    execution_time_ms: Optional[float] = Field(None)
    query_count: Optional[int] = Field(None)
    cache_hit: Optional[bool] = Field(None)
    rate_limit_remaining: Optional[int] = Field(None)
    rate_limit_reset: Optional[datetime] = Field(None)