"""
Modelos Pydantic para Webhook com validação robusta
"""

from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

from pydantic import Field, validator, root_validator, HttpUrl
from .base import (
    BaseModel, TimestampMixin, WebhookEventType,
    WebhookConfigSchema
)

class WebhookStatus(str, Enum):
    """Status do webhook"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    FAILED = "failed"
    DISABLED = "disabled"

class DeliveryStatus(str, Enum):
    """Status de entrega do webhook"""
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    RETRYING = "retrying"
    ABANDONED = "abandoned"

class WebhookEventBase(BaseModel):
    """Modelo base para eventos de webhook"""
    event_type: WebhookEventType = Field(..., description="Tipo do evento")
    event_id: str = Field(..., description="ID único do evento")
    organization_id: str = Field(..., description="ID da organização")
    user_id: Optional[str] = Field(None, description="ID do usuário relacionado")
    timestamp: datetime = Field(..., description="Timestamp do evento")
    data: Dict[str, Any] = Field(..., description="Dados do evento")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadados adicionais")
    
    @validator('event_id')
    def validate_event_id(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('event_id não pode estar vazio')
        return v.strip()

class WebhookEventCreate(WebhookEventBase):
    """Modelo para criação de evento de webhook"""
    source: Optional[str] = Field(None, description="Origem do evento")
    correlation_id: Optional[str] = Field(None, description="ID de correlação")
    
    @validator('source')
    def validate_source(cls, v):
        if v is not None:
            allowed_sources = ['api', 'dashboard', 'system', 'automation', 'integration']
            if v not in allowed_sources:
                raise ValueError(f'Source deve ser um de: {", ".join(allowed_sources)}')
        return v

class WebhookConfigBase(BaseModel):
    """Modelo base para configuração de webhook"""
    url: HttpUrl = Field(..., description="URL do webhook")
    events: List[WebhookEventType] = Field(..., description="Eventos a serem enviados")
    secret: Optional[str] = Field(None, description="Secret para validação")
    active: bool = Field(True, description="Se o webhook está ativo")
    
    @validator('events')
    def validate_events(cls, v):
        if len(v) == 0:
            raise ValueError('Pelo menos um evento deve ser configurado')
        if len(v) > 20:
            raise ValueError('Máximo de 20 eventos por webhook')
        # Remove duplicatas mantendo ordem
        return list(dict.fromkeys(v))
    
    @validator('secret')
    def validate_secret(cls, v):
        if v is not None:
            if len(v) < 16:
                raise ValueError('Secret deve ter pelo menos 16 caracteres')
            if len(v) > 256:
                raise ValueError('Secret deve ter no máximo 256 caracteres')
        return v

class WebhookConfigCreate(WebhookConfigBase):
    """Modelo para criação de configuração de webhook"""
    name: str = Field(..., description="Nome do webhook")
    description: Optional[str] = Field(None, description="Descrição do webhook")
    retry_count: int = Field(3, description="Número de tentativas de retry")
    timeout_seconds: int = Field(30, description="Timeout em segundos")
    headers: Optional[Dict[str, str]] = Field(None, description="Headers customizados")
    
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nome deve ter pelo menos 2 caracteres')
        if len(v) > 100:
            raise ValueError('Nome deve ter no máximo 100 caracteres')
        return v.strip()
    
    @validator('description')
    def validate_description(cls, v):
        if v is not None:
            if len(v) > 500:
                raise ValueError('Descrição deve ter no máximo 500 caracteres')
            return v.strip()
        return v
    
    @validator('retry_count')
    def validate_retry_count(cls, v):
        if not 0 <= v <= 10:
            raise ValueError('retry_count deve estar entre 0 e 10')
        return v
    
    @validator('timeout_seconds')
    def validate_timeout_seconds(cls, v):
        if not 5 <= v <= 120:
            raise ValueError('timeout_seconds deve estar entre 5 e 120')
        return v
    
    @validator('headers')
    def validate_headers(cls, v):
        if v is not None:
            if len(v) > 20:
                raise ValueError('Máximo de 20 headers customizados')
            for key, value in v.items():
                if len(key) > 100 or len(value) > 500:
                    raise ValueError('Headers devem ter no máximo 100 chars (key) e 500 chars (value)')
        return v

class WebhookConfigUpdate(BaseModel):
    """Modelo para atualização de configuração de webhook"""
    name: Optional[str] = Field(None, description="Nome do webhook")
    description: Optional[str] = Field(None, description="Descrição do webhook")
    url: Optional[HttpUrl] = Field(None, description="URL do webhook")
    events: Optional[List[WebhookEventType]] = Field(None, description="Eventos a serem enviados")
    secret: Optional[str] = Field(None, description="Secret para validação")
    active: Optional[bool] = Field(None, description="Se o webhook está ativo")
    retry_count: Optional[int] = Field(None, description="Número de tentativas de retry")
    timeout_seconds: Optional[int] = Field(None, description="Timeout em segundos")
    headers: Optional[Dict[str, str]] = Field(None, description="Headers customizados")
    
    @validator('name')
    def validate_name(cls, v):
        if v is not None:
            if len(v.strip()) < 2:
                raise ValueError('Nome deve ter pelo menos 2 caracteres')
            if len(v) > 100:
                raise ValueError('Nome deve ter no máximo 100 caracteres')
            return v.strip()
        return v
    
    @validator('events')
    def validate_events(cls, v):
        if v is not None:
            if len(v) == 0:
                raise ValueError('Pelo menos um evento deve ser configurado')
            if len(v) > 20:
                raise ValueError('Máximo de 20 eventos por webhook')
            return list(dict.fromkeys(v))
        return v

class WebhookDeliveryAttempt(BaseModel):
    """Tentativa de entrega de webhook"""
    attempt_number: int = Field(..., description="Número da tentativa")
    timestamp: datetime = Field(..., description="Timestamp da tentativa")
    status_code: Optional[int] = Field(None, description="Código de status HTTP")
    response_body: Optional[str] = Field(None, description="Corpo da resposta")
    response_headers: Optional[Dict[str, str]] = Field(None, description="Headers da resposta")
    error_message: Optional[str] = Field(None, description="Mensagem de erro")
    duration_ms: Optional[int] = Field(None, description="Duração da requisição (ms)")
    
    @validator('response_body')
    def validate_response_body(cls, v):
        if v is not None and len(v) > 10000:
            # Truncar resposta muito longa
            return v[:10000] + "... [truncated]"
        return v

class WebhookDelivery(BaseModel, TimestampMixin):
    """Entrega de webhook"""
    id: str = Field(..., description="ID único da entrega")
    webhook_config_id: str = Field(..., description="ID da configuração do webhook")
    event_id: str = Field(..., description="ID do evento")
    event_type: WebhookEventType = Field(..., description="Tipo do evento")
    status: DeliveryStatus = Field(..., description="Status da entrega")
    url: str = Field(..., description="URL de destino")
    payload: Dict[str, Any] = Field(..., description="Payload enviado")
    attempts: List[WebhookDeliveryAttempt] = Field(
        default_factory=list, 
        description="Tentativas de entrega"
    )
    next_retry_at: Optional[datetime] = Field(None, description="Próxima tentativa")
    completed_at: Optional[datetime] = Field(None, description="Data de conclusão")
    
    @property
    def total_attempts(self) -> int:
        """Total de tentativas"""
        return len(self.attempts)
    
    @property
    def last_attempt(self) -> Optional[WebhookDeliveryAttempt]:
        """Última tentativa"""
        return self.attempts[-1] if self.attempts else None
    
    @property
    def success_rate(self) -> float:
        """Taxa de sucesso das tentativas"""
        if not self.attempts:
            return 0.0
        successful = sum(1 for attempt in self.attempts if attempt.status_code and 200 <= attempt.status_code < 300)
        return (successful / len(self.attempts)) * 100

class WebhookConfig(WebhookConfigBase, TimestampMixin):
    """Configuração completa de webhook"""
    id: str = Field(..., description="ID único da configuração")
    organization_id: str = Field(..., description="ID da organização")
    name: str = Field(..., description="Nome do webhook")
    description: Optional[str] = Field(None, description="Descrição do webhook")
    retry_count: int = Field(..., description="Número de tentativas de retry")
    timeout_seconds: int = Field(..., description="Timeout em segundos")
    headers: Optional[Dict[str, str]] = Field(None, description="Headers customizados")
    status: WebhookStatus = Field(WebhookStatus.ACTIVE, description="Status do webhook")
    
    # Estatísticas
    total_deliveries: int = Field(0, description="Total de entregas")
    successful_deliveries: int = Field(0, description="Entregas bem-sucedidas")
    failed_deliveries: int = Field(0, description="Entregas falhadas")
    last_delivery_at: Optional[datetime] = Field(None, description="Última entrega")
    last_success_at: Optional[datetime] = Field(None, description="Último sucesso")
    last_failure_at: Optional[datetime] = Field(None, description="Última falha")
    
    @property
    def success_rate(self) -> float:
        """Taxa de sucesso das entregas"""
        if self.total_deliveries == 0:
            return 0.0
        return (self.successful_deliveries / self.total_deliveries) * 100
    
    @property
    def is_healthy(self) -> bool:
        """Verificar se o webhook está saudável"""
        if self.status != WebhookStatus.ACTIVE:
            return False
        if self.total_deliveries == 0:
            return True  # Novo webhook
        return self.success_rate >= 80.0  # Pelo menos 80% de sucesso

class WebhookConfigResponse(WebhookConfig):
    """Resposta de configuração de webhook (sem dados sensíveis)"""
    
    class Config:
        # Excluir secret da resposta
        fields = {'secret': {'write_only': True}}
        schema_extra = {
            "example": {
                "id": "webhook_123",
                "organization_id": "org_123",
                "name": "Sistema de CRM",
                "description": "Integração com sistema de CRM",
                "url": "https://api.exemplo.com/webhooks",
                "events": ["conversation.created", "conversation.completed"],
                "active": True,
                "retry_count": 3,
                "timeout_seconds": 30,
                "status": "active",
                "success_rate": 95.5,
                "total_deliveries": 1250,
                "successful_deliveries": 1194,
                "created_at": "2024-01-01T10:00:00Z"
            }
        }

class WebhookWithDeliveries(WebhookConfigResponse):
    """Webhook com entregas recentes"""
    recent_deliveries: List[WebhookDelivery] = Field(
        default_factory=list, 
        description="Entregas recentes (últimas 10)"
    )

# Modelos para operações específicas
class WebhookTest(BaseModel):
    """Modelo para teste de webhook"""
    event_type: WebhookEventType = Field(..., description="Tipo de evento para teste")
    test_data: Optional[Dict[str, Any]] = Field(None, description="Dados de teste customizados")

class WebhookTestResult(BaseModel):
    """Resultado do teste de webhook"""
    webhook_id: str = Field(..., description="ID do webhook")
    test_timestamp: datetime = Field(..., description="Timestamp do teste")
    success: bool = Field(..., description="Se o teste foi bem-sucedido")
    status_code: Optional[int] = Field(None, description="Código de status HTTP")
    response_time_ms: Optional[int] = Field(None, description="Tempo de resposta (ms)")
    error_message: Optional[str] = Field(None, description="Mensagem de erro")
    payload_sent: Dict[str, Any] = Field(..., description="Payload enviado")
    response_received: Optional[str] = Field(None, description="Resposta recebida")

class WebhookBulkAction(BaseModel):
    """Ação em lote para webhooks"""
    webhook_ids: List[str] = Field(..., description="IDs dos webhooks")
    action: str = Field(..., description="Ação a ser executada")
    parameters: Optional[Dict[str, Any]] = Field(None, description="Parâmetros da ação")
    
    @validator('webhook_ids')
    def validate_webhook_ids(cls, v):
        if len(v) == 0:
            raise ValueError('Pelo menos um webhook_id deve ser fornecido')
        if len(v) > 50:
            raise ValueError('Máximo de 50 webhooks por operação em lote')
        return v
    
    @validator('action')
    def validate_action(cls, v):
        allowed_actions = ['activate', 'deactivate', 'delete', 'test', 'retry_failed']
        if v not in allowed_actions:
            raise ValueError(f'Ação deve ser uma de: {", ".join(allowed_actions)}')
        return v

class WebhookDeliveryFilter(BaseModel):
    """Filtros para busca de entregas"""
    webhook_config_id: Optional[str] = Field(None, description="ID da configuração")
    event_type: Optional[WebhookEventType] = Field(None, description="Tipo do evento")
    status: Optional[DeliveryStatus] = Field(None, description="Status da entrega")
    date_start: Optional[datetime] = Field(None, description="Data de início")
    date_end: Optional[datetime] = Field(None, description="Data de fim")
    min_attempts: Optional[int] = Field(None, description="Mínimo de tentativas")
    max_attempts: Optional[int] = Field(None, description="Máximo de tentativas")
    
    @root_validator
    def validate_date_range(cls, values):
        date_start = values.get('date_start')
        date_end = values.get('date_end')
        
        if date_start and date_end and date_start >= date_end:
            raise ValueError('date_start deve ser anterior a date_end')
        
        return values

# Modelos para analytics de webhooks
class WebhookAnalytics(BaseModel):
    """Analytics de webhooks"""
    period_start: datetime = Field(..., description="Início do período")
    period_end: datetime = Field(..., description="Fim do período")
    
    # Métricas gerais
    total_webhooks: int = Field(0, description="Total de webhooks")
    active_webhooks: int = Field(0, description="Webhooks ativos")
    total_deliveries: int = Field(0, description="Total de entregas")
    successful_deliveries: int = Field(0, description="Entregas bem-sucedidas")
    failed_deliveries: int = Field(0, description="Entregas falhadas")
    
    # Performance
    avg_response_time: float = Field(0.0, description="Tempo médio de resposta (ms)")
    success_rate: float = Field(0.0, description="Taxa de sucesso geral (%)")
    retry_rate: float = Field(0.0, description="Taxa de retry (%)")
    
    # Por evento
    deliveries_by_event: Dict[str, int] = Field(
        default_factory=dict, 
        description="Entregas por tipo de evento"
    )
    
    # Por webhook
    top_performing_webhooks: List[Dict[str, Any]] = Field(
        default_factory=list, 
        description="Webhooks com melhor performance"
    )
    
    problematic_webhooks: List[Dict[str, Any]] = Field(
        default_factory=list, 
        description="Webhooks com problemas"
    )
    
    # Tendências
    daily_deliveries: List[Dict[str, Any]] = Field(
        default_factory=list, 
        description="Entregas diárias"
    )

class WebhookHealth(BaseModel):
    """Saúde dos webhooks"""
    webhook_id: str = Field(..., description="ID do webhook")
    health_score: float = Field(..., description="Score de saúde (0-100)")
    status: WebhookStatus = Field(..., description="Status atual")
    last_check: datetime = Field(..., description="Última verificação")
    
    # Métricas de saúde
    success_rate_7d: float = Field(..., description="Taxa de sucesso (7 dias)")
    avg_response_time_7d: float = Field(..., description="Tempo médio de resposta (7 dias)")
    uptime_percentage: float = Field(..., description="Uptime (%)")
    
    # Problemas identificados
    issues: List[str] = Field(default_factory=list, description="Problemas identificados")
    recommendations: List[str] = Field(default_factory=list, description="Recomendações")
    
    @property
    def is_healthy(self) -> bool:
        """Verificar se está saudável"""
        return self.health_score >= 80.0 and len(self.issues) == 0

class WebhookSecurityEvent(BaseModel):
    """Evento de segurança de webhook"""
    webhook_id: str = Field(..., description="ID do webhook")
    event_type: str = Field(..., description="Tipo do evento de segurança")
    severity: str = Field(..., description="Severidade")
    description: str = Field(..., description="Descrição do evento")
    source_ip: Optional[str] = Field(None, description="IP de origem")
    timestamp: datetime = Field(..., description="Timestamp do evento")
    resolved: bool = Field(False, description="Se foi resolvido")
    
    @validator('event_type')
    def validate_event_type(cls, v):
        allowed_types = ['invalid_signature', 'rate_limit_exceeded', 'suspicious_activity', 'timeout', 'unauthorized_access']
        if v not in allowed_types:
            raise ValueError(f'Tipo de evento deve ser um de: {", ".join(allowed_types)}')
        return v
    
    @validator('severity')
    def validate_severity(cls, v):
        allowed_severities = ['low', 'medium', 'high', 'critical']
        if v not in allowed_severities:
            raise ValueError(f'Severidade deve ser uma de: {", ".join(allowed_severities)}')
        return v