"""
=============================================================================
RESPONSE MODELS - AGENTES DE CONVERSAÇÃO
Modelos padronizados para responses da API
=============================================================================
"""

from datetime import datetime
from typing import Any, Dict, List, Optional, TypeVar, Generic, Union
from enum import Enum

from pydantic import Field
from .base import BaseModel, PaginatedResponse, APIResponse

# Types
T = TypeVar('T')

# =============================================================================
# STANDARD RESPONSES
# =============================================================================

class SuccessResponse(BaseModel):
    """Response de sucesso simples"""
    
    success: bool = Field(default=True)
    message: str = Field(default="Operation completed successfully")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ErrorResponse(BaseModel):
    """Response de erro padronizado"""
    
    success: bool = Field(default=False)
    error: str = Field(..., description="Tipo do erro")
    message: str = Field(..., description="Mensagem do erro")
    details: Optional[Dict[str, Any]] = Field(None, description="Detalhes adicionais")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    @classmethod
    def validation_error(cls, details: Dict[str, Any]) -> "ErrorResponse":
        return cls(
            error="VALIDATION_ERROR",
            message="Validation failed",
            details=details
        )
    
    @classmethod
    def not_found(cls, resource: str, identifier: str) -> "ErrorResponse":
        return cls(
            error="NOT_FOUND",
            message=f"{resource} not found: {identifier}"
        )
    
    @classmethod
    def permission_denied(cls, action: str) -> "ErrorResponse":
        return cls(
            error="PERMISSION_DENIED",
            message=f"Permission denied for action: {action}"
        )

class DataResponse(BaseModel, Generic[T]):
    """Response com dados"""
    
    success: bool = Field(default=True)
    data: T
    message: Optional[str] = Field(None)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# =============================================================================
# HEALTH CHECK RESPONSES
# =============================================================================

class HealthStatus(str, Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"

class ServiceHealth(BaseModel):
    """Status de saúde de um serviço"""
    
    name: str
    status: HealthStatus
    response_time: Optional[float] = Field(None, description="Tempo de resposta em ms")
    details: Optional[Dict[str, Any]] = None
    last_check: datetime = Field(default_factory=datetime.utcnow)

class HealthCheckResponse(BaseModel):
    """Response completo de health check"""
    
    status: HealthStatus
    services: List[ServiceHealth]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    uptime: Optional[float] = Field(None, description="Uptime em segundos")
    version: Optional[str] = None

# =============================================================================
# AUTHENTICATION RESPONSES
# =============================================================================

class TokenResponse(BaseModel):
    """Response de autenticação"""
    
    access_token: str
    token_type: str = Field(default="bearer")
    expires_in: int = Field(description="Expiração em segundos")
    refresh_token: Optional[str] = None
    scope: Optional[str] = None

class LoginResponse(BaseModel):
    """Response de login"""
    
    success: bool = Field(default=True)
    message: str = Field(default="Login successful")
    token: TokenResponse
    user: Dict[str, Any]
    requires_onboarding: bool = Field(default=False)

class LogoutResponse(SuccessResponse):
    """Response de logout"""
    
    message: str = Field(default="Logout successful")

# =============================================================================
# USER RESPONSES
# =============================================================================

class UserCreateResponse(BaseModel):
    """Response de criação de usuário"""
    
    success: bool = Field(default=True)
    message: str = Field(default="User created successfully")
    user_id: str
    requires_verification: bool = Field(default=True)

class UserUpdateResponse(BaseModel):
    """Response de atualização de usuário"""
    
    success: bool = Field(default=True)
    message: str = Field(default="User updated successfully")
    user: Dict[str, Any]

class PasswordResetResponse(SuccessResponse):
    """Response de reset de senha"""
    
    message: str = Field(default="Password reset email sent")

# =============================================================================
# AGENT RESPONSES
# =============================================================================

class AgentCreateResponse(BaseModel):
    """Response de criação de agente"""
    
    success: bool = Field(default=True)
    message: str = Field(default="Agent created successfully")
    agent_id: str
    agent: Dict[str, Any]

class AgentUpdateResponse(BaseModel):
    """Response de atualização de agente"""
    
    success: bool = Field(default=True)
    message: str = Field(default="Agent updated successfully")
    agent: Dict[str, Any]

class AgentDeleteResponse(SuccessResponse):
    """Response de exclusão de agente"""
    
    message: str = Field(default="Agent deleted successfully")

class AgentListResponse(BaseModel):
    """Response de listagem de agentes"""
    
    success: bool = Field(default=True)
    agents: List[Dict[str, Any]]
    total: int
    page: int
    size: int
    has_more: bool

# =============================================================================
# CONVERSATION RESPONSES
# =============================================================================

class ConversationStartResponse(BaseModel):
    """Response de início de conversa"""
    
    success: bool = Field(default=True)
    message: str = Field(default="Conversation started")
    conversation_id: str
    agent: Dict[str, Any]
    greeting: Optional[str] = None

class MessageResponse(BaseModel):
    """Response de mensagem"""
    
    success: bool = Field(default=True)
    message_id: str
    content: str
    role: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

class ConversationHistoryResponse(BaseModel):
    """Response de histórico de conversa"""
    
    success: bool = Field(default=True)
    conversation_id: str
    messages: List[Dict[str, Any]]
    total_messages: int
    has_more: bool

# =============================================================================
# ANALYTICS RESPONSES
# =============================================================================

class AnalyticsResponse(BaseModel):
    """Response de analytics"""
    
    success: bool = Field(default=True)
    data: Dict[str, Any]
    period: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class MetricsResponse(BaseModel):
    """Response de métricas"""
    
    success: bool = Field(default=True)
    metrics: Dict[str, Union[int, float, str]]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatsResponse(BaseModel):
    """Response de estatísticas"""
    
    success: bool = Field(default=True)
    stats: Dict[str, Any]
    comparison: Optional[Dict[str, Any]] = None
    trends: Optional[Dict[str, float]] = None

# =============================================================================
# FILE/UPLOAD RESPONSES
# =============================================================================

class FileUploadResponse(BaseModel):
    """Response de upload de arquivo"""
    
    success: bool = Field(default=True)
    message: str = Field(default="File uploaded successfully")
    file_id: str
    filename: str
    size: int
    url: Optional[str] = None

class FileDeleteResponse(SuccessResponse):
    """Response de exclusão de arquivo"""
    
    message: str = Field(default="File deleted successfully")

# =============================================================================
-- SEARCH RESPONSES
# =============================================================================

class SearchResult(BaseModel):
    """Resultado de busca individual"""
    
    id: str
    type: str  # 'agent', 'conversation', 'document', etc.
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    score: float = Field(description="Score de relevância")
    highlights: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class SearchResponse(BaseModel):
    """Response de busca"""
    
    success: bool = Field(default=True)
    query: str
    results: List[SearchResult]
    total: int
    took: float = Field(description="Tempo da busca em ms")
    suggestions: Optional[List[str]] = None

# =============================================================================
# BILLING RESPONSES
# =============================================================================

class PlanResponse(BaseModel):
    """Response de plano"""
    
    success: bool = Field(default=True)
    plan: Dict[str, Any]
    features: List[str]
    limits: Dict[str, int]

class SubscriptionResponse(BaseModel):
    """Response de assinatura"""
    
    success: bool = Field(default=True)
    subscription: Dict[str, Any]
    status: str
    current_period_end: datetime
    next_billing_date: datetime

class InvoiceResponse(BaseModel):
    """Response de fatura"""
    
    success: bool = Field(default=True)
    invoice: Dict[str, Any]
    amount: float
    status: str
    due_date: datetime

# =============================================================================
# INTEGRATION RESPONSES
# =============================================================================

class IntegrationResponse(BaseModel):
    """Response de integração"""
    
    success: bool = Field(default=True)
    integration: Dict[str, Any]
    status: str
    configuration: Dict[str, Any]

class WebhookResponse(BaseModel):
    """Response de webhook"""
    
    success: bool = Field(default=True)
    webhook_id: str
    url: str
    events: List[str]
    status: str

# =============================================================================
# BATCH OPERATIONS
# =============================================================================

class BatchOperationResult(BaseModel):
    """Resultado de operação em lote"""
    
    id: str
    success: bool
    error: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class BatchResponse(BaseModel):
    """Response de operação em lote"""
    
    success: bool = Field(default=True)
    total: int
    successful: int
    failed: int
    results: List[BatchOperationResult]
    errors: List[str] = Field(default_factory=list)

# =============================================================================
# EXPORT RESPONSES
# =============================================================================

class ExportResponse(BaseModel):
    """Response de exportação"""
    
    success: bool = Field(default=True)
    export_id: str
    format: str
    status: str = Field(default="processing")
    download_url: Optional[str] = None
    expires_at: Optional[datetime] = None

# =============================================================================
# NOTIFICATION RESPONSES
# =============================================================================

class NotificationResponse(BaseModel):
    """Response de notificação"""
    
    success: bool = Field(default=True)
    notification_id: str
    type: str
    title: str
    message: str
    read: bool = Field(default=False)
    created_at: datetime

class NotificationListResponse(BaseModel):
    """Response de lista de notificações"""
    
    success: bool = Field(default=True)
    notifications: List[NotificationResponse]
    unread_count: int
    total: int

# =============================================================================
# ACTIVITY RESPONSES
# =============================================================================

class ActivityResponse(BaseModel):
    """Response de atividade"""
    
    success: bool = Field(default=True)
    activity_id: str
    type: str
    description: str
    actor: Dict[str, Any]
    target: Optional[Dict[str, Any]] = None
    timestamp: datetime

class ActivityFeedResponse(BaseModel):
    """Response de feed de atividades"""
    
    success: bool = Field(default=True)
    activities: List[ActivityResponse]
    has_more: bool
    cursor: Optional[str] = None

# =============================================================================
# VALIDATION RESPONSES
# =============================================================================

class ValidationResponse(BaseModel):
    """Response de validação"""
    
    valid: bool
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)

# =============================================================================
# SYSTEM RESPONSES
# =============================================================================

class SystemInfoResponse(BaseModel):
    """Response de informações do sistema"""
    
    success: bool = Field(default=True)
    version: str
    environment: str
    uptime: float
    memory_usage: Dict[str, Any]
    database_status: str
    cache_status: str

class ConfigResponse(BaseModel):
    """Response de configuração"""
    
    success: bool = Field(default=True)
    config: Dict[str, Any]
    environment: str
    last_updated: datetime

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def create_success_response(
    data: Optional[T] = None,
    message: str = "Success",
    **kwargs
) -> Union[SuccessResponse, DataResponse[T]]:
    """Factory para criar response de sucesso"""
    if data is not None:
        return DataResponse(data=data, message=message, **kwargs)
    return SuccessResponse(message=message, **kwargs)

def create_error_response(
    error: str,
    message: str,
    details: Optional[Dict[str, Any]] = None,
    **kwargs
) -> ErrorResponse:
    """Factory para criar response de erro"""
    return ErrorResponse(
        error=error,
        message=message,
        details=details,
        **kwargs
    )

def create_paginated_response(
    items: List[T],
    total: int,
    page: int,
    size: int,
    **kwargs
) -> PaginatedResponse[T]:
    """Factory para criar response paginado"""
    return PaginatedResponse.create(
        data=items,
        page=page,
        size=size,
        total=total
    )