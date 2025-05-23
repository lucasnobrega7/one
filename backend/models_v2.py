"""
Modelos Pydantic v2.0 - Agentes de Conversação
Modelos avançados para API com validação completa
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

# ============================================
# ENUMS
# ============================================

class AgentToolType(str, Enum):
    HTTP = "http"
    SEARCH = "search"
    CALCULATOR = "calculator"
    LEAD_CAPTURE = "lead_capture"
    FORM = "form"
    WEBHOOK = "webhook"

class ModelProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    MISTRAL = "mistral"

class ConversationStatus(str, Enum):
    ACTIVE = "active"
    RESOLVED = "resolved"
    HUMAN_REQUESTED = "human_requested"

class EventType(str, Enum):
    PROGRESS = "progress"
    ANSWER = "answer"
    SOURCE = "source"
    METADATA = "metadata"
    DONE = "done"
    ERROR = "error"

# ============================================
# BASE MODELS
# ============================================

class BaseResponse(BaseModel):
    """Resposta base para todos os endpoints"""
    success: bool
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaginatedResponse(BaseResponse):
    """Resposta paginada"""
    data: List[Any]
    count: int
    page: int = 1
    per_page: int = 20
    total_pages: int

# ============================================
# AGENT MODELS
# ============================================

class AgentTool(BaseModel):
    """Ferramenta de agente"""
    id: Optional[str] = None
    type: AgentToolType
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    config: Dict[str, Any]
    is_active: bool = True
    created_at: Optional[datetime] = None
    
    @validator('config')
    def validate_config(cls, v, values):
        """Validar configuração por tipo de ferramenta"""
        tool_type = values.get('type')
        
        if tool_type == AgentToolType.HTTP:
            required_fields = ['url', 'method']
            for field in required_fields:
                if field not in v:
                    raise ValueError(f"Campo '{field}' é obrigatório para ferramentas HTTP")
        
        elif tool_type == AgentToolType.SEARCH:
            if 'search_engine' not in v:
                raise ValueError("Campo 'search_engine' é obrigatório para ferramentas de busca")
        
        elif tool_type == AgentToolType.LEAD_CAPTURE:
            if 'required_fields' not in v or not v['required_fields']:
                raise ValueError("Campo 'required_fields' é obrigatório para captura de leads")
        
        return v

class CreateAgentRequest(BaseModel):
    """Request para criar agente"""
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=1000)
    system_prompt: str = Field(..., min_length=10, max_length=5000)
    model_id: str = Field(default="gpt-4")
    temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=2048, ge=1, le=8192)
    tools: List[AgentTool] = Field(default=[])
    visibility: str = Field(default="private", regex="^(public|private)$")
    knowledge_base_id: Optional[str] = None
    interface_config: Optional[Dict[str, Any]] = None

class UpdateAgentRequest(BaseModel):
    """Request para atualizar agente"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=1000)
    system_prompt: Optional[str] = Field(None, min_length=10, max_length=5000)
    model_id: Optional[str] = None
    temperature: Optional[float] = Field(None, ge=0, le=2)
    max_tokens: Optional[int] = Field(None, ge=1, le=8192)
    tools: Optional[List[AgentTool]] = None
    visibility: Optional[str] = Field(None, regex="^(public|private)$")
    knowledge_base_id: Optional[str] = None
    interface_config: Optional[Dict[str, Any]] = None

class Agent(BaseModel):
    """Modelo de agente completo"""
    id: str
    user_id: str
    organization_id: str
    name: str
    description: str
    system_prompt: str
    model_id: str
    temperature: float
    max_tokens: int
    visibility: str
    knowledge_base_id: Optional[str] = None
    interface_config: Optional[Dict[str, Any]] = None
    tools: List[AgentTool] = []
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

# ============================================
# CHAT MODELS
# ============================================

class Message(BaseModel):
    """Modelo de mensagem"""
    role: str = Field(..., regex="^(user|assistant|system)$")
    content: str = Field(..., min_length=1)
    metadata: Optional[Dict[str, Any]] = None

class StreamChatRequest(BaseModel):
    """Request para chat com streaming"""
    messages: List[Message] = Field(..., min_items=1)
    conversation_id: Optional[str] = None
    temperature: Optional[float] = Field(None, ge=0, le=2)
    max_tokens: Optional[int] = Field(None, ge=1, le=8192)
    context_data: Optional[Dict[str, Any]] = None
    system_prompt_override: Optional[str] = None
    streaming: bool = True

class StreamEvent(BaseModel):
    """Evento de stream"""
    event: EventType
    data: Any
    conversation_id: Optional[str] = None
    message_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatResponse(BaseModel):
    """Resposta de chat"""
    answer: str
    conversation_id: str
    message_id: str
    sources: List[Dict[str, Any]] = []
    metadata: Optional[Dict[str, Any]] = None

# ============================================
# KNOWLEDGE MODELS
# ============================================

class KnowledgeSearchRequest(BaseModel):
    """Request para busca semântica"""
    query: str = Field(..., min_length=1, max_length=1000)
    knowledge_base_id: str
    top_k: int = Field(default=5, ge=1, le=20)
    threshold: float = Field(default=0.7, ge=0, le=1)
    filters: Optional[Dict[str, Any]] = None

class SearchResult(BaseModel):
    """Resultado de busca"""
    id: str
    name: str
    content: str
    score: float = Field(..., ge=0, le=1)
    metadata: Dict[str, Any] = {}
    relevant_chunk: Optional[str] = None

class KnowledgeSearchResponse(BaseResponse):
    """Resposta de busca semântica"""
    data: List[SearchResult]
    query: str
    total_results: int

class DocumentUploadRequest(BaseModel):
    """Request para upload de documento"""
    knowledge_base_id: str
    file_name: str
    file_type: str
    content: Optional[str] = None

# ============================================
# ANALYTICS MODELS
# ============================================

class AnalyticsOverview(BaseModel):
    """Visão geral de analytics"""
    total_agents: int
    total_conversations: int
    total_messages: int
    avg_response_time: float
    active_conversations: int
    user_satisfaction: float

class TimeSeriesData(BaseModel):
    """Dados de série temporal"""
    date: str
    conversations: int
    messages: int

class AgentPerformance(BaseModel):
    """Performance de agente"""
    id: str
    name: str
    conversations: int
    messages: int
    avg_response_time: float
    satisfaction: float

class AnalyticsResponse(BaseResponse):
    """Resposta de analytics"""
    data: Dict[str, Any]

class AnalyticsRequest(BaseModel):
    """Request para analytics"""
    period: str = Field(default="week", regex="^(day|week|month)$")
    agent_id: Optional[str] = None
    event_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

# ============================================
# WEBHOOK MODELS
# ============================================

class WebhookConfig(BaseModel):
    """Configuração de webhook"""
    name: str = Field(..., min_length=1, max_length=100)
    url: str = Field(..., regex=r'^https?://.+')
    events: List[str] = Field(..., min_items=1)
    secret: Optional[str] = None
    is_active: bool = True
    retry_count: int = Field(default=3, ge=0, le=10)
    timeout: int = Field(default=30, ge=1, le=300)

class Webhook(BaseModel):
    """Modelo de webhook"""
    id: str
    user_id: str
    name: str
    url: str
    events: List[str]
    secret: str
    is_active: bool
    retry_count: int
    timeout: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class WebhookDelivery(BaseModel):
    """Entrega de webhook"""
    id: str
    webhook_id: str
    event_type: str
    payload: Dict[str, Any]
    status_code: int
    response_body: Optional[str] = None
    error_message: Optional[str] = None
    delivered_at: datetime
    retry_count: int = 0

# ============================================
# SETTINGS MODELS
# ============================================

class UserSettings(BaseModel):
    """Configurações do usuário"""
    theme: str = Field(default="dark", regex="^(light|dark)$")
    language: str = Field(default="pt-br")
    email_notifications: bool = True
    push_notifications: bool = False
    default_model: str = Field(default="gpt-4")
    default_temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=2048, ge=1, le=8192)
    auto_save_conversations: bool = True
    conversation_history_limit: int = Field(default=100, ge=10, le=1000)
    advanced_features: bool = False

class UsageStatistics(BaseModel):
    """Estatísticas de uso"""
    total_requests: int
    total_tokens: int
    remaining_quota: int
    reset_date: Optional[datetime] = None

class SettingsResponse(BaseResponse):
    """Resposta de configurações"""
    data: Dict[str, Any]

# ============================================
# EVENT MODELS
# ============================================

class DashboardEvent(BaseModel):
    """Evento do dashboard"""
    type: str
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_id: Optional[str] = None

class EventFilter(BaseModel):
    """Filtro de eventos"""
    event_types: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    user_id: Optional[str] = None

# ============================================
# CONVERSATION MODELS
# ============================================

class Conversation(BaseModel):
    """Modelo de conversa"""
    id: str
    agent_id: str
    user_id: str
    visitor_id: Optional[str] = None
    title: Optional[str] = None
    status: ConversationStatus = ConversationStatus.ACTIVE
    metadata: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime
    messages: List[Message] = []

class ConversationUpdate(BaseModel):
    """Atualização de conversa"""
    title: Optional[str] = None
    status: Optional[ConversationStatus] = None
    metadata: Optional[Dict[str, Any]] = None

# ============================================
# ERROR MODELS
# ============================================

class ErrorResponse(BaseModel):
    """Resposta de erro"""
    success: bool = False
    error: str
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = None

class ValidationError(BaseModel):
    """Erro de validação"""
    field: str
    message: str
    value: Any

class DetailedErrorResponse(ErrorResponse):
    """Resposta de erro detalhada"""
    validation_errors: Optional[List[ValidationError]] = None

# ============================================
# SYSTEM MODELS
# ============================================

class HealthCheck(BaseModel):
    """Health check"""
    status: str
    timestamp: datetime
    version: str
    services: Dict[str, str]
    features: Dict[str, bool]

class SystemInfo(BaseModel):
    """Informações do sistema"""
    version: str
    environment: str
    uptime: int
    features: List[str]
    endpoints_count: int