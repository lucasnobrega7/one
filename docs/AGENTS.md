AGENTS.md - Agentes de Conversão Platform

Informações do Projeto
Nome: Agentes de Conversão - Plataforma SaaS
Descrição: Plataforma para criação de agentes de IA focados em conversão via WhatsApp
Modelo de Negócio: SaaS com planos de assinatura e sistema de créditos
Arquitetura: Microserviços com FastAPI + Frontend separado
Stack Principal: FastAPI (Python), Supabase, Z-API, OpenAI/Anthropic
Linguagens: Python (Backend), TypeScript/JavaScript (Frontend)
Deploy: Railway
Ambiente Atual: Produção ativa na Railway
Contexto do Produto
Esta é uma plataforma SaaS específica para Agentes de Conversão que permite:
Fluxo de Usuário Principal

Landing Page: Apresentação dos planos de assinatura
Checkout Único: Cadastro + Pagamento em formulário ágil
Dashboard: Área exclusiva com visão geral de uso e créditos
Setup Rápido: Integração WhatsApp + LLM em poucos cliques
Criação Visual: Editor de fluxos estilo Flowise para agentes de conversão

Funcionalidades Core

Sistema de planos de assinatura com diferentes limites
Sistema de créditos para uso de LLM e mensagens
Integração WhatsApp via Z-API
Editor visual de fluxos para definir jornadas de conversão
Agentes AI especializados em conversão e vendas
Dashboard de métricas e performance dos agentes

Arquitetura Real da API
Backend FastAPI (Python)
api/
├── main.py                    # FastAPI app principal
├── routers/
│   ├── zapi.py               # WhatsApp integration endpoints
│   ├── supabase.py           # Database operations
│   ├── auth.py               # Authentication endpoints
│   └── ai.py                 # AI/Chat services
├── models/
│   ├── requests.py           # Pydantic request models
│   ├── responses.py          # Pydantic response models
│   └── schemas.py            # Database schemas
├── services/
│   ├── zapi_service.py       # Z-API integration logic
│   ├── supabase_service.py   # Supabase operations
│   ├── auth_service.py       # Authentication logic
│   └── ai_service.py         # OpenAI/Anthropic integration
└── utils/
    ├── config.py             # Environment variables
    ├── dependencies.py       # FastAPI dependencies
    └── exceptions.py         # Custom exceptions
Endpoints da API Real
WhatsApp Integration (Z-API)
python# Enviar mensagem WhatsApp
POST /zapi/send
{
    "phone": "5511999999999",
    "message": "Olá! Como posso ajudar?",
    "media_url": null,
    "media_type": "image",
    "caption": null,
    "delay_message": null,
    "delay_typing": null
}

# Webhook handler (receber mensagens)
POST /zapi/webhook
Header: client-token (optional)
# Payload: WhatsApp webhook events

# Encaminhar mensagem
POST /zapi/forward
{
    "phone": "5511999999999",
    "message_id": "msg_123",
    "message_phone": "5511888888888",
    "delay_message": null
}

# Configurar webhook URL
PUT /zapi/webhook-url
{
    "url": "https://sua-api.railway.app/zapi/webhook"
}

# Status da Z-API
GET /zapi/status

# Buscar mensagens recentes
GET /zapi/messages?limit=10&status=received
Database Operations (Supabase)
python# Query dados
POST /supabase/query
{
    "table": "conversion_agents",
    "select": "*",
    "filters": {"user_id": "user_123"},
    "limit": 10,
    "order": {"created_at": "desc"}
}

# Inserir dados
POST /supabase/insert
{
    "table": "conversion_agents",
    "data": {
        "user_id": "user_123",
        "name": "Agente de Vendas",
        "description": "Especialista em conversão"
    }
}

# Atualizar dados
POST /supabase/update
{
    "table": "conversion_agents",
    "data": {"is_active": true},
    "filters": {"id": "agent_123"}
}

# Deletar dados
POST /supabase/delete
{
    "table": "conversion_agents",
    "filters": {"id": "agent_123"}
}
Authentication
python# Registro de usuário
POST /auth/signup
{
    "email": "user@example.com",
    "password": "senha123",
    "metadata": {"plan": "starter"}
}

# Login
POST /auth/login
{
    "email": "user@example.com",
    "password": "senha123"
}

# Verificar token
GET /auth/verify
Header: Authorization: Bearer {token}

# Reset de senha
POST /auth/reset-password
{
    "email": "user@example.com"
}

# Logout
POST /auth/logout
Header: Authorization: Bearer {token}
AI Services
python# Chat completion (OpenAI/Anthropic)
POST /ai/chat/completion
Header: Authorization: Bearer {token}
{
    "messages": [
        {"role": "user", "content": "Olá!"},
        {"role": "assistant", "content": "Olá! Como posso ajudar?"}
    ],
    "model": "gpt-4",
    "temperature": 0.7,
    "max_tokens": 800,
    "conversation_id": "conv_123",
    "provider": "openai"
}

# Buscar conversa específica
GET /ai/conversations/{conversation_id}
Header: Authorization: Bearer {token}

# Listar conversas do usuário
GET /ai/conversations?limit=10
Header: Authorization: Bearer {token}
Modelos Pydantic (Schemas)
Request Models
python# models/requests.py
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class MessageRequest(BaseModel):
    phone: str
    message: str
    media_url: Optional[str] = None
    media_type: Optional[str] = "image"
    caption: Optional[str] = None
    delay_message: Optional[int] = None
    delay_typing: Optional[int] = None
    edit_message_id: Optional[str] = None

class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = "gpt-4"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 800
    conversation_id: Optional[str] = None
    provider: str = "openai"

class TableQuery(BaseModel):
    table: str
    select: str = "*"
    filters: Optional[Dict[str, Any]] = None
    limit: Optional[int] = None
    order: Optional[Dict[str, str]] = None

class InsertData(BaseModel):
    table: str
    data: Dict[str, Any]

class UpdateData(BaseModel):
    table: str
    data: Dict[str, Any]
    filters: Dict[str, Any]
Response Models
python# models/responses.py
class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserInfo
    expires_in: int

class ConversationResponse(BaseModel):
    id: str
    messages: List[ChatMessage]
    created_at: str
    updated_at: str
    user_id: str
Padrões de Desenvolvimento FastAPI
Estrutura de Router
python# routers/zapi.py
from fastapi import APIRouter, HTTPException, Header
from models.requests import MessageRequest, ForwardMessageRequest
from services.zapi_service import ZAPIService

router = APIRouter(prefix="/zapi", tags=["WhatsApp Integration"])

@router.post("/send")
async def send_whatsapp_message(request: MessageRequest):
    """Send a WhatsApp message using Z-API"""
    try:
        zapi = ZAPIService()
        result = await zapi.send_message(request)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def webhook_handler(
    request: dict,
    client_token: Optional[str] = Header(None)
):
    """Handle webhook notifications from Z-API"""
    try:
        # SEMPRE processar webhook rapidamente
        await process_webhook_async(request)
        return {"success": True}
    except Exception as e:
        # NUNCA falhar webhook por erro interno
        print(f"Webhook error: {e}")
        return {"success": False, "error": str(e)}
Service Layer Pattern
python# services/zapi_service.py
import httpx
from utils.config import settings

class ZAPIService:
    def __init__(self):
        self.base_url = "https://api.z-api.io"
        self.instance_id = settings.ZAPI_INSTANCE_ID
        self.token = settings.ZAPI_TOKEN
    
    async def send_message(self, request: MessageRequest):
        """Send message via Z-API"""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/instances/{self.instance_id}/token/{self.token}/send-text"
            
            payload = {
                "phone": request.phone,
                "message": request.message
            }
            
            # Adicionar mídia se fornecida
            if request.media_url:
                payload["image"] = request.media_url
                payload["caption"] = request.caption
            
            response = await client.post(url, json=payload)
            response.raise_for_status()
            return response.json()
    
    async def get_status(self):
        """Check Z-API instance status"""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/instances/{self.instance_id}/token/{self.token}/status"
            response = await client.get(url)
            return response.json()
Authentication Dependency
python# utils/dependencies.py
from fastapi import HTTPException, Header
from services.auth_service import AuthService

async def get_current_user(authorization: str = Header(...)):
    """Dependency para autenticação"""
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        
        token = authorization.replace("Bearer ", "")
        auth_service = AuthService()
        user = await auth_service.verify_token(token)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")

# Uso nos endpoints
@router.get("/conversations")
async def list_conversations(
    limit: int = 10,
    current_user = Depends(get_current_user)
):
    # Endpoint protegido
    pass
Configuração de Ambiente
Environment Variables
python# utils/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Z-API Configuration
    ZAPI_INSTANCE_ID: str
    ZAPI_TOKEN: str
    ZAPI_BASE_URL: str = "https://api.z-api.io"
    
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Authentication
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # AI Services
    OPENAI_API_KEY: str
    ANTHROPIC_API_KEY: str
    
    # Railway/Production
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    class Config:
        env_file = ".env"

settings = Settings()
Docker/Railway Configuration
python# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import zapi, supabase, auth, ai
from utils.config import settings

app = FastAPI(
    title="Agentes de Conversão API",
    description="API oficial para a plataforma Agentes de Conversão",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configurar para domínios específicos em prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(zapi.router)
app.include_router(supabase.router)
app.include_router(auth.router)
app.include_router(ai.router)

@app.get("/")
async def read_root():
    return {"message": "Agentes de Conversão API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
Sistema de Conversas e Fluxos
Conversation Management
python# services/conversation_service.py
class ConversationService:
    async def create_conversation(self, user_id: str, agent_id: str) -> str:
        """Criar nova conversa"""
        conversation_data = {
            "user_id": user_id,
            "agent_id": agent_id,
            "status": "active",
            "created_at": datetime.now().isoformat()
        }
        
        result = await supabase.table("conversations").insert(conversation_data).execute()
        return result.data[0]["id"]
    
    async def add_message(self, conversation_id: str, role: str, content: str):
        """Adicionar mensagem à conversa"""
        message_data = {
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        }
        
        await supabase.table("messages").insert(message_data).execute()
    
    async def get_conversation_history(self, conversation_id: str) -> List[Dict]:
        """Buscar histórico da conversa"""
        result = await supabase.table("messages")\
            .select("*")\
            .eq("conversation_id", conversation_id)\
            .order("timestamp", desc=False)\
            .execute()
        
        return result.data
Integration com Fluxos
python# services/flow_service.py
class FlowService:
    async def execute_flow(self, agent_id: str, user_message: str, conversation_id: str):
        """Executar fluxo do agente"""
        # 1. Buscar configuração do agente
        agent = await self.get_agent(agent_id)
        
        # 2. Buscar histórico da conversa
        history = await ConversationService().get_conversation_history(conversation_id)
        
        # 3. Preparar contexto para LLM
        context = self.prepare_context(agent, history, user_message)
        
        # 4. Chamar AI service
        ai_response = await AIService().chat_completion({
            "messages": context,
            "model": agent.get("model", "gpt-4"),
            "temperature": agent.get("temperature", 0.7),
            "conversation_id": conversation_id
        })
        
        # 5. Processar resposta e aplicar regras do fluxo
        processed_response = await self.process_response(ai_response, agent)
        
        return processed_response
Comandos e Scripts
Desenvolvimento Local
bash# Setup inicial
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Executar desenvolvimento
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Testes
pytest tests/
pytest tests/test_zapi.py -v
pytest tests/test_auth.py -v
Deploy Railway
bash# Build e deploy automático via GitHub
# Railway detecta FastAPI automaticamente

# Variáveis necessárias no Railway:
ZAPI_INSTANCE_ID=your_instance_id
ZAPI_TOKEN=your_token
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your-key
JWT_SECRET_KEY=your_secret_key
Diretrizes Específicas para o Agente
Ao Trabalhar com FastAPI

SEMPRE usar Pydantic models para request/response
SEMPRE implementar exception handling nos endpoints
SEMPRE usar async/await para operações I/O
SEMPRE documentar endpoints com docstrings

Ao Trabalhar com Z-API

SEMPRE tratar webhooks de forma assíncrona
SEMPRE responder webhooks rapidamente (< 5s)
SEMPRE implementar retry logic para falhas de envio
SEMPRE validar formato de telefone antes de enviar

Ao Trabalhar com Supabase

SEMPRE usar os endpoints de database da API
SEMPRE aplicar filtros para multi-tenancy (user_id)
SEMPRE tratar erros de conexão gracefully
SEMPRE implementar paginação para listas grandes

Ao Trabalhar com AI Services

SEMPRE manter contexto de conversa
SEMPRE implementar fallbacks para falhas de LLM
SEMPRE monitorar tokens e custos
SEMPRE validar entrada antes de enviar para LLM


🎯 Tecnologia Real: FastAPI (Python) + Supabase + Z-API + OpenAI/Anthropic. Esta é uma API REST moderna com integração direta aos serviços, não um monorepo Node.js. Focar em padrões FastAPI e desenvolvimento Python assíncrono.