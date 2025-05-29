"""
Modelos Pydantic para Conversation e Message com validação robusta
"""

from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

from pydantic import Field, validator, root_validator
from .base import (
    BaseModel, TimestampMixin, ConversationStatus,
    AgentModelName
)

class MessageRole(str, Enum):
    """Roles de mensagem"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    FUNCTION = "function"

class MessageType(str, Enum):
    """Tipos de mensagem"""
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    FUNCTION_CALL = "function_call"
    FUNCTION_RESPONSE = "function_response"

class ConversationBase(BaseModel):
    """Modelo base para Conversation"""
    title: Optional[str] = Field(None, description="Título da conversa")
    summary: Optional[str] = Field(None, description="Resumo da conversa")
    status: ConversationStatus = Field(ConversationStatus.ACTIVE, description="Status da conversa")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadados da conversa")
    
    @validator('title')
    def validate_title(cls, v):
        if v is not None:
            if len(v.strip()) < 1:
                raise ValueError('Título não pode estar vazio')
            if len(v) > 200:
                raise ValueError('Título deve ter no máximo 200 caracteres')
            return v.strip()
        return v
    
    @validator('summary')
    def validate_summary(cls, v):
        if v is not None:
            if len(v) > 1000:
                raise ValueError('Resumo deve ter no máximo 1000 caracteres')
            return v.strip()
        return v

class ConversationCreate(ConversationBase):
    """Modelo para criação de Conversation"""
    agent_id: str = Field(..., description="ID do agente")
    user_id: str = Field(..., description="ID do usuário")
    initial_message: Optional[str] = Field(None, description="Mensagem inicial")
    
    @validator('initial_message')
    def validate_initial_message(cls, v):
        if v is not None:
            if len(v.strip()) < 1:
                raise ValueError('Mensagem inicial não pode estar vazia')
            if len(v) > 4000:
                raise ValueError('Mensagem inicial deve ter no máximo 4000 caracteres')
            return v.strip()
        return v

class ConversationUpdate(BaseModel):
    """Modelo para atualização de Conversation"""
    title: Optional[str] = Field(None, description="Título da conversa")
    summary: Optional[str] = Field(None, description="Resumo da conversa")
    status: Optional[ConversationStatus] = Field(None, description="Status da conversa")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadados da conversa")
    
    @validator('title')
    def validate_title(cls, v):
        if v is not None:
            if len(v.strip()) < 1:
                raise ValueError('Título não pode estar vazio')
            if len(v) > 200:
                raise ValueError('Título deve ter no máximo 200 caracteres')
            return v.strip()
        return v

class MessageBase(BaseModel):
    """Modelo base para Message"""
    content: str = Field(..., description="Conteúdo da mensagem")
    role: MessageRole = Field(..., description="Role da mensagem")
    type: MessageType = Field(MessageType.TEXT, description="Tipo da mensagem")
    tokens_used: Optional[int] = Field(None, description="Tokens utilizados")
    model_used: Optional[str] = Field(None, description="Modelo utilizado")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadados da mensagem")
    
    @validator('content')
    def validate_content(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Conteúdo da mensagem não pode estar vazio')
        if len(v) > 10000:
            raise ValueError('Conteúdo da mensagem deve ter no máximo 10000 caracteres')
        return v.strip()
    
    @validator('tokens_used')
    def validate_tokens_used(cls, v):
        if v is not None and v < 0:
            raise ValueError('tokens_used deve ser um número positivo')
        return v

class MessageCreate(MessageBase):
    """Modelo para criação de Message"""
    conversation_id: str = Field(..., description="ID da conversa")
    parent_message_id: Optional[str] = Field(None, description="ID da mensagem pai")

class MessageUpdate(BaseModel):
    """Modelo para atualização de Message"""
    content: Optional[str] = Field(None, description="Conteúdo da mensagem")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadados da mensagem")
    
    @validator('content')
    def validate_content(cls, v):
        if v is not None:
            if len(v.strip()) < 1:
                raise ValueError('Conteúdo da mensagem não pode estar vazio')
            if len(v) > 10000:
                raise ValueError('Conteúdo da mensagem deve ter no máximo 10000 caracteres')
            return v.strip()
        return v

class MessageResponse(MessageBase, TimestampMixin):
    """Modelo de resposta para Message"""
    id: str = Field(..., description="ID único da mensagem")
    conversation_id: str = Field(..., description="ID da conversa")
    parent_message_id: Optional[str] = Field(None, description="ID da mensagem pai")
    
    class Config:
        schema_extra = {
            "example": {
                "id": "msg_123",
                "conversation_id": "conv_123",
                "content": "Olá! Como posso ajudá-lo?",
                "role": "assistant",
                "type": "text",
                "tokens_used": 15,
                "model_used": "gpt-4",
                "created_at": "2024-01-01T10:00:00Z",
                "updated_at": "2024-01-01T10:00:00Z"
            }
        }

class AgentInfo(BaseModel):
    """Informações básicas do agente para Conversation"""
    id: str = Field(..., description="ID do agente")
    name: str = Field(..., description="Nome do agente")
    model_name: AgentModelName = Field(..., description="Modelo de IA utilizado")

class UserInfo(BaseModel):
    """Informações básicas do usuário para Conversation"""
    id: str = Field(..., description="ID do usuário")
    name: Optional[str] = Field(None, description="Nome do usuário")
    email: str = Field(..., description="Email do usuário")

class ConversationResponse(ConversationBase, TimestampMixin):
    """Modelo de resposta para Conversation"""
    id: str = Field(..., description="ID único da conversa")
    agent_id: str = Field(..., description="ID do agente")
    user_id: str = Field(..., description="ID do usuário")
    agent: Optional[AgentInfo] = Field(None, description="Informações do agente")
    user: Optional[UserInfo] = Field(None, description="Informações do usuário")
    message_count: int = Field(0, description="Número de mensagens")
    
    class Config:
        schema_extra = {
            "example": {
                "id": "conv_123",
                "title": "Consulta sobre produtos",
                "summary": "Cliente perguntou sobre disponibilidade de produtos",
                "status": "active",
                "agent_id": "agent_123",
                "user_id": "user_123",
                "message_count": 5,
                "created_at": "2024-01-01T10:00:00Z",
                "updated_at": "2024-01-01T10:00:00Z"
            }
        }

class ConversationWithMessages(ConversationResponse):
    """Conversation com mensagens incluídas"""
    messages: List[MessageResponse] = Field(
        default_factory=list, 
        description="Mensagens da conversa"
    )

class ConversationSummary(BaseModel):
    """Resumo de conversa para listagens"""
    id: str = Field(..., description="ID da conversa")
    title: Optional[str] = Field(None, description="Título da conversa")
    summary: Optional[str] = Field(None, description="Resumo da conversa")
    status: ConversationStatus = Field(..., description="Status da conversa")
    message_count: int = Field(..., description="Número de mensagens")
    last_message_at: Optional[datetime] = Field(None, description="Data da última mensagem")
    agent_name: str = Field(..., description="Nome do agente")
    user_name: Optional[str] = Field(None, description="Nome do usuário")
    created_at: datetime = Field(..., description="Data de criação")

class ConversationStats(BaseModel):
    """Estatísticas da conversa"""
    total_messages: int = Field(0, description="Total de mensagens")
    user_messages: int = Field(0, description="Mensagens do usuário")
    assistant_messages: int = Field(0, description="Mensagens do assistente")
    total_tokens: int = Field(0, description="Total de tokens utilizados")
    avg_response_time: float = Field(0.0, description="Tempo médio de resposta (ms)")
    conversation_duration: float = Field(0.0, description="Duração da conversa (minutos)")
    satisfaction_score: Optional[float] = Field(None, description="Score de satisfação (1-5)")

class ConversationWithStats(ConversationResponse):
    """Conversation com estatísticas incluídas"""
    stats: ConversationStats = Field(..., description="Estatísticas da conversa")
    recent_messages: List[MessageResponse] = Field(
        default_factory=list, 
        description="Mensagens recentes (últimas 5)"
    )

# Modelos para operações específicas
class ConversationArchive(BaseModel):
    """Modelo para arquivamento de conversa"""
    reason: Optional[str] = Field(None, description="Motivo do arquivamento", max_length=500)

class ConversationExport(BaseModel):
    """Modelo para exportação de conversa"""
    format: str = Field("json", description="Formato de exportação")
    include_metadata: bool = Field(True, description="Incluir metadados")
    include_stats: bool = Field(False, description="Incluir estatísticas")
    
    @validator('format')
    def validate_format(cls, v):
        allowed_formats = ['json', 'csv', 'txt', 'pdf']
        if v not in allowed_formats:
            raise ValueError(f'Formato deve ser um de: {", ".join(allowed_formats)}')
        return v

class ConversationTransfer(BaseModel):
    """Modelo para transferência de conversa"""
    new_agent_id: str = Field(..., description="ID do novo agente")
    transfer_reason: Optional[str] = Field(None, description="Motivo da transferência", max_length=500)
    preserve_context: bool = Field(True, description="Preservar contexto da conversa")

class ConversationBulkAction(BaseModel):
    """Modelo para ações em lote"""
    conversation_ids: List[str] = Field(..., description="IDs das conversas")
    action: str = Field(..., description="Ação a ser executada")
    parameters: Optional[Dict[str, Any]] = Field(None, description="Parâmetros da ação")
    
    @validator('conversation_ids')
    def validate_conversation_ids(cls, v):
        if len(v) == 0:
            raise ValueError('Pelo menos um conversation_id deve ser fornecido')
        if len(v) > 100:
            raise ValueError('Máximo de 100 conversas por operação em lote')
        return v
    
    @validator('action')
    def validate_action(cls, v):
        allowed_actions = ['archive', 'delete', 'transfer', 'update_status', 'export']
        if v not in allowed_actions:
            raise ValueError(f'Ação deve ser uma de: {", ".join(allowed_actions)}')
        return v

# Modelos para busca e filtros
class ConversationFilter(BaseModel):
    """Filtros para busca de conversas"""
    status: Optional[ConversationStatus] = Field(None, description="Filtrar por status")
    agent_id: Optional[str] = Field(None, description="Filtrar por agente")
    user_id: Optional[str] = Field(None, description="Filtrar por usuário")
    date_start: Optional[datetime] = Field(None, description="Data de início")
    date_end: Optional[datetime] = Field(None, description="Data de fim")
    has_title: Optional[bool] = Field(None, description="Tem título")
    min_messages: Optional[int] = Field(None, description="Mínimo de mensagens")
    max_messages: Optional[int] = Field(None, description="Máximo de mensagens")
    search_query: Optional[str] = Field(None, description="Busca no conteúdo", max_length=100)
    
    @validator('min_messages')
    def validate_min_messages(cls, v):
        if v is not None and v < 0:
            raise ValueError('min_messages deve ser positivo')
        return v
    
    @validator('max_messages')
    def validate_max_messages(cls, v):
        if v is not None and v < 0:
            raise ValueError('max_messages deve ser positivo')
        return v
    
    @root_validator
    def validate_date_range(cls, values):
        date_start = values.get('date_start')
        date_end = values.get('date_end')
        
        if date_start and date_end and date_start > date_end:
            raise ValueError('date_start deve ser anterior a date_end')
        
        return values

class MessageFilter(BaseModel):
    """Filtros para busca de mensagens"""
    role: Optional[MessageRole] = Field(None, description="Filtrar por role")
    type: Optional[MessageType] = Field(None, description="Filtrar por tipo")
    date_start: Optional[datetime] = Field(None, description="Data de início")
    date_end: Optional[datetime] = Field(None, description="Data de fim")
    min_tokens: Optional[int] = Field(None, description="Mínimo de tokens")
    max_tokens: Optional[int] = Field(None, description="Máximo de tokens")
    model_used: Optional[str] = Field(None, description="Modelo utilizado")
    search_query: Optional[str] = Field(None, description="Busca no conteúdo", max_length=100)

# Modelos para análise de conversas
class ConversationAnalytics(BaseModel):
    """Analytics de conversas"""
    period_start: datetime = Field(..., description="Início do período")
    period_end: datetime = Field(..., description="Fim do período")
    
    # Métricas gerais
    total_conversations: int = Field(0, description="Total de conversas")
    new_conversations: int = Field(0, description="Novas conversas")
    completed_conversations: int = Field(0, description="Conversas completadas")
    archived_conversations: int = Field(0, description="Conversas arquivadas")
    
    # Métricas de mensagens
    total_messages: int = Field(0, description="Total de mensagens")
    avg_messages_per_conversation: float = Field(0.0, description="Média de mensagens por conversa")
    total_tokens: int = Field(0, description="Total de tokens")
    avg_tokens_per_message: float = Field(0.0, description="Média de tokens por mensagem")
    
    # Métricas de tempo
    avg_conversation_duration: float = Field(0.0, description="Duração média das conversas (minutos)")
    avg_response_time: float = Field(0.0, description="Tempo médio de resposta (ms)")
    
    # Métricas de satisfação
    avg_satisfaction_score: Optional[float] = Field(None, description="Score médio de satisfação")
    satisfaction_responses: int = Field(0, description="Número de avaliações")
    
    # Agentes mais utilizados
    top_agents: List[Dict[str, Any]] = Field(
        default_factory=list, 
        description="Top agentes por conversas"
    )
    
    # Horários de pico
    hourly_distribution: Dict[str, int] = Field(
        default_factory=dict, 
        description="Distribuição por hora do dia"
    )

class ConversationTrend(BaseModel):
    """Tendência de conversas"""
    date: datetime = Field(..., description="Data")
    conversation_count: int = Field(0, description="Número de conversas")
    message_count: int = Field(0, description="Número de mensagens")
    unique_users: int = Field(0, description="Usuários únicos")
    avg_satisfaction: Optional[float] = Field(None, description="Satisfação média")

class ConversationInsights(BaseModel):
    """Insights de conversas"""
    most_active_hour: int = Field(..., description="Hora mais ativa (0-23)")
    most_active_day: str = Field(..., description="Dia mais ativo da semana")
    avg_resolution_time: float = Field(..., description="Tempo médio de resolução (minutos)")
    common_topics: List[str] = Field(default_factory=list, description="Tópicos mais comuns")
    user_retention_rate: float = Field(..., description="Taxa de retenção de usuários (%)")
    escalation_rate: float = Field(..., description="Taxa de escalação (%)")
    
    # Recomendações automáticas
    recommendations: List[str] = Field(
        default_factory=list, 
        description="Recomendações de melhoria"
    )