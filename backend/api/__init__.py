from fastapi import APIRouter
from .agents import router as agents_router
from .conversations import router as conversations_router
from .webhooks import router as webhooks_router
from .http_tools import router as http_tools_router

api_router = APIRouter()

# Registra todos os routers
api_router.include_router(agents_router, prefix="/agents", tags=["agents"])
api_router.include_router(conversations_router, prefix="/conversations", tags=["conversations"])
api_router.include_router(webhooks_router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(http_tools_router, prefix="/http-tools", tags=["http-tools"])

# Health check
@api_router.get("/health")
async def health_check():
    """Verifica o status da API"""
    return {"status": "healthy", "version": "1.0.0"}