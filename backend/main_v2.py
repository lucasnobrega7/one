"""
Agentes de Conversão API v2.0
API avançada com streaming, ferramentas, analytics em tempo real e SSE
"""

from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sse_starlette.sse import EventSourceResponse
from contextlib import asynccontextmanager
import httpx
import asyncio
import json
import os
import uuid
import redis.asyncio as redis
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, AsyncGenerator
from pydantic import BaseModel, Field
from supabase import create_client, Client
from database import get_prisma, disconnect_prisma, get_db, get_local_prisma
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lifespan context manager for startup and shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting Agentes de Conversão API v2.0")
    logger.info("📊 Initializing Redis connection pool...")
    logger.info("🔗 Connecting to Prisma database...")
    await get_prisma()  # Initialize Prisma connection
    
    yield
    
    # Shutdown
    logger.info("🔄 Shutting down API...")
    # Close Prisma connections
    await disconnect_prisma()
    # Close Redis connections
    await redis_client.aclose()
    # Clear SSE connections
    sse_connections.clear()
    logger.info("✅ Shutdown complete")

# Initialize FastAPI app with enhanced metadata
app = FastAPI(
    title="Agentes de Conversão API",
    description="API avançada para criação e gerenciamento de agentes conversacionais inteligentes",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    openapi_tags=[
        {"name": "agents", "description": "Operações com agentes"},
        {"name": "chat", "description": "Chat e streaming"},
        {"name": "tools", "description": "Ferramentas de agentes"},
        {"name": "analytics", "description": "Analytics e métricas"},
        {"name": "knowledge", "description": "Base de conhecimento"},
        {"name": "webhooks", "description": "Webhooks e notificações"},
        {"name": "events", "description": "Eventos em tempo real"},
    ]
)

# Production security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*.agentesdeconversao.com.br", "*.railway.app", "localhost"]
)

# Enhanced CORS middleware for production
cors_origins = os.environ.get("CORS_ORIGINS", "").split(",") or ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# Initialize clients
supabase_url = os.environ.get("SUPABASE_URL", "https://your-project.supabase.co")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY", "your-service-key")
supabase: Client = create_client(supabase_url, supabase_key)

redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379")
redis_client = redis.from_url(
    redis_url,
    max_connections=20,
    retry_on_timeout=True,
    socket_timeout=5,
    socket_connect_timeout=5,
    health_check_interval=30
)

security = HTTPBearer()

# Store for SSE connections
sse_connections: Dict[str, List[Any]] = {}

# ============================================
# ENHANCED PYDANTIC MODELS v2.0
# ============================================

class AgentTool(BaseModel):
    id: Optional[str] = None
    type: str = Field(..., description="Tipo da ferramenta: http, search, calculator, lead_capture, form, webhook")
    name: str = Field(..., description="Nome da ferramenta")
    description: Optional[str] = None
    config: Dict[str, Any] = Field(..., description="Configuração específica da ferramenta")
    is_active: bool = True

class CreateAgentRequest(BaseModel):
    name: str = Field(..., description="Nome do agente")
    description: str = Field(..., description="Descrição do agente")
    system_prompt: str = Field(..., description="Prompt do sistema")
    model_id: str = Field(default="gpt-4", description="ID do modelo")
    temperature: float = Field(default=0.7, ge=0, le=2, description="Temperatura do modelo")
    max_tokens: int = Field(default=2048, ge=1, le=8192, description="Máximo de tokens")
    tools: List[AgentTool] = Field(default=[], description="Ferramentas do agente")
    visibility: str = Field(default="private", description="Visibilidade: public, private")
    knowledge_base_id: Optional[str] = None

class StreamChatRequest(BaseModel):
    messages: List[Dict[str, str]] = Field(..., description="Histórico de mensagens")
    conversation_id: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    context_data: Optional[Dict[str, Any]] = None
    system_prompt_override: Optional[str] = None
    streaming: bool = True

class StreamEvent(BaseModel):
    event: str = Field(..., description="Tipo do evento: progress, answer, source, metadata, done, error")
    data: Any = Field(..., description="Dados do evento")
    conversation_id: Optional[str] = None
    message_id: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class WebhookConfig(BaseModel):
    name: str = Field(..., description="Nome do webhook")
    url: str = Field(..., description="URL do webhook")
    events: List[str] = Field(..., description="Eventos para escutar")
    secret: Optional[str] = None
    is_active: bool = True

class KnowledgeSearchRequest(BaseModel):
    query: str = Field(..., description="Query de busca")
    knowledge_base_id: str = Field(..., description="ID da base de conhecimento")
    top_k: int = Field(default=5, ge=1, le=20, description="Número de resultados")
    threshold: float = Field(default=0.7, ge=0, le=1, description="Threshold de similaridade")

class AnalyticsRequest(BaseModel):
    period: str = Field(default="week", description="Período: day, week, month")
    agent_id: Optional[str] = None
    event_type: Optional[str] = None

class UserSettings(BaseModel):
    theme: str = Field(default="dark", description="Tema: light, dark")
    language: str = Field(default="pt-br", description="Idioma")
    email_notifications: bool = True
    default_model: str = Field(default="gpt-4")
    default_temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=2048, ge=1, le=8192)

# ============================================
# AUTHENTICATION & MIDDLEWARE
# ============================================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verificação de autenticação aprimorada"""
    token = credentials.credentials
    
    try:
        # For demo purposes, accept any token
        # In production, implement proper JWT verification
        if not token or len(token) < 10:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )
        
        # Mock user data
        return {
            "id": "user_123",
            "email": "user@example.com",
            "organization_id": "org_456"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Erro de autenticação: {str(e)}"
        )

async def get_organization_id(user_data: dict) -> str:
    """Extrair organization_id do usuário"""
    return user_data.get("organization_id", "default_org")

# ============================================
# CORE ENDPOINTS - AGENTS v2.0
# ============================================

@app.post("/api/v2/agents", tags=["agents"])
async def create_agent_v2(
    agent_data: CreateAgentRequest,
    user_data: dict = Depends(get_current_user)
):
    """Criar agente com ferramentas avançadas"""
    organization_id = await get_organization_id(user_data)
    agent_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    # Criar agente principal
    agent = {
        "id": agent_id,
        "organization_id": organization_id,
        "user_id": user_data["id"],
        "name": agent_data.name,
        "description": agent_data.description,
        "system_prompt": agent_data.system_prompt,
        "model_id": agent_data.model_id,
        "temperature": agent_data.temperature,
        "max_tokens": agent_data.max_tokens,
        "visibility": agent_data.visibility,
        "knowledge_base_id": agent_data.knowledge_base_id,
        "is_active": True,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
    }
    
    try:
        # Inserir agente
        response = supabase.table("agents").insert(agent).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Erro ao criar agente")
        
        # Criar ferramentas se fornecidas
        if agent_data.tools:
            tools_data = []
            for tool in agent_data.tools:
                tool_data = {
                    "id": str(uuid.uuid4()),
                    "agent_id": agent_id,
                    "type": tool.type,
                    "name": tool.name,
                    "description": tool.description,
                    "config": tool.config,
                    "is_active": tool.is_active,
                    "created_at": now.isoformat(),
                }
                tools_data.append(tool_data)
            
            tools_response = supabase.table("agent_tools").insert(tools_data).execute()
            if not tools_response.data:
                logger.warning(f"Erro ao criar ferramentas para agente {agent_id}")
        
        # Cache no Redis
        await redis_client.setex(f"agent:{agent_id}", 3600, json.dumps(agent))
        
        return {
            "success": True,
            "data": {**agent, "tools": agent_data.tools},
            "message": "Agente criado com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao criar agente: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/api/v2/agents", tags=["agents"])
async def list_agents_v2(
    user_data: dict = Depends(get_current_user)
):
    """Listar agentes com ferramentas"""
    organization_id = await get_organization_id(user_data)
    
    try:
        # Buscar agentes
        agents_response = supabase.table("agents").select("*").eq("organization_id", organization_id).execute()
        
        if not agents_response.data:
            return {"success": True, "data": [], "count": 0}
        
        # Buscar ferramentas para cada agente
        agents_with_tools = []
        for agent in agents_response.data:
            tools_response = supabase.table("agent_tools").select("*").eq("agent_id", agent["id"]).execute()
            agent["tools"] = tools_response.data or []
            agents_with_tools.append(agent)
        
        return {
            "success": True,
            "data": agents_with_tools,
            "count": len(agents_with_tools)
        }
        
    except Exception as e:
        logger.error(f"Erro ao listar agentes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/api/v2/agents/{agent_id}", tags=["agents"])
async def get_agent_v2(
    agent_id: str,
    user_data: dict = Depends(get_current_user)
):
    """Buscar agente específico com ferramentas"""
    try:
        # Tentar cache primeiro
        cached = await redis_client.get(f"agent:{agent_id}")
        if cached:
            agent = json.loads(cached)
        else:
            # Buscar no banco
            response = supabase.table("agents").select("*").eq("id", agent_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Agente não encontrado")
            agent = response.data[0]
        
        # Buscar ferramentas
        tools_response = supabase.table("agent_tools").select("*").eq("agent_id", agent_id).execute()
        agent["tools"] = tools_response.data or []
        
        return {"success": True, "data": agent}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar agente: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# ============================================
# STREAMING CHAT v2.0
# ============================================

@app.post("/api/v2/agents/{agent_id}/chat/stream", tags=["chat"])
async def stream_chat_v2(
    agent_id: str,
    chat_request: StreamChatRequest,
    user_data: dict = Depends(get_current_user)
):
    """Chat com streaming avançado e eventos estruturados"""
    
    async def generate_stream() -> AsyncGenerator[str, None]:
        try:
            # Buscar agente
            agent_response = supabase.table("agents").select("*").eq("id", agent_id).execute()
            if not agent_response.data:
                yield f"data: {json.dumps({'event': 'error', 'data': 'Agente não encontrado'})}\n\n"
                return
            
            agent = agent_response.data[0]
            message_id = str(uuid.uuid4())
            conversation_id = chat_request.conversation_id or str(uuid.uuid4())
            user_message = chat_request.messages[-1]["content"] if chat_request.messages else ""
            
            # Evento de início
            yield f"data: {json.dumps({'event': 'progress', 'data': {'status': 'started', 'progress': 0}, 'conversation_id': conversation_id, 'message_id': message_id})}\n\n"
            
            # Simular busca na base de conhecimento
            sources = []
            if agent.get("knowledge_base_id"):
                yield f"data: {json.dumps({'event': 'progress', 'data': {'status': 'searching_knowledge', 'progress': 25}})}\n\n"
                
                # Buscar documentos relevantes
                docs_response = supabase.table("documents").select("*").eq("knowledge_base_id", agent["knowledge_base_id"]).limit(3).execute()
                
                if docs_response.data:
                    for doc in docs_response.data:
                        source = {
                            "score": 0.85,
                            "source": doc["name"],
                            "datasource_id": agent["knowledge_base_id"],
                            "content_excerpt": doc["content"][:200] + "..."
                        }
                        sources.append(source)
                        yield f"data: {json.dumps({'event': 'source', 'data': source})}\n\n"
            
            # Simular processamento
            yield f"data: {json.dumps({'event': 'progress', 'data': {'status': 'processing', 'progress': 50}})}\n\n"
            
            # Gerar resposta
            context_info = f" Com base nos documentos: {', '.join([s['source'] for s in sources])}" if sources else ""
            full_response = f"Resposta para '{user_message}'{context_info}. Esta é uma simulação de resposta em streaming com eventos estruturados e busca na base de conhecimento."
            
            # Streaming de tokens
            words = full_response.split(' ')
            current_response = ""
            
            for i, word in enumerate(words):
                current_response += (word + " " if i < len(words) - 1 else word)
                
                yield f"data: {json.dumps({'event': 'answer', 'data': word + (' ' if i < len(words) - 1 else ''), 'conversation_id': conversation_id, 'message_id': message_id})}\n\n"
                
                # Progress update
                progress = 50 + int((i + 1) / len(words) * 40)
                if progress % 10 == 0:
                    yield f"data: {json.dumps({'event': 'progress', 'data': {'status': 'generating', 'progress': progress}})}\n\n"
                
                await asyncio.sleep(0.05)  # Simular delay
            
            # Metadata final
            metadata = {
                "model": agent["model_id"],
                "temperature": chat_request.temperature or agent["temperature"],
                "tokens_used": len(words),
                "sources_count": len(sources),
                "processing_time": 2000
            }
            yield f"data: {json.dumps({'event': 'metadata', 'data': metadata})}\n\n"
            
            # Evento final
            yield f"data: {json.dumps({'event': 'done', 'data': {'conversation_id': conversation_id, 'message_id': message_id, 'complete': True}})}\n\n"
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            logger.error(f"Erro no streaming: {str(e)}")
            yield f"data: {json.dumps({'event': 'error', 'data': f'Erro: {str(e)}'})}\n\n"
    
    return EventSourceResponse(generate_stream())

# ============================================
# AGENT TOOLS v2.0
# ============================================

@app.get("/api/v2/agents/{agent_id}/tools", tags=["tools"])
async def get_agent_tools(
    agent_id: str,
    user_data: dict = Depends(get_current_user)
):
    """Listar ferramentas do agente"""
    try:
        # Verificar se agente existe
        agent_response = supabase.table("agents").select("*").eq("id", agent_id).execute()
        if not agent_response.data:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        # Buscar ferramentas
        tools_response = supabase.table("agent_tools").select("*").eq("agent_id", agent_id).execute()
        
        # Tipos disponíveis
        available_types = [
            {
                "type": "http",
                "name": "API HTTP",
                "description": "Integração com APIs externas",
                "fields": [
                    {"name": "url", "type": "text", "required": True},
                    {"name": "method", "type": "select", "options": ["GET", "POST", "PUT", "DELETE"]},
                    {"name": "headers", "type": "json", "required": False},
                    {"name": "auth_type", "type": "select", "options": ["none", "bearer", "basic"]}
                ]
            },
            {
                "type": "search",
                "name": "Busca Web",
                "description": "Busca informações na internet",
                "fields": [
                    {"name": "search_engine", "type": "select", "options": ["google", "bing", "duckduckgo"]},
                    {"name": "max_results", "type": "number", "default": 5},
                    {"name": "safe_search", "type": "boolean", "default": True}
                ]
            },
            {
                "type": "lead_capture",
                "name": "Captura de Leads",
                "description": "Coleta informações de contato",
                "fields": [
                    {"name": "required_fields", "type": "multiselect", "options": ["name", "email", "phone", "company"]},
                    {"name": "webhook_url", "type": "text", "required": False}
                ]
            }
        ]
        
        return {
            "success": True,
            "data": {
                "agent": agent_response.data[0],
                "tools": tools_response.data or [],
                "available_types": available_types
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar ferramentas: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.post("/api/v2/agents/{agent_id}/tools", tags=["tools"])
async def create_agent_tool(
    agent_id: str,
    tool: AgentTool,
    user_data: dict = Depends(get_current_user)
):
    """Criar ferramenta para agente"""
    try:
        # Verificar se agente existe e pertence ao usuário
        agent_response = supabase.table("agents").select("*").eq("id", agent_id).eq("user_id", user_data["id"]).execute()
        if not agent_response.data:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        # Criar ferramenta
        tool_data = {
            "id": str(uuid.uuid4()),
            "agent_id": agent_id,
            "type": tool.type,
            "name": tool.name,
            "description": tool.description,
            "config": tool.config,
            "is_active": tool.is_active,
            "created_at": datetime.utcnow().isoformat(),
        }
        
        response = supabase.table("agent_tools").insert(tool_data).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Erro ao criar ferramenta")
        
        return {
            "success": True,
            "data": response.data[0],
            "message": "Ferramenta criada com sucesso"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao criar ferramenta: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# ============================================
# KNOWLEDGE BASE v2.0
# ============================================

@app.post("/api/v2/knowledge/search", tags=["knowledge"])
async def search_knowledge_v2(
    search_request: KnowledgeSearchRequest,
    user_data: dict = Depends(get_current_user)
):
    """Busca semântica na base de conhecimento"""
    try:
        # Verificar acesso à base de conhecimento
        kb_response = supabase.table("knowledge_bases").select("*").eq("id", search_request.knowledge_base_id).execute()
        if not kb_response.data:
            raise HTTPException(status_code=404, detail="Base de conhecimento não encontrada")
        
        # Buscar documentos (simulação)
        docs_response = supabase.table("documents").select("*").eq("knowledge_base_id", search_request.knowledge_base_id).limit(search_request.top_k).execute()
        
        results = []
        if docs_response.data:
            for doc in docs_response.data:
                # Simular score de similaridade
                score = 0.85 + (len(search_request.query) % 10) * 0.01
                
                if score >= search_request.threshold:
                    results.append({
                        "id": doc["id"],
                        "name": doc["name"],
                        "content": doc["content"],
                        "score": score,
                        "metadata": doc.get("metadata", {}),
                        "relevant_chunk": doc["content"][:300] + "..."
                    })
        
        return {
            "success": True,
            "data": {
                "results": results,
                "query": search_request.query,
                "total_results": len(results)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro na busca semântica: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# ============================================
# ANALYTICS v2.0
# ============================================

@app.get("/api/v2/analytics", tags=["analytics"])
async def get_analytics_v2(
    period: str = "week",
    agent_id: Optional[str] = None,
    user_data: dict = Depends(get_current_user)
):
    """Analytics avançados com métricas em tempo real"""
    try:
        organization_id = await get_organization_id(user_data)
        
        # Buscar dados básicos
        agents_response = supabase.table("agents").select("*").eq("organization_id", organization_id).execute()
        total_agents = len(agents_response.data) if agents_response.data else 0
        
        # Simular métricas (em produção, usar queries otimizadas)
        total_conversations = 150
        total_messages = 1200
        active_conversations = 23
        avg_response_time = 2.5
        user_satisfaction = 87.5
        
        # Gerar série temporal
        days = {"day": 1, "week": 7, "month": 30}[period]
        time_series = []
        
        for i in range(days):
            date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
            time_series.append({
                "date": date,
                "conversations": max(0, total_conversations - i * 5),
                "messages": max(0, total_messages - i * 40)
            })
        
        time_series.reverse()
        
        # Top agentes
        top_agents = []
        if agents_response.data:
            for agent in agents_response.data[:5]:
                top_agents.append({
                    "id": agent["id"],
                    "name": agent["name"],
                    "conversations": 45,
                    "messages": 380,
                    "avg_response_time": 2.1,
                    "satisfaction": 89.2
                })
        
        return {
            "success": True,
            "data": {
                "overview": {
                    "total_agents": total_agents,
                    "total_conversations": total_conversations,
                    "total_messages": total_messages,
                    "avg_response_time": avg_response_time,
                    "active_conversations": active_conversations,
                    "user_satisfaction": user_satisfaction
                },
                "time_series": time_series,
                "top_agents": top_agents,
                "period": period
            }
        }
        
    except Exception as e:
        logger.error(f"Erro ao gerar analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# ============================================
# WEBHOOKS v2.0
# ============================================

@app.post("/api/v2/webhooks", tags=["webhooks"])
async def create_webhook_v2(
    webhook_config: WebhookConfig,
    user_data: dict = Depends(get_current_user)
):
    """Criar webhook para notificações"""
    try:
        webhook_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_data["id"],
            "name": webhook_config.name,
            "url": webhook_config.url,
            "events": webhook_config.events,
            "secret": webhook_config.secret or str(uuid.uuid4()),
            "is_active": webhook_config.is_active,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("webhooks").insert(webhook_data).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Erro ao criar webhook")
        
        return {
            "success": True,
            "data": response.data[0],
            "message": "Webhook criado com sucesso"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao criar webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/api/v2/webhooks", tags=["webhooks"])
async def list_webhooks_v2(
    user_data: dict = Depends(get_current_user)
):
    """Listar webhooks do usuário"""
    try:
        response = supabase.table("webhooks").select("*").eq("user_id", user_data["id"]).execute()
        
        return {
            "success": True,
            "data": response.data or [],
            "count": len(response.data) if response.data else 0
        }
        
    except Exception as e:
        logger.error(f"Erro ao listar webhooks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# ============================================
# REAL-TIME EVENTS (SSE) v2.0
# ============================================

@app.get("/api/v2/events/dashboard", tags=["events"])
async def dashboard_events_stream(
    user_data: dict = Depends(get_current_user)
):
    """Stream de eventos em tempo real para dashboard"""
    
    async def generate_events():
        connection_id = str(uuid.uuid4())
        user_id = user_data["id"]
        
        # Thread-safe: criar cliente Supabase dentro do generator
        local_supabase = create_client(supabase_url, supabase_key)
        
        try:
            # Armazenar conexão
            if user_id not in sse_connections:
                sse_connections[user_id] = []
            sse_connections[user_id].append(connection_id)
            
            # Evento inicial
            yield {
                "event": "connection_established",
                "data": json.dumps({
                    "connection_id": connection_id,
                    "timestamp": datetime.utcnow().isoformat()
                })
            }
            
            # Loop de eventos
            while True:
                # Simular eventos em tempo real
                events = [
                    {
                        "type": "conversation_started",
                        "data": {
                            "conversation_id": str(uuid.uuid4()),
                            "agent_name": "Assistente de Vendas",
                            "user_message": "Olá, preciso de ajuda"
                        }
                    },
                    {
                        "type": "message_received",
                        "data": {
                            "conversation_id": str(uuid.uuid4()),
                            "content": "Nova mensagem recebida",
                            "timestamp": datetime.utcnow().isoformat()
                        }
                    },
                    {
                        "type": "system_update",
                        "data": {
                            "stats": {
                                "active_conversations": 12,
                                "total_agents": 5,
                                "response_time": "2.1s"
                            }
                        }
                    }
                ]
                
                # Enviar evento aleatório
                import random
                event = random.choice(events)
                event["timestamp"] = datetime.utcnow().isoformat()
                event["user_id"] = user_id
                
                yield f"data: {json.dumps(event)}\n\n"
                
                # Heartbeat
                await asyncio.sleep(10)
                yield f"data: {json.dumps({'type': 'heartbeat', 'timestamp': datetime.utcnow().isoformat()})}\n\n"
                
        except asyncio.CancelledError:
            # Cleanup na desconexão
            if user_id in sse_connections and connection_id in sse_connections[user_id]:
                sse_connections[user_id].remove(connection_id)
            raise
        except Exception as e:
            logger.error(f"Erro no stream SSE: {str(e)}")
            yield f"data: {json.dumps({'type': 'error', 'data': str(e)})}\n\n"
    
    return EventSourceResponse(generate_events())

# ============================================
# SETTINGS v2.0
# ============================================

@app.get("/api/v2/settings", tags=["settings"])
async def get_user_settings_v2(
    user_data: dict = Depends(get_current_user)
):
    """Buscar configurações do usuário"""
    try:
        # Buscar configurações
        settings_response = supabase.table("user_settings").select("*").eq("user_id", user_data["id"]).execute()
        
        if settings_response.data:
            settings = settings_response.data[0]
        else:
            # Configurações padrão
            settings = {
                "theme": "dark",
                "language": "pt-br",
                "email_notifications": True,
                "default_model": "gpt-4",
                "default_temperature": 0.7,
                "max_tokens": 2048
            }
        
        # Estatísticas de uso simuladas
        usage = {
            "total_requests": 1250,
            "total_tokens": 450000,
            "remaining_quota": 750
        }
        
        # Modelos disponíveis
        available_models = [
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "provider": "openai"},
            {"id": "gpt-4", "name": "GPT-4", "provider": "openai"},
            {"id": "claude-3-sonnet", "name": "Claude 3 Sonnet", "provider": "anthropic"}
        ]
        
        return {
            "success": True,
            "data": {
                "settings": settings,
                "usage": usage,
                "available_models": available_models
            }
        }
        
    except Exception as e:
        logger.error(f"Erro ao buscar configurações: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.put("/api/v2/settings", tags=["settings"])
async def update_user_settings_v2(
    settings: UserSettings,
    user_data: dict = Depends(get_current_user)
):
    """Atualizar configurações do usuário"""
    try:
        settings_data = settings.dict()
        settings_data["user_id"] = user_data["id"]
        settings_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Upsert configurações
        response = supabase.table("user_settings").upsert(settings_data, on_conflict="user_id").execute()
        
        return {
            "success": True,
            "data": response.data[0] if response.data else settings_data,
            "message": "Configurações atualizadas com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro ao atualizar configurações: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# ============================================
# HEALTH & SYSTEM
# ============================================

@app.get("/", tags=["system"])
async def root():
    """Endpoint raiz da API"""
    return {
        "message": "Agentes de Conversão API v2.0",
        "version": "2.0.0",
        "status": "online",
        "timestamp": datetime.utcnow().isoformat(),
        "features": [
            "streaming_chat",
            "agent_tools",
            "real_time_analytics",
            "sse_events",
            "advanced_webhooks",
            "knowledge_search"
        ]
    }

@app.get("/api/v2/health", tags=["system"])
async def health_check_v2():
    """Health check completo"""
    try:
        # Testar conexão com Supabase
        supabase_status = "ok"
        try:
            supabase.table("agents").select("id").limit(1).execute()
        except:
            supabase_status = "error"
        
        # Testar conexão com Redis
        redis_status = "ok"
        try:
            await redis_client.ping()
        except:
            redis_status = "error"
        
        return {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "2.0.0",
            "services": {
                "supabase": supabase_status,
                "redis": redis_status
            },
            "features": {
                "streaming": True,
                "sse": True,
                "tools": True,
                "analytics": True
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

# ============================================
# STARTUP & SHUTDOWN
# ============================================

@app.on_event("startup")
async def startup_event():
    """Eventos de inicialização"""
    logger.info("🚀 Agentes de Conversão API v2.0 iniciada")
    logger.info("📡 Funcionalidades ativas: Streaming, SSE, Tools, Analytics")

@app.on_event("shutdown")
async def shutdown_event():
    """Eventos de encerramento"""
    logger.info("🔄 Encerrando API v2.0")
    
    # Fechar conexões SSE
    for user_connections in sse_connections.values():
        user_connections.clear()
    sse_connections.clear()
    
    # Fechar Redis
    await redis_client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info"
    )