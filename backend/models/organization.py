"""
Modelos Pydantic para Organization com validação robusta
"""

from typing import Optional, List, Dict, Any
from datetime import datetime

from pydantic import Field, validator, EmailStr
from .base import (
    BaseModel, TimestampMixin, MembershipRole,
    validate_organization_name
)

class OrganizationBase(BaseModel):
    """Modelo base para Organization"""
    name: str = Field(..., description="Nome da organização")
    icon_url: Optional[str] = Field(None, description="URL do ícone da organização")
    
    @validator('name')
    def validate_name_field(cls, v):
        return validate_organization_name(v)
    
    @validator('icon_url')
    def validate_icon_url(cls, v):
        if v:
            import re
            url_pattern = r'^https?://.+'
            if not re.match(url_pattern, v):
                raise ValueError('icon_url deve ser uma URL válida')
        return v

class OrganizationCreate(OrganizationBase):
    """Modelo para criação de Organization"""
    billing_email: Optional[EmailStr] = Field(None, description="Email para cobrança")
    plan: Optional[str] = Field("free", description="Plano da organização")
    max_agents: Optional[int] = Field(5, description="Máximo de agentes permitidos")
    max_members: Optional[int] = Field(10, description="Máximo de membros permitidos")
    
    @validator('plan')
    def validate_plan(cls, v):
        allowed_plans = ['free', 'starter', 'professional', 'enterprise']
        if v not in allowed_plans:
            raise ValueError(f'Plano deve ser um de: {", ".join(allowed_plans)}')
        return v
    
    @validator('max_agents')
    def validate_max_agents(cls, v):
        if v is not None and v < 1:
            raise ValueError('max_agents deve ser pelo menos 1')
        return v
    
    @validator('max_members')
    def validate_max_members(cls, v):
        if v is not None and v < 1:
            raise ValueError('max_members deve ser pelo menos 1')
        return v

class OrganizationUpdate(BaseModel):
    """Modelo para atualização de Organization"""
    name: Optional[str] = Field(None, description="Nome da organização")
    icon_url: Optional[str] = Field(None, description="URL do ícone da organização")
    billing_email: Optional[EmailStr] = Field(None, description="Email para cobrança")
    plan: Optional[str] = Field(None, description="Plano da organização")
    max_agents: Optional[int] = Field(None, description="Máximo de agentes permitidos")
    max_members: Optional[int] = Field(None, description="Máximo de membros permitidos")
    
    @validator('name')
    def validate_name_field(cls, v):
        if v is not None:
            return validate_organization_name(v)
        return v
    
    @validator('plan')
    def validate_plan(cls, v):
        if v is not None:
            allowed_plans = ['free', 'starter', 'professional', 'enterprise']
            if v not in allowed_plans:
                raise ValueError(f'Plano deve ser um de: {", ".join(allowed_plans)}')
        return v

class MembershipBase(BaseModel):
    """Modelo base para Membership"""
    role: MembershipRole = Field(MembershipRole.MEMBER, description="Role na organização")
    organization_id: str = Field(..., description="ID da organização")
    user_id: Optional[str] = Field(None, description="ID do usuário")
    invited_email: Optional[EmailStr] = Field(None, description="Email do usuário convidado")

class MembershipCreate(MembershipBase):
    """Modelo para criação de Membership"""
    invited_token: Optional[str] = Field(None, description="Token de convite")

class MembershipUpdate(BaseModel):
    """Modelo para atualização de Membership"""
    role: Optional[MembershipRole] = Field(None, description="Role na organização")

class UserInfo(BaseModel):
    """Informações básicas do usuário para Membership"""
    id: str = Field(..., description="ID do usuário")
    name: Optional[str] = Field(None, description="Nome do usuário")
    email: str = Field(..., description="Email do usuário")
    avatar_url: Optional[str] = Field(None, description="URL do avatar")

class MembershipResponse(MembershipBase, TimestampMixin):
    """Modelo de resposta para Membership"""
    id: str = Field(..., description="ID único do membership")
    user: Optional[UserInfo] = Field(None, description="Informações do usuário")
    is_pending: bool = Field(False, description="Se o convite está pendente")

class OrganizationStats(BaseModel):
    """Estatísticas da organização"""
    total_agents: int = Field(0, description="Total de agentes")
    active_agents: int = Field(0, description="Agentes ativos")
    total_conversations: int = Field(0, description="Total de conversas")
    total_messages: int = Field(0, description="Total de mensagens")
    total_members: int = Field(0, description="Total de membros")
    tokens_used_month: int = Field(0, description="Tokens usados no mês")
    api_calls_month: int = Field(0, description="Chamadas de API no mês")
    cost_month: float = Field(0.0, description="Custo mensal")
    last_activity: Optional[datetime] = Field(None, description="Última atividade")

class OrganizationUsage(BaseModel):
    """Uso da organização"""
    nbAgentQueries: int = Field(0, description="Número de queries dos agentes")
    nbDataProcessed: int = Field(0, description="Dados processados")
    nbModelTokens: int = Field(0, description="Tokens dos modelos utilizados")
    updated_at: datetime = Field(..., description="Última atualização")

class OrganizationResponse(OrganizationBase, TimestampMixin):
    """Modelo de resposta para Organization"""
    id: str = Field(..., description="ID único da organização")
    billing_email: Optional[str] = Field(None, description="Email para cobrança")
    plan: str = Field(..., description="Plano da organização")
    max_agents: int = Field(..., description="Máximo de agentes permitidos")
    max_members: int = Field(..., description="Máximo de membros permitidos")
    
    class Config:
        schema_extra = {
            "example": {
                "id": "org_123",
                "name": "Minha Empresa",
                "icon_url": "https://exemplo.com/logo.png",
                "billing_email": "faturamento@empresa.com",
                "plan": "professional",
                "max_agents": 50,
                "max_members": 25,
                "created_at": "2024-01-01T10:00:00Z",
                "updated_at": "2024-01-01T10:00:00Z"
            }
        }

class OrganizationWithMembers(OrganizationResponse):
    """Organization com membros incluídos"""
    memberships: List[MembershipResponse] = Field(
        default_factory=list, 
        description="Memberships da organização"
    )
    stats: Optional[OrganizationStats] = Field(None, description="Estatísticas da organização")
    usage: Optional[OrganizationUsage] = Field(None, description="Uso da organização")

class OrganizationWithStats(OrganizationResponse):
    """Organization com estatísticas incluídas"""
    stats: OrganizationStats = Field(..., description="Estatísticas da organização")
    usage: OrganizationUsage = Field(..., description="Uso da organização")

class OrganizationListResponse(BaseModel):
    """Resposta para lista de organizações"""
    id: str = Field(..., description="ID único da organização")
    name: str = Field(..., description="Nome da organização")
    icon_url: Optional[str] = Field(None, description="URL do ícone")
    plan: str = Field(..., description="Plano da organização")
    user_role: MembershipRole = Field(..., description="Role do usuário na organização")
    total_agents: int = Field(0, description="Total de agentes")
    total_members: int = Field(0, description="Total de membros")
    last_activity: Optional[datetime] = Field(None, description="Última atividade")
    created_at: datetime = Field(..., description="Data de criação")

# Modelos para operações específicas
class OrganizationInvite(BaseModel):
    """Modelo para convite de membro"""
    email: EmailStr = Field(..., description="Email do usuário a ser convidado")
    role: MembershipRole = Field(MembershipRole.MEMBER, description="Role na organização")
    message: Optional[str] = Field(None, description="Mensagem do convite", max_length=500)

class OrganizationInviteResponse(BaseModel):
    """Resposta para convite de organização"""
    invite_id: str = Field(..., description="ID do convite")
    email: EmailStr = Field(..., description="Email convidado")
    organization_name: str = Field(..., description="Nome da organização")
    role: MembershipRole = Field(..., description="Role oferecida")
    expires_at: datetime = Field(..., description="Data de expiração")
    created_at: datetime = Field(..., description="Data de criação")

class OrganizationBulkInvite(BaseModel):
    """Modelo para convite em lote"""
    emails: List[EmailStr] = Field(..., description="Lista de emails")
    role: MembershipRole = Field(MembershipRole.MEMBER, description="Role na organização")
    message: Optional[str] = Field(None, description="Mensagem do convite", max_length=500)
    
    @validator('emails')
    def validate_emails(cls, v):
        if len(v) == 0:
            raise ValueError('Pelo menos um email deve ser fornecido')
        if len(v) > 50:
            raise ValueError('Máximo de 50 emails por convite em lote')
        # Remove duplicatas mantendo ordem
        seen = set()
        unique_emails = []
        for email in v:
            if email not in seen:
                seen.add(email)
                unique_emails.append(email)
        return unique_emails

class OrganizationPlanUpdate(BaseModel):
    """Modelo para atualização de plano"""
    plan: str = Field(..., description="Novo plano")
    billing_email: Optional[EmailStr] = Field(None, description="Email para cobrança")
    
    @validator('plan')
    def validate_plan(cls, v):
        allowed_plans = ['free', 'starter', 'professional', 'enterprise']
        if v not in allowed_plans:
            raise ValueError(f'Plano deve ser um de: {", ".join(allowed_plans)}')
        return v

class OrganizationBilling(BaseModel):
    """Informações de cobrança da organização"""
    plan: str = Field(..., description="Plano atual")
    billing_email: Optional[str] = Field(None, description="Email para cobrança")
    current_period_start: datetime = Field(..., description="Início do período atual")
    current_period_end: datetime = Field(..., description="Fim do período atual")
    usage_current_month: OrganizationUsage = Field(..., description="Uso do mês atual")
    cost_current_month: float = Field(0.0, description="Custo do mês atual")
    overage_charges: float = Field(0.0, description="Taxas de excesso")
    next_billing_date: datetime = Field(..., description="Próxima data de cobrança")

class OrganizationTransfer(BaseModel):
    """Modelo para transferência de organização"""
    new_owner_email: EmailStr = Field(..., description="Email do novo proprietário")
    confirmation: str = Field(..., description="Confirmação de transferência")
    
    @validator('confirmation')
    def validate_confirmation(cls, v):
        if v.lower() != "transfer organization":
            raise ValueError('Confirmação deve ser exatamente "transfer organization"')
        return v

class OrganizationDelete(BaseModel):
    """Modelo para exclusão de organização"""
    confirmation: str = Field(..., description="Confirmação de exclusão")
    transfer_data_to: Optional[str] = Field(None, description="ID da organização para transferir dados")
    
    @validator('confirmation')
    def validate_confirmation(cls, v):
        if v.lower() != "delete organization":
            raise ValueError('Confirmação deve ser exatamente "delete organization"')
        return v

# Modelos para análise e relatórios
class OrganizationAnalytics(BaseModel):
    """Analytics da organização"""
    period_start: datetime = Field(..., description="Início do período")
    period_end: datetime = Field(..., description="Fim do período")
    
    # Conversas
    total_conversations: int = Field(0, description="Total de conversas")
    new_conversations: int = Field(0, description="Novas conversas")
    active_conversations: int = Field(0, description="Conversas ativas")
    avg_conversation_length: float = Field(0.0, description="Duração média das conversas")
    
    # Usuários
    total_unique_users: int = Field(0, description="Usuários únicos")
    new_users: int = Field(0, description="Novos usuários")
    returning_users: int = Field(0, description="Usuários retornando")
    
    # Performance
    avg_response_time: float = Field(0.0, description="Tempo médio de resposta (ms)")
    success_rate: float = Field(0.0, description="Taxa de sucesso (%)")
    satisfaction_score: Optional[float] = Field(None, description="Score de satisfação")
    
    # Uso de recursos
    tokens_used: int = Field(0, description="Tokens utilizados")
    api_calls: int = Field(0, description="Chamadas de API")
    data_processed_mb: float = Field(0.0, description="Dados processados (MB)")
    
    # Custos
    total_cost: float = Field(0.0, description="Custo total")
    cost_per_conversation: float = Field(0.0, description="Custo por conversa")
    cost_savings: float = Field(0.0, description="Economia de custos")

class OrganizationReport(BaseModel):
    """Relatório da organização"""
    organization_id: str = Field(..., description="ID da organização")
    report_type: str = Field(..., description="Tipo do relatório")
    period: str = Field(..., description="Período do relatório")
    generated_at: datetime = Field(..., description="Data de geração")
    analytics: OrganizationAnalytics = Field(..., description="Dados analíticos")
    charts_data: Dict[str, Any] = Field(
        default_factory=dict, 
        description="Dados para gráficos"
    )
    summary: Dict[str, Any] = Field(
        default_factory=dict, 
        description="Resumo executivo"
    )
    
    @validator('report_type')
    def validate_report_type(cls, v):
        allowed_types = ['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom']
        if v not in allowed_types:
            raise ValueError(f'Tipo de relatório deve ser um de: {", ".join(allowed_types)}')
        return v

class OrganizationLimits(BaseModel):
    """Limites da organização baseados no plano"""
    max_agents: int = Field(..., description="Máximo de agentes")
    max_members: int = Field(..., description="Máximo de membros")
    max_conversations_month: int = Field(..., description="Máximo de conversas por mês")
    max_tokens_month: int = Field(..., description="Máximo de tokens por mês")
    max_data_storage_gb: float = Field(..., description="Máximo de armazenamento (GB)")
    api_rate_limit: int = Field(..., description="Limite de rate da API (req/min)")
    
    # Uso atual
    current_agents: int = Field(0, description="Agentes atuais")
    current_members: int = Field(0, description="Membros atuais")
    current_conversations_month: int = Field(0, description="Conversas do mês")
    current_tokens_month: int = Field(0, description="Tokens do mês")
    current_data_storage_gb: float = Field(0.0, description="Armazenamento atual (GB)")
    
    @property
    def agents_usage_percent(self) -> float:
        """Porcentagem de uso de agentes"""
        return (self.current_agents / self.max_agents) * 100 if self.max_agents > 0 else 0
    
    @property
    def members_usage_percent(self) -> float:
        """Porcentagem de uso de membros"""
        return (self.current_members / self.max_members) * 100 if self.max_members > 0 else 0
    
    @property
    def is_approaching_limits(self) -> bool:
        """Verificar se está se aproximando dos limites (>80%)"""
        return (self.agents_usage_percent > 80 or 
                self.members_usage_percent > 80 or
                (self.current_conversations_month / self.max_conversations_month) * 100 > 80)

# Modelos para configurações avançadas
class OrganizationSettings(BaseModel):
    """Configurações da organização"""
    # Segurança
    enforce_2fa: bool = Field(False, description="Forçar autenticação 2FA")
    allowed_domains: List[str] = Field(
        default_factory=list, 
        description="Domínios permitidos para membros"
    )
    session_timeout_hours: int = Field(24, description="Timeout de sessão (horas)")
    
    # Integrações
    webhooks_enabled: bool = Field(True, description="Webhooks habilitados")
    api_access_enabled: bool = Field(True, description="Acesso à API habilitado")
    
    # Personalizações
    custom_branding: bool = Field(False, description="Branding customizado")
    custom_domain: Optional[str] = Field(None, description="Domínio customizado")
    
    # Políticas
    data_retention_days: int = Field(365, description="Retenção de dados (dias)")
    auto_archive_conversations: bool = Field(True, description="Arquivar conversas automaticamente")
    
    @validator('session_timeout_hours')
    def validate_session_timeout(cls, v):
        if not 1 <= v <= 168:  # 1 hora a 7 dias
            raise ValueError('Timeout de sessão deve estar entre 1 e 168 horas')
        return v
    
    @validator('data_retention_days')
    def validate_data_retention(cls, v):
        if not 30 <= v <= 2555:  # 30 dias a 7 anos
            raise ValueError('Retenção de dados deve estar entre 30 e 2555 dias')
        return v