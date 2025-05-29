"""
Modelos Pydantic para Analytics com validação robusta
"""

from typing import Optional, List, Dict, Any, Union
from datetime import datetime, date
from enum import Enum

from pydantic import Field, validator, root_validator
from .base import BaseModel, TimestampMixin

class AnalyticsTimeframe(str, Enum):
    """Timeframes para analytics"""
    HOUR = "hour"
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"

class MetricType(str, Enum):
    """Tipos de métricas"""
    COUNT = "count"
    SUM = "sum"
    AVERAGE = "average"
    PERCENTAGE = "percentage"
    RATIO = "ratio"

class EventType(str, Enum):
    """Tipos de eventos para analytics"""
    USER_SIGNUP = "user_signup"
    USER_LOGIN = "user_login"
    CONVERSATION_STARTED = "conversation_started"
    CONVERSATION_COMPLETED = "conversation_completed"
    MESSAGE_SENT = "message_sent"
    MESSAGE_RECEIVED = "message_received"
    AGENT_CREATED = "agent_created"
    AGENT_UPDATED = "agent_updated"
    INTEGRATION_CONNECTED = "integration_connected"
    PAYMENT_COMPLETED = "payment_completed"
    ERROR_OCCURRED = "error_occurred"

class AnalyticsQuery(BaseModel):
    """Query para analytics"""
    timeframe: AnalyticsTimeframe = Field(..., description="Período de análise")
    start_date: datetime = Field(..., description="Data de início")
    end_date: datetime = Field(..., description="Data de fim")
    metrics: List[str] = Field(..., description="Métricas a serem calculadas")
    filters: Optional[Dict[str, Any]] = Field(None, description="Filtros adicionais")
    group_by: Optional[List[str]] = Field(None, description="Agrupar por campos")
    
    @validator('metrics')
    def validate_metrics(cls, v):
        if len(v) == 0:
            raise ValueError('Pelo menos uma métrica deve ser especificada')
        if len(v) > 20:
            raise ValueError('Máximo de 20 métricas por consulta')
        return v
    
    @root_validator
    def validate_date_range(cls, values):
        start_date = values.get('start_date')
        end_date = values.get('end_date')
        
        if start_date and end_date and start_date >= end_date:
            raise ValueError('start_date deve ser anterior a end_date')
        
        # Validar período máximo baseado no timeframe
        timeframe = values.get('timeframe')
        if start_date and end_date:
            diff_days = (end_date - start_date).days
            
            max_days = {
                AnalyticsTimeframe.HOUR: 7,      # 7 dias para análise por hora
                AnalyticsTimeframe.DAY: 365,     # 1 ano para análise por dia
                AnalyticsTimeframe.WEEK: 730,    # 2 anos para análise por semana
                AnalyticsTimeframe.MONTH: 1095,  # 3 anos para análise por mês
                AnalyticsTimeframe.QUARTER: 1825, # 5 anos para análise por trimestre
                AnalyticsTimeframe.YEAR: 3650    # 10 anos para análise por ano
            }
            
            if diff_days > max_days.get(timeframe, 365):
                raise ValueError(f'Período muito longo para timeframe {timeframe}')
        
        return values

class MetricValue(BaseModel):
    """Valor de uma métrica"""
    name: str = Field(..., description="Nome da métrica")
    value: Union[int, float] = Field(..., description="Valor da métrica")
    type: MetricType = Field(..., description="Tipo da métrica")
    unit: Optional[str] = Field(None, description="Unidade da métrica")
    change_percent: Optional[float] = Field(None, description="Variação percentual")
    change_absolute: Optional[Union[int, float]] = Field(None, description="Variação absoluta")

class AnalyticsDataPoint(BaseModel):
    """Ponto de dados analytics"""
    timestamp: datetime = Field(..., description="Timestamp do ponto")
    metrics: List[MetricValue] = Field(..., description="Métricas do ponto")
    dimensions: Optional[Dict[str, str]] = Field(None, description="Dimensões do ponto")

class AnalyticsResponse(BaseModel):
    """Resposta de analytics"""
    query: AnalyticsQuery = Field(..., description="Query executada")
    data_points: List[AnalyticsDataPoint] = Field(..., description="Pontos de dados")
    summary: Dict[str, MetricValue] = Field(..., description="Resumo das métricas")
    generated_at: datetime = Field(..., description="Data de geração")
    execution_time_ms: Optional[float] = Field(None, description="Tempo de execução")

# Modelos específicos de analytics
class UsageStats(BaseModel):
    """Estatísticas de uso"""
    period_start: datetime = Field(..., description="Início do período")
    period_end: datetime = Field(..., description="Fim do período")
    
    # Usuários
    total_users: int = Field(0, description="Total de usuários")
    active_users: int = Field(0, description="Usuários ativos")
    new_users: int = Field(0, description="Novos usuários")
    returning_users: int = Field(0, description="Usuários retornando")
    
    # Conversas
    total_conversations: int = Field(0, description="Total de conversas")
    completed_conversations: int = Field(0, description="Conversas completadas")
    avg_conversation_length: float = Field(0.0, description="Duração média das conversas")
    
    # Mensagens
    total_messages: int = Field(0, description="Total de mensagens")
    user_messages: int = Field(0, description="Mensagens de usuários")
    assistant_messages: int = Field(0, description="Mensagens de assistentes")
    
    # Tokens e custos
    total_tokens: int = Field(0, description="Total de tokens")
    total_cost: float = Field(0.0, description="Custo total")
    avg_cost_per_conversation: float = Field(0.0, description="Custo médio por conversa")
    
    # Performance
    avg_response_time: float = Field(0.0, description="Tempo médio de resposta (ms)")
    success_rate: float = Field(0.0, description="Taxa de sucesso (%)")
    error_rate: float = Field(0.0, description="Taxa de erro (%)")

class ConversationStats(BaseModel):
    """Estatísticas de conversas"""
    # Distribuição por status
    active_count: int = Field(0, description="Conversas ativas")
    paused_count: int = Field(0, description="Conversas pausadas")
    completed_count: int = Field(0, description="Conversas completadas")
    archived_count: int = Field(0, description="Conversas arquivadas")
    
    # Métricas de tempo
    avg_duration_minutes: float = Field(0.0, description="Duração média (minutos)")
    avg_response_time_ms: float = Field(0.0, description="Tempo médio de resposta (ms)")
    
    # Métricas de qualidade
    satisfaction_score: Optional[float] = Field(None, description="Score de satisfação médio")
    resolution_rate: float = Field(0.0, description="Taxa de resolução (%)")
    escalation_rate: float = Field(0.0, description="Taxa de escalação (%)")
    
    # Top agentes
    top_agents: List[Dict[str, Any]] = Field(
        default_factory=list, 
        description="Agentes mais utilizados"
    )
    
    # Distribuição temporal
    hourly_distribution: Dict[str, int] = Field(
        default_factory=dict, 
        description="Distribuição por hora"
    )
    
    daily_distribution: Dict[str, int] = Field(
        default_factory=dict, 
        description="Distribuição por dia da semana"
    )

class AgentPerformance(BaseModel):
    """Performance de agente"""
    agent_id: str = Field(..., description="ID do agente")
    agent_name: str = Field(..., description="Nome do agente")
    
    # Métricas de uso
    total_conversations: int = Field(0, description="Total de conversas")
    active_conversations: int = Field(0, description="Conversas ativas")
    completed_conversations: int = Field(0, description="Conversas completadas")
    
    # Métricas de qualidade
    avg_satisfaction: Optional[float] = Field(None, description="Satisfação média")
    success_rate: float = Field(0.0, description="Taxa de sucesso (%)")
    avg_response_time: float = Field(0.0, description="Tempo médio de resposta (ms)")
    
    # Métricas de eficiência
    tokens_per_conversation: float = Field(0.0, description="Tokens por conversa")
    cost_per_conversation: float = Field(0.0, description="Custo por conversa")
    messages_per_conversation: float = Field(0.0, description="Mensagens por conversa")
    
    # Tendências
    conversation_trend: List[int] = Field(
        default_factory=list, 
        description="Tendência de conversas (últimos 30 dias)"
    )
    satisfaction_trend: List[Optional[float]] = Field(
        default_factory=list, 
        description="Tendência de satisfação (últimos 30 dias)"
    )

class UserEngagement(BaseModel):
    """Engajamento do usuário"""
    user_id: str = Field(..., description="ID do usuário")
    
    # Métricas de atividade
    total_sessions: int = Field(0, description="Total de sessões")
    total_conversations: int = Field(0, description="Total de conversas")
    total_messages: int = Field(0, description="Total de mensagens")
    
    # Métricas de tempo
    avg_session_duration: float = Field(0.0, description="Duração média da sessão (minutos)")
    days_since_last_activity: Optional[int] = Field(None, description="Dias desde última atividade")
    
    # Padrões de uso
    preferred_hours: List[int] = Field(
        default_factory=list, 
        description="Horários preferidos (0-23)"
    )
    most_used_agents: List[str] = Field(
        default_factory=list, 
        description="Agentes mais utilizados"
    )
    
    # Score de engajamento
    engagement_score: float = Field(0.0, description="Score de engajamento (0-100)")
    churn_risk: float = Field(0.0, description="Risco de churn (0-1)")

class RevenueAnalytics(BaseModel):
    """Analytics de receita"""
    period_start: datetime = Field(..., description="Início do período")
    period_end: datetime = Field(..., description="Fim do período")
    
    # Receita
    total_revenue: float = Field(0.0, description="Receita total")
    recurring_revenue: float = Field(0.0, description="Receita recorrente")
    one_time_revenue: float = Field(0.0, description="Receita única")
    
    # Custos
    total_costs: float = Field(0.0, description="Custos totais")
    ai_costs: float = Field(0.0, description="Custos de IA")
    infrastructure_costs: float = Field(0.0, description="Custos de infraestrutura")
    
    # Métricas
    gross_margin: float = Field(0.0, description="Margem bruta (%)")
    customer_acquisition_cost: float = Field(0.0, description="Custo de aquisição de cliente")
    customer_lifetime_value: float = Field(0.0, description="Valor vitalício do cliente")
    
    # Por plano
    revenue_by_plan: Dict[str, float] = Field(
        default_factory=dict, 
        description="Receita por plano"
    )
    
    customers_by_plan: Dict[str, int] = Field(
        default_factory=dict, 
        description="Clientes por plano"
    )

class SystemHealth(BaseModel):
    """Saúde do sistema"""
    timestamp: datetime = Field(..., description="Timestamp da medição")
    
    # Performance
    avg_response_time: float = Field(..., description="Tempo médio de resposta (ms)")
    p95_response_time: float = Field(..., description="Tempo de resposta P95 (ms)")
    p99_response_time: float = Field(..., description="Tempo de resposta P99 (ms)")
    
    # Disponibilidade
    uptime_percentage: float = Field(..., description="Uptime (%)")
    error_rate: float = Field(..., description="Taxa de erro (%)")
    
    # Recursos
    cpu_usage: float = Field(..., description="Uso de CPU (%)")
    memory_usage: float = Field(..., description="Uso de memória (%)")
    disk_usage: float = Field(..., description="Uso de disco (%)")
    
    # Database
    db_connections: int = Field(..., description="Conexões de banco ativas")
    db_query_time: float = Field(..., description="Tempo médio de query (ms)")
    
    # Cache
    cache_hit_rate: float = Field(..., description="Taxa de hit do cache (%)")
    cache_memory_usage: float = Field(..., description="Uso de memória do cache (%)")
    
    # APIs externas
    openai_status: bool = Field(..., description="Status da API OpenAI")
    openai_latency: float = Field(..., description="Latência da API OpenAI (ms)")

# Modelos para relatórios
class DashboardMetrics(BaseModel):
    """Métricas para dashboard"""
    # KPIs principais
    total_users: int = Field(0, description="Total de usuários")
    active_users_24h: int = Field(0, description="Usuários ativos (24h)")
    total_conversations: int = Field(0, description="Total de conversas")
    conversations_24h: int = Field(0, description="Conversas (24h)")
    
    # Performance
    avg_response_time: float = Field(0.0, description="Tempo médio de resposta (ms)")
    success_rate: float = Field(0.0, description="Taxa de sucesso (%)")
    satisfaction_score: Optional[float] = Field(None, description="Score de satisfação")
    
    # Financeiro
    revenue_month: float = Field(0.0, description="Receita do mês")
    costs_month: float = Field(0.0, description="Custos do mês")
    margin_month: float = Field(0.0, description="Margem do mês (%)")
    
    # Tendências (últimos 30 dias)
    user_growth_rate: float = Field(0.0, description="Taxa de crescimento de usuários (%)")
    conversation_growth_rate: float = Field(0.0, description="Taxa de crescimento de conversas (%)")
    revenue_growth_rate: float = Field(0.0, description="Taxa de crescimento de receita (%)")
    
    # Alertas
    active_alerts: int = Field(0, description="Alertas ativos")
    critical_alerts: int = Field(0, description="Alertas críticos")

class AnalyticsReport(BaseModel):
    """Relatório completo de analytics"""
    report_id: str = Field(..., description="ID do relatório")
    organization_id: str = Field(..., description="ID da organização")
    report_type: str = Field(..., description="Tipo do relatório")
    period_start: datetime = Field(..., description="Início do período")
    period_end: datetime = Field(..., description="Fim do período")
    generated_at: datetime = Field(..., description="Data de geração")
    
    # Seções do relatório
    executive_summary: Dict[str, Any] = Field(..., description="Resumo executivo")
    usage_stats: UsageStats = Field(..., description="Estatísticas de uso")
    conversation_stats: ConversationStats = Field(..., description="Estatísticas de conversas")
    agent_performance: List[AgentPerformance] = Field(..., description="Performance dos agentes")
    user_engagement: Dict[str, Any] = Field(..., description="Engajamento dos usuários")
    revenue_analytics: Optional[RevenueAnalytics] = Field(None, description="Analytics de receita")
    system_health: SystemHealth = Field(..., description="Saúde do sistema")
    
    # Insights e recomendações
    insights: List[str] = Field(default_factory=list, description="Insights principais")
    recommendations: List[str] = Field(default_factory=list, description="Recomendações")
    
    @validator('report_type')
    def validate_report_type(cls, v):
        allowed_types = ['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom']
        if v not in allowed_types:
            raise ValueError(f'Tipo de relatório deve ser um de: {", ".join(allowed_types)}')
        return v

# Modelos para eventos personalizados
class CustomEvent(BaseModel):
    """Evento personalizado para analytics"""
    event_name: str = Field(..., description="Nome do evento")
    user_id: Optional[str] = Field(None, description="ID do usuário")
    organization_id: Optional[str] = Field(None, description="ID da organização")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Propriedades do evento")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp do evento")
    
    @validator('event_name')
    def validate_event_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nome do evento deve ter pelo menos 2 caracteres')
        if len(v) > 100:
            raise ValueError('Nome do evento deve ter no máximo 100 caracteres')
        # Permitir apenas caracteres alfanuméricos, underscore e ponto
        import re
        if not re.match(r'^[a-zA-Z0-9_.]+$', v):
            raise ValueError('Nome do evento deve conter apenas letras, números, underscore e ponto')
        return v.strip()

class EventBatch(BaseModel):
    """Lote de eventos para processamento"""
    events: List[CustomEvent] = Field(..., description="Lista de eventos")
    batch_id: Optional[str] = Field(None, description="ID do lote")
    
    @validator('events')
    def validate_events(cls, v):
        if len(v) == 0:
            raise ValueError('Pelo menos um evento deve ser fornecido')
        if len(v) > 1000:
            raise ValueError('Máximo de 1000 eventos por lote')
        return v