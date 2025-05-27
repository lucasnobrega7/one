from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import uuid
import logging
import uvicorn
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Agentes de Conversão API",
    description="Complete API for managing AI agents and conversations",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add Trusted Host Middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*"]  # Allow all hosts for simplicity
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize security
security = HTTPBearer(auto_error=False)

# Models
class User(BaseModel):
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    organization_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class CreateAgentRequest(BaseModel):
    name: str
    description: str
    instructions: str
    model_name: str = "gpt-4"
    temperature: float = 0.7
    visibility: str = "private"
    icon_url: Optional[str] = None
    handle: Optional[str] = None
    include_sources: bool = True
    interface_config: Optional[Dict[str, Any]] = None

class Agent(BaseModel):
    id: str
    organization_id: str
    name: str
    description: str
    instructions: str
    model_name: str
    temperature: float
    visibility: str
    icon_url: Optional[str] = None
    handle: Optional[str] = None
    include_sources: bool
    interface_config: Optional[Dict[str, Any]] = None
    tools: List[Dict[str, Any]] = []
    created_at: datetime
    updated_at: datetime

class UpdateAgentRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    model_name: Optional[str] = None
    temperature: Optional[float] = None
    visibility: Optional[str] = None
    icon_url: Optional[str] = None
    handle: Optional[str] = None
    include_sources: Optional[bool] = None
    interface_config: Optional[Dict[str, Any]] = None
    tools: Optional[List[Dict[str, Any]]] = None

class AgentQuery(BaseModel):
    query: str
    conversation_id: Optional[str] = None
    visitor_id: Optional[str] = None
    temperature: Optional[float] = None
    streaming: bool = False
    max_tokens: Optional[int] = None

class AgentResponse(BaseModel):
    answer: str
    conversation_id: str
    visitor_id: str
    sources: List[Dict[str, Any]] = []

class Conversation(BaseModel):
    id: str
    agent_id: str
    visitor_id: str
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    messages: List[Dict[str, Any]] = []

class Message(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: datetime

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    services: Dict[str, str]

# Authentication middleware
async def get_current_user(request: Request, credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    # For development, return anonymous user
    return {"id": "anonymous", "email": "anonymous@example.com"}

# Helper function to get organization ID from user
async def get_organization_id(user_data: dict):
    if "organization_memberships" in user_data and user_data["organization_memberships"]:
        return user_data["organization_memberships"][0]["organization"]["id"]
    return "default-org-id"

# Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Agentes de Conversão API",
        "version": "2.0.0",
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "agents": "/api/agents",
            "conversations": "/api/conversations",
            "analytics": "/api/analytics"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        version="2.0.0",
        services={
            "api": "operational",
            "database": "mock",
            "cache": "mock"
        }
    )

# Agents endpoints
@app.post("/api/agents", response_model=Agent)
async def create_agent(
    agent_data: CreateAgentRequest,
    user_data: dict = Depends(get_current_user)
):
    """Create a new agent"""
    organization_id = await get_organization_id(user_data)
    
    agent_id = str(uuid.uuid4())
    now = datetime.now()
    
    agent = Agent(
        id=agent_id,
        organization_id=organization_id,
        name=agent_data.name,
        description=agent_data.description,
        instructions=agent_data.instructions,
        model_name=agent_data.model_name,
        temperature=agent_data.temperature,
        visibility=agent_data.visibility,
        icon_url=agent_data.icon_url,
        handle=agent_data.handle,
        include_sources=agent_data.include_sources,
        interface_config=agent_data.interface_config,
        tools=[],
        created_at=now,
        updated_at=now
    )
    
    return agent

@app.get("/api/agents", response_model=List[Agent])
async def list_agents(user_data: dict = Depends(get_current_user)):
    """List all agents for the user's organization"""
    now = datetime.now()
    
    # Return demo agents for demonstration
    return [
        Agent(
            id="demo-sales-agent",
            organization_id="default-org-id",
            name="Agente de Vendas",
            description="Especialista em conversão de leads e vendas",
            instructions="Você é um especialista em vendas que ajuda clientes a encontrar soluções ideais para suas necessidades. Seja consultivo, identifique dores e apresente benefícios claros.",
            model_name="gpt-4",
            temperature=0.7,
            visibility="private",
            include_sources=True,
            tools=[],
            created_at=now,
            updated_at=now
        ),
        Agent(
            id="demo-support-agent",
            organization_id="default-org-id",
            name="Agente de Suporte",
            description="Assistente para atendimento ao cliente",
            instructions="Você é um especialista em atendimento ao cliente que resolve problemas de forma rápida e eficiente. Seja empático, ouça ativamente e forneça soluções claras.",
            model_name="gpt-4",
            temperature=0.5,
            visibility="private",
            include_sources=True,
            tools=[],
            created_at=now,
            updated_at=now
        ),
        Agent(
            id="demo-education-agent",
            organization_id="default-org-id",
            name="Agente Educacional",
            description="Tutor virtual para ensinar e orientar",
            instructions="Você é um educador especializado que explica conceitos de forma clara e engajante. Use exemplos práticos e adapte sua linguagem ao nível do usuário.",
            model_name="gpt-4",
            temperature=0.6,
            visibility="private",
            include_sources=True,
            tools=[],
            created_at=now,
            updated_at=now
        )
    ]

@app.get("/api/agents/{agent_id}", response_model=Agent)
async def get_agent(
    agent_id: str,
    user_data: dict = Depends(get_current_user)
):
    """Get a specific agent by ID"""
    now = datetime.now()
    
    # Return mock agent
    return Agent(
        id=agent_id,
        organization_id="default-org-id",
        name="Demo Agent",
        description="A demonstration agent",
        instructions="You are a helpful AI assistant.",
        model_name="gpt-4",
        temperature=0.7,
        visibility="private",
        include_sources=True,
        tools=[],
        created_at=now,
        updated_at=now
    )

@app.patch("/api/agents/{agent_id}", response_model=Agent)
async def update_agent(
    agent_id: str,
    agent_data: UpdateAgentRequest,
    user_data: dict = Depends(get_current_user)
):
    """Update an existing agent"""
    now = datetime.now()
    
    # Return updated mock agent
    return Agent(
        id=agent_id,
        organization_id="default-org-id",
        name=agent_data.name or "Updated Agent",
        description=agent_data.description or "An updated agent",
        instructions=agent_data.instructions or "You are a helpful AI assistant.",
        model_name=agent_data.model_name or "gpt-4",
        temperature=agent_data.temperature or 0.7,
        visibility=agent_data.visibility or "private",
        icon_url=agent_data.icon_url,
        handle=agent_data.handle,
        include_sources=agent_data.include_sources or True,
        interface_config=agent_data.interface_config,
        tools=agent_data.tools or [],
        created_at=now,
        updated_at=now
    )

@app.delete("/api/agents/{agent_id}")
async def delete_agent(
    agent_id: str,
    user_data: dict = Depends(get_current_user)
):
    """Delete an agent"""
    return {"message": f"Agent {agent_id} deleted successfully"}

@app.post("/api/agents/{agent_id}/query", response_model=AgentResponse)
async def query_agent(
    agent_id: str,
    query: AgentQuery,
    user_data: dict = Depends(get_current_user)
):
    """Query an agent"""
    conversation_id = query.conversation_id or str(uuid.uuid4())
    visitor_id = query.visitor_id or str(uuid.uuid4())
    
    # Mock response
    return AgentResponse(
        answer=f"This is a mock response to your query: '{query.query}'",
        conversation_id=conversation_id,
        visitor_id=visitor_id,
        sources=[]
    )

# Conversations endpoints
@app.get("/api/conversations", response_model=List[Conversation])
async def list_conversations(user_data: dict = Depends(get_current_user)):
    """List all conversations for the user's organization"""
    return []

@app.get("/api/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(
    conversation_id: str,
    user_data: dict = Depends(get_current_user)
):
    """Get a specific conversation by ID"""
    now = datetime.now()
    
    return Conversation(
        id=conversation_id,
        agent_id="demo-agent-id",
        visitor_id="demo-visitor-id",
        title="Demo Conversation",
        created_at=now,
        updated_at=now,
        messages=[]
    )

# Analytics endpoints
@app.get("/api/analytics")
async def get_analytics(user_data: dict = Depends(get_current_user)):
    """Get analytics data for the user's organization"""
    # Generate mock time series data for the last 30 days
    today = datetime.now()
    time_series = []
    
    for i in range(30):
        date = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        time_series.append({
            "date": date,
            "conversations": max(0, 50 - i * 2),
            "messages": max(0, 200 - i * 8),
        })
    
    time_series.reverse()  # Put in chronological order
    
    return {
        "overview": {
            "total_agents": 5,
            "total_conversations": 150,
            "total_messages": 750,
            "active_users": 25,
        },
        "time_series": time_series
    }

# User endpoints
@app.get("/api/user/profile")
async def get_user_profile(user_data: dict = Depends(get_current_user)):
    """Get user profile"""
    return {
        "id": user_data["id"],
        "email": user_data["email"],
        "name": f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip(),
        "avatar_url": user_data.get("avatar_url"),
        "created_at": datetime.now().isoformat()
    }

@app.post("/api/user/complete-onboarding")
async def complete_onboarding(
    onboarding_data: Dict[str, Any],
    user_data: dict = Depends(get_current_user)
):
    """Complete user onboarding"""
    return {
        "success": True,
        "message": "Onboarding completed successfully",
        "user_id": user_data["id"]
    }

# Status endpoint
@app.get("/api/status")
async def get_api_status():
    """Get API status and information"""
    return {
        "status": "operational",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "uptime": "100%",
        "endpoints": {
            "agents": "operational",
            "conversations": "operational",
            "analytics": "operational",
            "user": "operational"
        }
    }

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception handler: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": "internal_error",
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "type": "http_error",
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"🚀 Starting Agentes de Conversão API v2.0 on Railway")
    logger.info(f"📡 Port: {port}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )