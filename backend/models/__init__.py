"""
Modelos Pydantic para Agentes de Conversão
Validação robusta, serialização otimizada e type safety
"""

from .base import *
from .user import *
from .organization import *
from .agent import *
from .conversation import *
from .analytics import *
from .webhook import *
from .auth import *

__all__ = [
    # Base models
    "BaseModel",
    "TimestampMixin",
    "PaginatedResponse",
    "APIResponse",
    "ErrorResponse",
    
    # User models
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserWithOrganizations",
    
    # Organization models
    "OrganizationBase",
    "OrganizationCreate",
    "OrganizationUpdate",
    "OrganizationResponse",
    "OrganizationWithMembers",
    "MembershipResponse",
    
    # Agent models
    "AgentBase",
    "AgentCreate",
    "AgentUpdate",
    "AgentResponse",
    "AgentWithStats",
    "AgentConfigUpdate",
    
    # Conversation models
    "ConversationBase",
    "ConversationCreate",
    "ConversationResponse",
    "ConversationWithMessages",
    "MessageCreate",
    "MessageResponse",
    
    # Analytics models
    "AnalyticsQuery",
    "AnalyticsResponse",
    "UsageStats",
    "ConversationStats",
    
    # Webhook models
    "WebhookEventBase",
    "WebhookDelivery",
    "WebhookConfig",
    
    # Auth models
    "LoginRequest",
    "RegisterRequest",
    "TokenResponse",
    "RefreshTokenRequest",
]