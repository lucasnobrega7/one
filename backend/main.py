from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import uuid
from datetime import datetime, timedelta
import redis.asyncio as redis
import json
from supabase import create_client, Client
from contextlib import asynccontextmanager

# Importar módulo AI
from api.ai_integration import include_ai_router, cleanup_ai

# Lifespan manager para AI cleanup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting AgentForge API with AI Integration...")
    yield
    # Shutdown
    print("🔧 Cleaning up AI connections...")
    await cleanup_ai()

# Initialize FastAPI app
app = FastAPI(
    title="AgentForge API + AI Integration",
    description="API for managing AI agents and conversations with OpenRouter integration",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize Redis client
redis_url = os.environ.get("REDIS_URL")
redis_client = redis.from_url(redis_url)

# Initialize security
security = HTTPBearer()

# Clerk webhook secret for verification
clerk_webhook_secret = os.environ.get("CLERK_WEBHOOK_SECRET")

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

class Organization(BaseModel):
    id: str
    name: str
    slug: Optional[str] = None
    logo_url: Optional[str] = None
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
    presence_penalty: Optional[float] = None
    frequency_penalty: Optional[float] = None
    top_p: Optional[float] = None
    filters: Optional[Dict[str, Any]] = None
    system_prompt: Optional[str] = None
    user_prompt: Optional[str] = None

class AgentResponse(BaseModel):
    answer: str
    conversation_id: str
    visitor_id: str
    sources: List[Dict[str, Any]] = []

class CreateDatastoreRequest(BaseModel):
    name: str
    description: str
    type: str = "document"
    visibility: str = "private"

class Datastore(BaseModel):
    id: str
    organization_id: str
    name: str
    description: str
    type: str
    visibility: str
    created_at: datetime
    updated_at: datetime

class DatastoreQuery(BaseModel):
    query: str
    top_k: int = 5
    filters: Optional[Dict[str, Any]] = None

class DatastoreSearchResponse(BaseModel):
    results: List[Dict[str, Any]]
    query: str

class Message(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: datetime

class Conversation(BaseModel):
    id: str
    agent_id: str
    visitor_id: str
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    messages: List[Message] = []

# Authentication middleware
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    
    try:
        # Verify token with Clerk
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.clerk.dev/v1/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials",
                )
            
            user_data = response.json()
            return user_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
        )

# Helper function to get organization ID from user
async def get_organization_id(user_data: dict):
    # Get the first organization ID from the user data
    # In a real app, you might want to handle multiple organizations
    if "organization_memberships" in user_data and user_data["organization_memberships"]:
        return user_data["organization_memberships"][0]["organization"]["id"]
    return None

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to AgentForge API"}

# Agents endpoints
@app.post("/api/agents", response_model=Agent)
async def create_agent(
    agent_data: CreateAgentRequest,
    user_data: dict = Depends(get_current_user)
):
    organization_id = await get_organization_id(user_data)
    if not organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a member of any organization",
        )
    
    agent_id = str(uuid.uuid4())
    now = datetime.now()
    
    agent = {
        "id": agent_id,
        "organization_id": organization_id,
        "name": agent_data.name,
        "description": agent_data.description,
        "instructions": agent_data.instructions,
        "model_name": agent_data.model_name,
        "temperature": agent_data.temperature,
        "visibility": agent_data.visibility,
        "icon_url": agent_data.icon_url,
        "handle": agent_data.handle,
        "include_sources": agent_data.include_sources,
        "interface_config": agent_data.interface_config,
        "tools": [],
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
    }
    
    # Insert into Supabase
    response = supabase.table("agents").insert(agent).execute()
    
    if response.data:
        # Cache in Redis for faster access
        await redis_client.set(f"agent:{agent_id}", json.dumps(agent), ex=3600)  # 1 hour expiration
        return Agent(**agent)
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create agent",
        )

@app.get("/api/agents", response_model=List[Agent])
async def list_agents(
    user_data: dict = Depends(get_current_user)
):
    organization_id = await get_organization_id(user_data)
    if not organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a member of any organization",
        )
    
    # Get from Supabase
    response = supabase.table("agents").select("*").eq("organization_id", organization_id).execute()
    
    if response.data:
        return [Agent(**agent) for agent in response.data]
    else:
        return []

@app.get("/api/agents/{agent_id}", response_model=Agent)
async def get_agent(
    agent_id: str,
    user_data: dict = Depends(get_current_user)
):
    # Try to get from Redis first
    cached_agent = await redis_client.get(f"agent:{agent_id}")
    if cached_agent:
        return Agent(**json.loads(cached_agent))
    
    # If not in cache, get from Supabase
    response = supabase.table("agents").select("*").eq("id", agent_id).execute()
    
    if response.data and len(response.data) > 0:
        agent = response.data[0]
        
        # Cache in Redis for faster access
        await redis_client.set(f"agent:{agent_id}", json.dumps(agent), ex=3600)  # 1 hour expiration
        
        return Agent(**agent)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID {agent_id} not found",
        )

@app.patch("/api/agents/{agent_id}", response_model=Agent)
async def update_agent(
    agent_id: str,
    agent_data: UpdateAgentRequest,
    user_data: dict = Depends(get_current_user)
):
    # Get the agent first to check if it exists
    response = supabase.table("agents").select("*").eq("id", agent_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID {agent_id} not found",
        )
    
    agent = response.data[0]
    
    # Check if user has permission to update this agent
    organization_id = await get_organization_id(user_data)
    if agent["organization_id"] != organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this agent",
        )
    
    # Update only the fields that were provided
    update_data = agent_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now().isoformat()
    
    # Update in Supabase
    response = supabase.table("agents").update(update_data).eq("id", agent_id).execute()
    
    if response.data and len(response.data) > 0:
        updated_agent = response.data[0]
        
        # Update cache in Redis
        await redis_client.set(f"agent:{agent_id}", json.dumps(updated_agent), ex=3600)
        
        return Agent(**updated_agent)
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update agent",
        )

@app.delete("/api/agents/{agent_id}")
async def delete_agent(
    agent_id: str,
    user_data: dict = Depends(get_current_user)
):
    # Get the agent first to check if it exists
    response = supabase.table("agents").select("*").eq("id", agent_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID {agent_id} not found",
        )
    
    agent = response.data[0]
    
    # Check if user has permission to delete this agent
    organization_id = await get_organization_id(user_data)
    if agent["organization_id"] != organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this agent",
        )
    
    # Delete from Supabase
    response = supabase.table("agents").delete().eq("id", agent_id).execute()
    
    if response.data:
        # Delete from Redis cache
        await redis_client.delete(f"agent:{agent_id}")
        
        return {"message": f"Agent with ID {agent_id} deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete agent",
        )

@app.post("/api/agents/{agent_id}/query", response_model=AgentResponse)
async def query_agent(
    agent_id: str,
    query: AgentQuery,
    user_data: dict = Depends(get_current_user)
):
    # Get the agent
    response = supabase.table("agents").select("*").eq("id", agent_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID {agent_id} not found",
        )
    
    agent = response.data[0]
    
    # Create or get conversation
    conversation_id = query.conversation_id
    visitor_id = query.visitor_id or str(uuid.uuid4())
    
    if not conversation_id:
        # Create a new conversation
        conversation_id = str(uuid.uuid4())
        now = datetime.now()
        
        conversation = {
            "id": conversation_id,
            "agent_id": agent_id,
            "visitor_id": visitor_id,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }
        
        supabase.table("conversations").insert(conversation).execute()
    
    # Create user message
    message_id = str(uuid.uuid4())
    now = datetime.now()
    
    user_message = {
        "id": message_id,
        "conversation_id": conversation_id,
        "role": "user",
        "content": query.query,
        "created_at": now.isoformat(),
    }
    
    supabase.table("messages").insert(user_message).execute()
    
    # Process the query with the agent
    # In a real implementation, this would call an LLM API
    # For this example, we'll just return a mock response
    
    # Simulate processing time
    import asyncio
    await asyncio.sleep(1)
    
    # Create assistant message
    assistant_message_id = str(uuid.uuid4())
    now = datetime.now()
    
    assistant_message = {
        "id": assistant_message_id,
        "conversation_id": conversation_id,
        "role": "assistant",
        "content": f"This is a simulated response to your query: '{query.query}'",
        "created_at": now.isoformat(),
    }
    
    supabase.table("messages").insert(assistant_message).execute()
    
    # Return the response
    return AgentResponse(
        answer=assistant_message["content"],
        conversation_id=conversation_id,
        visitor_id=visitor_id,
        sources=[]
    )

# Datastores endpoints
@app.post("/api/datastores", response_model=Datastore)
async def create_datastore(
    datastore_data: CreateDatastoreRequest,
    user_data: dict = Depends(get_current_user)
):
    organization_id = await get_organization_id(user_data)
    if not organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a member of any organization",
        )
    
    datastore_id = str(uuid.uuid4())
    now = datetime.now()
    
    datastore = {
        "id": datastore_id,
        "organization_id": organization_id,
        "name": datastore_data.name,
        "description": datastore_data.description,
        "type": datastore_data.type,
        "visibility": datastore_data.visibility,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
    }
    
    # Insert into Supabase
    response = supabase.table("datastores").insert(datastore).execute()
    
    if response.data:
        # Cache in Redis for faster access
        await redis_client.set(f"datastore:{datastore_id}", json.dumps(datastore), ex=3600)
        return Datastore(**datastore)
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create datastore",
        )

@app.get("/api/datastores", response_model=List[Datastore])
async def list_datastores(
    user_data: dict = Depends(get_current_user)
):
    organization_id = await get_organization_id(user_data)
    if not organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a member of any organization",
        )
    
    # Get from Supabase
    response = supabase.table("datastores").select("*").eq("organization_id", organization_id).execute()
    
    if response.data:
        return [Datastore(**datastore) for datastore in response.data]
    else:
        return []

@app.post("/api/datastores/{datastore_id}/search", response_model=DatastoreSearchResponse)
async def search_datastore(
    datastore_id: str,
    query: DatastoreQuery,
    user_data: dict = Depends(get_current_user)
):
    # Get the datastore
    response = supabase.table("datastores").select("*").eq("id", datastore_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Datastore with ID {datastore_id} not found",
        )
    
    datastore = response.data[0]
    
    # Check if user has permission to search this datastore
    organization_id = await get_organization_id(user_data)
    if datastore["organization_id"] != organization_id and datastore["visibility"] != "public":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to search this datastore",
        )
    
    # In a real implementation, this would search the datastore
    # For this example, we'll just return mock results
    
    # Simulate search results
    results = [
        {
            "id": str(uuid.uuid4()),
            "content": f"This is a sample result for query: {query.query}",
            "metadata": {
                "source": "document1.pdf",
                "page": 1,
                "score": 0.95,
            }
        },
        {
            "id": str(uuid.uuid4()),
            "content": f"Another sample result for: {query.query}",
            "metadata": {
                "source": "document2.pdf",
                "page": 5,
                "score": 0.87,
            }
        }
    ]
    
    return DatastoreSearchResponse(
        results=results,
        query=query.query
    )

# Conversations endpoints
@app.get("/api/conversations", response_model=List[Conversation])
async def list_conversations(
    user_data: dict = Depends(get_current_user)
):
    organization_id = await get_organization_id(user_data)
    if not organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a member of any organization",
        )
    
    # Get conversations from agents owned by the organization
    response = supabase.table("conversations").select("*").execute()
    
    if response.data:
        conversations = []
        for conv in response.data:
            # Get agent to check organization
            agent_response = supabase.table("agents").select("organization_id").eq("id", conv["agent_id"]).execute()
            if agent_response.data and agent_response.data[0]["organization_id"] == organization_id:
                # Get messages for this conversation
                messages_response = supabase.table("messages").select("*").eq("conversation_id", conv["id"]).execute()
                messages = [Message(**msg) for msg in messages_response.data] if messages_response.data else []
                
                # Add messages to conversation
                conv_with_messages = {**conv, "messages": messages}
                conversations.append(Conversation(**conv_with_messages))
        
        return conversations
    else:
        return []

@app.get("/api/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(
    conversation_id: str,
    user_data: dict = Depends(get_current_user)
):
    # Get the conversation
    response = supabase.table("conversations").select("*").eq("id", conversation_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with ID {conversation_id} not found",
        )
    
    conversation = response.data[0]
    
    # Get the agent to check organization
    agent_response = supabase.table("agents").select("organization_id").eq("id", conversation["agent_id"]).execute()
    
    if not agent_response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent for conversation not found",
        )
    
    # Check if user has permission to view this conversation
    organization_id = await get_organization_id(user_data)
    if agent_response.data[0]["organization_id"] != organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this conversation",
        )
    
    # Get messages for this conversation
    messages_response = supabase.table("messages").select("*").eq("conversation_id", conversation_id).execute()
    messages = [Message(**msg) for msg in messages_response.data] if messages_response.data else []
    
    # Add messages to conversation
    conversation_with_messages = {**conversation, "messages": messages}
    
    return Conversation(**conversation_with_messages)

# Clerk webhook endpoint
@app.post("/api/webhooks/clerk")
async def clerk_webhook(request: dict):
    # In a real implementation, you would verify the webhook signature
    # For this example, we'll just process the webhook data
    
    event_type = request.get("type")
    
    if event_type == "user.created" or event_type == "user.updated":
        user_data = request.get("data", {})
        
        # Sync user to Supabase
        user_id = user_data.get("id")
        email = user_data.get("email_addresses", [{}])[0].get("email_address")
        first_name = user_data.get("first_name")
        last_name = user_data.get("last_name")
        avatar_url = user_data.get("image_url")
        
        if user_id and email:
            # Check if user exists in Supabase
            response = supabase.table("users").select("*").eq("id", user_id).execute()
            
            now = datetime.now()
            
            if response.data and len(response.data) > 0:
                # Update existing user
                supabase.table("users").update({
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "avatar_url": avatar_url,
                    "updated_at": now.isoformat(),
                }).eq("id", user_id).execute()
            else:
                # Create new user
                supabase.table("users").insert({
                    "id": user_id,
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "avatar_url": avatar_url,
                    "created_at": now.isoformat(),
                    "updated_at": now.isoformat(),
                }).execute()
    
    return {"success": True}

# Analytics endpoints
@app.get("/api/analytics")
async def get_analytics(
    user_data: dict = Depends(get_current_user)
):
    organization_id = await get_organization_id(user_data)
    if not organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a member of any organization",
        )
    
    # In a real implementation, this would query analytics data
    # For this example, we'll just return mock data
    
    # Get count of agents
    agents_response = supabase.table("agents").select("id").eq("organization_id", organization_id).execute()
    agent_count = len(agents_response.data) if agents_response.data else 0
    
    # Get count of conversations
    conversations_count = 0
    if agent_count > 0:
        agent_ids = [agent["id"] for agent in agents_response.data]
        for agent_id in agent_ids:
            conv_response = supabase.table("conversations").select("id").eq("agent_id", agent_id).execute()
            conversations_count += len(conv_response.data) if conv_response.data else 0
    
    # Get count of messages
    messages_count = 0
    if conversations_count > 0:
        # This is a simplified approach - in a real app, you'd use more efficient queries
        messages_response = supabase.table("messages").select("id").execute()
        messages_count = len(messages_response.data) if messages_response.data else 0
    
    # Generate mock time series data for the last 30 days
    today = datetime.now()
    time_series = []
    
    for i in range(30):
        date = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        time_series.append({
            "date": date,
            "conversations": int(conversations_count * 0.8 ** (i/7) + conversations_count * 0.2 * (1 - i/30)),
            "messages": int(messages_count * 0.8 ** (i/7) + messages_count * 0.2 * (1 - i/30)),
        })
    
    time_series.reverse()  # Put in chronological order
    
    return {
        "overview": {
            "total_agents": agent_count,
            "total_conversations": conversations_count,
            "total_messages": messages_count,
            "active_users": int(conversations_count * 0.7),  # Mock data
        },
        "time_series": time_series
    }

# Incluir router AI
include_ai_router(app)

# Health check atualizado
@app.get("/health")
async def health_check():
    """Health check com status AI"""
    from api.ai_integration import ai_router
    
    ai_status = await ai_router.get_providers_status()
    
    return {
        "status": "healthy",
        "version": "2.0.0",
        "features": {
            "agents": True,
            "conversations": True,
            "ai_integration": True,
            "openrouter": ai_status["openrouter"]["healthy"],
            "fallback_openai": ai_status["openai"]["healthy"]
        },
        "ai_providers": ai_status
    }

# Run the application with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
