"""
Modelos Pydantic para Agents com validação robusta
"""

from typing import Optional, Dict, Any, List
from datetime import datetime

from pydantic import Field, validator
from .base import (
    BaseModel, TimestampMixin, AgentModelName, DatastoreType,
    validate_agent_name, validate_temperature, validate_max_tokens,
    AgentConfigSchema
)

class AgentBase(BaseModel):
    """Modelo base para Agent"""
    name: str = Field(..., description="Nome do agente")
    description: str = Field(..., description="Descrição do agente")
    is_active: bool = Field(True, description="Se o agente está ativo")
    
    @validator('name')
    def validate_name_field(cls, v):
        return validate_agent_name(v)
    
    @validator('description')
    def validate_description_field(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Descrição deve ter pelo menos 10 caracteres')
        if len(v) > 500:
            raise ValueError('Descrição deve ter no máximo 500 caracteres')
        return v.strip()

class AgentCreate(AgentBase):
    """Modelo para criação de Agent"""
    system_prompt: Optional[str] = Field(None, description="Prompt do sistema")
    user_prompt: Optional[str] = Field(None, description="Prompt do usuário")
    model_name: AgentModelName = Field(AgentModelName.GPT_3_5_TURBO, description="Modelo de IA")
    temperature: float = Field(0.7, description="Temperatura do modelo")
    max_tokens: Optional[int] = Field(1000, description="Máximo de tokens")
    include_sources: bool = Field(True, description="Incluir fontes nas respostas")
    restrict_knowledge: bool = Field(True, description="Restringir ao conhecimento da base")
    icon_url: Optional[str] = Field(None, description="URL do ícone do agente")
    datastore_id: Optional[str] = Field(None, description="ID do datastore")
    
    @validator('system_prompt')
    def validate_system_prompt(cls, v):
        if v and len(v) > 2000:
            raise ValueError('System prompt deve ter no máximo 2000 caracteres')
        return v
    
    @validator('user_prompt')
    def validate_user_prompt(cls, v):
        if v and len(v) > 1000:
            raise ValueError('User prompt deve ter no máximo 1000 caracteres')
        return v
    
    @validator('temperature')
    def validate_temperature_field(cls, v):
        return validate_temperature(v)
    
    @validator('max_tokens')
    def validate_max_tokens_field(cls, v):
        if v is not None:
            return validate_max_tokens(v)
        return v
    
    @validator('icon_url')
    def validate_icon_url(cls, v):
        if v:
            import re
            url_pattern = r'^https?://.+'
            if not re.match(url_pattern, v):
                raise ValueError('icon_url deve ser uma URL válida')
        return v

class AgentUpdate(BaseModel):
    """Modelo para atualização de Agent"""
    name: Optional[str] = Field(None, description="Nome do agente")
    description: Optional[str] = Field(None, description="Descrição do agente")
    system_prompt: Optional[str] = Field(None, description="Prompt do sistema")
    user_prompt: Optional[str] = Field(None, description="Prompt do usuário")
    model_name: Optional[AgentModelName] = Field(None, description="Modelo de IA")
    temperature: Optional[float] = Field(None, description="Temperatura do modelo")
    max_tokens: Optional[int] = Field(None, description="Máximo de tokens")
    include_sources: Optional[bool] = Field(None, description="Incluir fontes nas respostas")
    restrict_knowledge: Optional[bool] = Field(None, description="Restringir ao conhecimento da base")
    icon_url: Optional[str] = Field(None, description="URL do ícone do agente")
    is_active: Optional[bool] = Field(None, description="Se o agente está ativo")
    datastore_id: Optional[str] = Field(None, description="ID do datastore")
    
    @validator('name')
    def validate_name_field(cls, v):
        if v is not None:
            return validate_agent_name(v)
        return v
    
    @validator('description')
    def validate_description_field(cls, v):
        if v is not None:
            if len(v.strip()) < 10:
                raise ValueError('Descrição deve ter pelo menos 10 caracteres')
            if len(v) > 500:
                raise ValueError('Descrição deve ter no máximo 500 caracteres')
            return v.strip()
        return v
    
    @validator('temperature')
    def validate_temperature_field(cls, v):
        if v is not None:
            return validate_temperature(v)
        return v
    
    @validator('max_tokens')
    def validate_max_tokens_field(cls, v):
        if v is not None:
            return validate_max_tokens(v)
        return v

class AgentConfigUpdate(BaseModel):
    """Modelo para atualização específica de configuração"""
    system_prompt: Optional[str] = Field(None, description="Prompt do sistema")
    user_prompt: Optional[str] = Field(None, description="Prompt do usuário")
    temperature: Optional[float] = Field(None, description="Temperatura do modelo")
    max_tokens: Optional[int] = Field(None, description="Máximo de tokens")
    include_sources: Optional[bool] = Field(None, description="Incluir fontes nas respostas")
    restrict_knowledge: Optional[bool] = Field(None, description="Restringir ao conhecimento da base")
    custom_instructions: Optional[str] = Field(None, description="Instruções customizadas")
    
    @validator('custom_instructions')
    def validate_custom_instructions(cls, v):
        if v and len(v) > 500:
            raise ValueError('Instruções customizadas devem ter no máximo 500 caracteres')
        return v

class DatastoreInfo(BaseModel):
    """Informações de Datastore para Agent"""
    id: str = Field(..., description="ID do datastore")
    name: str = Field(..., description="Nome do datastore")
    type: DatastoreType = Field(..., description="Tipo do datastore")
    documents_count: Optional[int] = Field(None, description="Número de documentos")

class ConversationSummary(BaseModel):
    """Resumo de conversa para Agent"""
    id: str = Field(..., description="ID da conversa")
    title: Optional[str] = Field(None, description="Título da conversa")
    status: str = Field(..., description="Status da conversa")
    message_count: int = Field(..., description="Número de mensagens")
    created_at: datetime = Field(..., description="Data de criação")
    last_message_at: Optional[datetime] = Field(None, description="Data da última mensagem")

class AgentStats(BaseModel):
    """Estatísticas do Agent"""
    conversation_count: int = Field(0, description="Total de conversas")
    message_count: int = Field(0, description="Total de mensagens")
    unique_users: int = Field(0, description="Usuários únicos")
    avg_conversation_length: float = Field(0.0, description="Média de mensagens por conversa")
    total_tokens_used: int = Field(0, description="Total de tokens utilizados")
    avg_response_time_ms: float = Field(0.0, description="Tempo médio de resposta")
    satisfaction_score: Optional[float] = Field(None, description="Score de satisfação (0-5)")
    last_active: Optional[datetime] = Field(None, description="Última atividade")

class AgentResponse(AgentBase, TimestampMixin):
    """Modelo de resposta para Agent"""
    id: str = Field(..., description="ID único do agente")
    system_prompt: Optional[str] = Field(None, description="Prompt do sistema")
    user_prompt: Optional[str] = Field(None, description="Prompt do usuário")
    model_name: AgentModelName = Field(..., description="Modelo de IA")
    temperature: float = Field(..., description="Temperatura do modelo")
    max_tokens: Optional[int] = Field(None, description="Máximo de tokens")
    include_sources: bool = Field(..., description="Incluir fontes nas respostas")
    restrict_knowledge: bool = Field(..., description="Restringir ao conhecimento da base")
    icon_url: Optional[str] = Field(None, description="URL do ícone do agente")
    organization_id: str = Field(..., description="ID da organização")
    datastore_id: Optional[str] = Field(None, description="ID do datastore")
    datastore: Optional[DatastoreInfo] = Field(None, description="Informações do datastore")
    
    class Config:
        schema_extra = {
            "example": {
                "id": "agent_123",
                "name": "Assistente de Vendas",
                "description": "Agente especializado em vendas e atendimento ao cliente",
                "system_prompt": "Você é um assistente de vendas especializado...",
                "model_name": "gpt_4",
                "temperature": 0.7,
                "max_tokens": 1000,
                "include_sources": True,
                "restrict_knowledge": True,
                "is_active": True,
                "organization_id": "org_123",
                "created_at": "2024-01-01T10:00:00Z",
                "updated_at": "2024-01-01T10:00:00Z"
            }
        }

class AgentWithStats(AgentResponse):
    """Agent com estatísticas incluídas"""
    stats: AgentStats = Field(..., description="Estatísticas do agente")
    recent_conversations: List[ConversationSummary] = Field(
        default_factory=list, 
        description="Conversas recentes"
    )

class AgentListResponse(BaseModel):
    """Resposta para lista de agents"""
    id: str = Field(..., description="ID único do agente")
    name: str = Field(..., description="Nome do agente")
    description: str = Field(..., description="Descrição do agente")
    model_name: AgentModelName = Field(..., description="Modelo de IA")
    is_active: bool = Field(..., description="Se o agente está ativo")
    conversation_count: int = Field(0, description="Total de conversas")
    last_active: Optional[datetime] = Field(None, description="Última atividade")
    created_at: datetime = Field(..., description="Data de criação")
    datastore: Optional[DatastoreInfo] = Field(None, description="Informações do datastore")

# Modelos para operações específicas
class AgentDuplicate(BaseModel):
    """Modelo para duplicação de agent"""
    new_name: str = Field(..., description="Nome do novo agente")
    copy_datastore: bool = Field(False, description="Copiar datastore também")
    
    @validator('new_name')
    def validate_new_name(cls, v):
        return validate_agent_name(v)

class AgentBulkUpdate(BaseModel):
    """Modelo para atualização em lote"""
    agent_ids: List[str] = Field(..., description="IDs dos agentes")
    updates: AgentUpdate = Field(..., description="Atualizações a aplicar")
    
    @validator('agent_ids')
    def validate_agent_ids(cls, v):
        if len(v) == 0:
            raise ValueError('Pelo menos um agent_id deve ser fornecido')
        if len(v) > 50:
            raise ValueError('Máximo de 50 agentes por operação em lote')
        return v

class AgentExport(BaseModel):
    """Modelo para exportação de agent"""
    format: str = Field("json", description="Formato de exportação")
    include_conversations: bool = Field(False, description="Incluir conversas")
    include_datastore: bool = Field(False, description="Incluir datastore")
    date_range: Optional[Dict[str, datetime]] = Field(None, description="Filtro de data")
    
    @validator('format')
    def validate_format(cls, v):
        allowed_formats = ['json', 'csv', 'xlsx']
        if v not in allowed_formats:
            raise ValueError(f'Formato deve ser um de: {", ".join(allowed_formats)}')
        return v

class AgentImport(BaseModel):
    """Modelo para importação de agent"""
    agent_data: Dict[str, Any] = Field(..., description="Dados do agente")
    merge_strategy: str = Field("overwrite", description="Estratégia de merge")
    create_datastore: bool = Field(True, description="Criar datastore se não existir")
    
    @validator('merge_strategy')
    def validate_merge_strategy(cls, v):
        allowed_strategies = ['overwrite', 'merge', 'skip']
        if v not in allowed_strategies:
            raise ValueError(f'Estratégia deve ser uma de: {", ".join(allowed_strategies)}')
        return v

# Modelos para análise e otimização
class AgentPerformanceMetrics(BaseModel):
    """Métricas de performance do agente"""
    response_time_p50: float = Field(..., description="Tempo de resposta P50 (ms)")
    response_time_p95: float = Field(..., description="Tempo de resposta P95 (ms)")
    response_time_p99: float = Field(..., description="Tempo de resposta P99 (ms)")
    success_rate: float = Field(..., description="Taxa de sucesso (%)")
    error_rate: float = Field(..., description="Taxa de erro (%)")
    token_efficiency: float = Field(..., description="Eficiência de tokens (respostas/token)")
    user_satisfaction: Optional[float] = Field(None, description="Satisfação do usuário (0-5)")
    engagement_score: float = Field(..., description="Score de engajamento")

class AgentOptimizationSuggestion(BaseModel):
    """Sugestão de otimização para agent"""
    type: str = Field(..., description="Tipo de otimização")
    priority: str = Field(..., description="Prioridade (high/medium/low)")
    description: str = Field(..., description="Descrição da sugestão")
    expected_improvement: str = Field(..., description="Melhoria esperada")
    implementation_effort: str = Field(..., description="Esforço de implementação")

class AgentAnalytics(BaseModel):
    """Analytics completo do agent"""
    basic_stats: AgentStats = Field(..., description="Estatísticas básicas")
    performance_metrics: AgentPerformanceMetrics = Field(..., description="Métricas de performance")
    optimization_suggestions: List[AgentOptimizationSuggestion] = Field(
        default_factory=list, 
        description="Sugestões de otimização"
    )
    usage_trends: Dict[str, Any] = Field(
        default_factory=dict, 
        description="Tendências de uso"
    )