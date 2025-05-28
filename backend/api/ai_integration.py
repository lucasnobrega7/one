"""
AI Integration API - OpenRouter + Fallback System
Sistema unificado para 300+ modelos com 87% margem
"""

import httpx
import asyncio
import json
import time
from typing import List, Dict, Any, Optional, AsyncGenerator
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
import os

router = APIRouter(prefix="/api/ai", tags=["AI Integration"])

# Configuração com suas chaves reais
OPENROUTER_API_KEY = "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"
OPENROUTER_PROVISIONING_KEY = "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"
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# Models
class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(system|user|assistant)$")
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = "openai/gpt-4o-mini"
    temperature: Optional[float] = Field(0.7, ge=0, le=2)
    max_tokens: Optional[int] = Field(4000, ge=1, le=128000)
    stream: Optional[bool] = False
    tools: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, str]] = None
    provider: str
    model: str
    usage: Optional[Dict[str, Any]] = None
    cost_analysis: Optional[Dict[str, Any]] = None

class ModelInfo(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    pricing: Optional[Dict[str, float]] = None
    context_length: Optional[int] = None
    supports_tools: bool = False
    supports_vision: bool = False
    category: str = "general"

class AIProvider:
    """Classe base para providers de IA"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = httpx.AsyncClient(timeout=120.0)
    
    async def create_chat_completion(self, request: ChatRequest) -> ChatResponse:
        raise NotImplementedError
    
    async def get_available_models(self) -> List[ModelInfo]:
        raise NotImplementedError
    
    async def close(self):
        await self.client.aclose()

class OpenRouterProvider(AIProvider):
    """Provider OpenRouter - 300+ modelos com 87% margem"""
    
    BASE_URL = "https://openrouter.ai/api/v1"
    
    async def create_chat_completion(self, request: ChatRequest) -> ChatResponse:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://agentesdeconversao.ai",
            "X-Title": "Agentes de Conversão"
        }
        
        payload = {
            "model": request.model,
            "messages": [msg.dict() for msg in request.messages],
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": request.stream
        }
        
        if request.tools:
            payload["tools"] = request.tools
        
        try:
            response = await self.client.post(
                f"{self.BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Calcular análise de custos
                cost_analysis = None
                if "usage" in data:
                    cost_analysis = self._calculate_cost_savings(data["usage"])
                
                return ChatResponse(
                    success=True,
                    data=data,
                    provider="openrouter",
                    model=request.model,
                    usage=data.get("usage"),
                    cost_analysis=cost_analysis
                )
            else:
                error_data = response.json() if response.content else {}
                return ChatResponse(
                    success=False,
                    error={
                        "message": error_data.get("error", {}).get("message", "OpenRouter error"),
                        "code": str(response.status_code),
                        "type": "openrouter_error"
                    },
                    provider="openrouter",
                    model=request.model
                )
                
        except Exception as e:
            return ChatResponse(
                success=False,
                error={
                    "message": str(e),
                    "code": "CONNECTION_ERROR",
                    "type": "network_error"
                },
                provider="openrouter",
                model=request.model
            )
    
    async def get_available_models(self) -> List[ModelInfo]:
        try:
            response = await self.client.get(
                f"{self.BASE_URL}/models",
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            
            if response.status_code == 200:
                models_data = response.json()
                models = []
                
                for model in models_data.get("data", []):
                    model_info = ModelInfo(
                        id=model["id"],
                        name=model.get("name", model["id"]),
                        description=model.get("description"),
                        pricing=model.get("pricing"),
                        context_length=model.get("context_length"),
                        supports_tools=self._supports_tools(model["id"]),
                        supports_vision=self._supports_vision(model["id"]),
                        category=self._categorize_model(model["id"])
                    )
                    models.append(model_info)
                
                return models
            
        except Exception as e:
            print(f"Error fetching models: {e}")
        
        return []
    
    def _calculate_cost_savings(self, usage: Dict[str, Any]) -> Dict[str, Any]:
        """Calcula economia vs OpenAI direto"""
        total_tokens = usage.get("total_tokens", 0)
        
        # Estimativa OpenAI (preço médio)
        openai_cost = total_tokens * 0.00003
        
        # OpenRouter (87% margem = 13% do custo original)
        openrouter_cost = openai_cost * 0.13
        
        savings = openai_cost - openrouter_cost
        
        return {
            "openai_estimated_cost": round(openai_cost, 6),
            "openrouter_cost": round(openrouter_cost, 6),
            "savings": round(savings, 6),
            "savings_percent": 87,
            "profit_margin": 87
        }
    
    def _supports_tools(self, model_id: str) -> bool:
        """Verifica se modelo suporta function calling"""
        tools_models = [
            "openai/gpt-4", "openai/gpt-4o", "openai/gpt-3.5-turbo",
            "anthropic/claude-3", "anthropic/claude-3.5",
            "google/gemini-pro", "mistralai/mixtral"
        ]
        
        return any(pattern in model_id for pattern in tools_models)
    
    def _supports_vision(self, model_id: str) -> bool:
        """Verifica se modelo suporta visão"""
        vision_models = [
            "gpt-4o", "gpt-4-vision", "claude-3", "gemini-pro-vision"
        ]
        
        return any(pattern in model_id for pattern in vision_models)
    
    def _categorize_model(self, model_id: str) -> str:
        """Categoriza modelo por tipo"""
        if any(pattern in model_id for pattern in ["mini", "haiku", "flash", "8b"]):
            return "fast"
        elif any(pattern in model_id for pattern in ["o1", "opus", "405b"]):
            return "premium"
        elif any(pattern in model_id for pattern in ["r1", "reasoning"]):
            return "reasoning"
        elif any(pattern in model_id for pattern in ["code", "codellama"]):
            return "coding"
        else:
            return "balanced"

class OpenAIProvider(AIProvider):
    """Provider OpenAI - Fallback"""
    
    BASE_URL = "https://api.openai.com/v1"
    
    async def create_chat_completion(self, request: ChatRequest) -> ChatResponse:
        if not self.api_key:
            return ChatResponse(
                success=False,
                error={
                    "message": "OpenAI API key not configured",
                    "code": "NO_API_KEY",
                    "type": "configuration_error"
                },
                provider="openai",
                model=request.model
            )
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Mapear modelo OpenRouter para OpenAI
        openai_model = self._map_model(request.model)
        
        payload = {
            "model": openai_model,
            "messages": [msg.dict() for msg in request.messages],
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": request.stream
        }
        
        try:
            response = await self.client.post(
                f"{self.BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                return ChatResponse(
                    success=True,
                    data=data,
                    provider="openai",
                    model=openai_model,
                    usage=data.get("usage")
                )
            else:
                error_data = response.json() if response.content else {}
                return ChatResponse(
                    success=False,
                    error={
                        "message": error_data.get("error", {}).get("message", "OpenAI error"),
                        "code": str(response.status_code),
                        "type": "openai_error"
                    },
                    provider="openai",
                    model=openai_model
                )
                
        except Exception as e:
            return ChatResponse(
                success=False,
                error={
                    "message": str(e),
                    "code": "CONNECTION_ERROR",
                    "type": "network_error"
                },
                provider="openai",
                model=openai_model
            )
    
    def _map_model(self, openrouter_model: str) -> str:
        """Mapeia modelo OpenRouter para OpenAI equivalente"""
        model_map = {
            "openai/gpt-4o": "gpt-4o",
            "openai/gpt-4o-mini": "gpt-4o-mini",
            "openai/gpt-4-turbo": "gpt-4-turbo",
            "openai/gpt-3.5-turbo": "gpt-3.5-turbo",
            "openai/o1-preview": "o1-preview",
            "openai/o1-mini": "o1-mini"
        }
        
        return model_map.get(openrouter_model, "gpt-4o-mini")
    
    async def get_available_models(self) -> List[ModelInfo]:
        # Retorna modelos OpenAI básicos
        return [
            ModelInfo(
                id="gpt-4o-mini",
                name="GPT-4O Mini",
                description="Fast and efficient model",
                category="fast"
            ),
            ModelInfo(
                id="gpt-4o",
                name="GPT-4O",
                description="Balanced performance",
                category="balanced"
            ),
            ModelInfo(
                id="o1-preview",
                name="O1 Preview",
                description="Advanced reasoning",
                category="premium"
            )
        ]

class SmartAIRouter:
    """Router inteligente com fallback automático"""
    
    def __init__(self):
        self.openrouter = OpenRouterProvider(OPENROUTER_API_KEY)
        self.openai = OpenAIProvider(OPENAI_API_KEY) if OPENAI_API_KEY else None
        self.models_cache = []
        self.cache_timestamp = 0
    
    async def create_chat_completion(self, request: ChatRequest) -> ChatResponse:
        """Cria chat completion com fallback inteligente"""
        
        # Tentar OpenRouter primeiro (87% margem)
        response = await self.openrouter.create_chat_completion(request)
        
        if response.success:
            return response
        
        # Fallback para OpenAI se necessário
        if self.openai and request.model.startswith("openai/"):
            print(f"OpenRouter failed, trying OpenAI fallback: {response.error}")
            return await self.openai.create_chat_completion(request)
        
        return response
    
    async def get_available_models(self, refresh: bool = False) -> List[ModelInfo]:
        """Retorna modelos disponíveis (com cache)"""
        
        # Cache por 1 hora
        if not refresh and self.models_cache and (time.time() - self.cache_timestamp) < 3600:
            return self.models_cache
        
        models = await self.openrouter.get_available_models()
        
        self.models_cache = models
        self.cache_timestamp = time.time()
        
        return models
    
    async def get_providers_status(self) -> Dict[str, Any]:
        """Verifica status dos providers"""
        
        status = {
            "openrouter": {
                "enabled": True,
                "healthy": False,
                "credits": None
            },
            "openai": {
                "enabled": bool(self.openai),
                "healthy": False
            }
        }
        
        # Testar OpenRouter
        try:
            test_response = await self.openrouter.client.get(
                f"{self.openrouter.BASE_URL}/auth/key",
                headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"}
            )
            
            if test_response.status_code == 200:
                status["openrouter"]["healthy"] = True
                credits_data = test_response.json()
                status["openrouter"]["credits"] = credits_data.get("data", {})
        except:
            pass
        
        # Testar OpenAI
        if self.openai:
            try:
                test_response = await self.openai.client.get(
                    f"{self.openai.BASE_URL}/models",
                    headers={"Authorization": f"Bearer {OPENAI_API_KEY}"}
                )
                
                if test_response.status_code == 200:
                    status["openai"]["healthy"] = True
            except:
                pass
        
        return status
    
    def get_recommended_models(self) -> Dict[str, List[str]]:
        """Retorna modelos recomendados por categoria"""
        return {
            "fast": [
                "openai/gpt-4o-mini",
                "anthropic/claude-3-haiku",
                "google/gemini-flash-1.5",
                "meta-llama/llama-3.1-8b-instruct"
            ],
            "balanced": [
                "openai/gpt-4o",
                "anthropic/claude-3.5-sonnet",
                "google/gemini-pro-1.5",
                "meta-llama/llama-3.1-70b-instruct"
            ],
            "premium": [
                "openai/o1-preview",
                "anthropic/claude-3-opus",
                "deepseek/deepseek-r1",
                "meta-llama/llama-3.1-405b-instruct"
            ],
            "reasoning": [
                "openai/o1-preview",
                "openai/o1-mini",
                "deepseek/deepseek-r1"
            ],
            "coding": [
                "anthropic/claude-3.5-sonnet",
                "openai/gpt-4o",
                "deepseek/deepseek-coder"
            ],
            "multimodal": [
                "openai/gpt-4o",
                "anthropic/claude-3.5-sonnet",
                "google/gemini-pro-vision"
            ]
        }
    
    async def close(self):
        """Fecha conexões"""
        await self.openrouter.close()
        if self.openai:
            await self.openai.close()

# Instância global do router
ai_router = SmartAIRouter()

# Endpoints
@router.post("/chat/completions", response_model=ChatResponse)
async def create_chat_completion(request: ChatRequest):
    """Endpoint principal para chat completions"""
    return await ai_router.create_chat_completion(request)

@router.get("/models", response_model=List[ModelInfo])
async def list_models(refresh: bool = False):
    """Lista modelos disponíveis"""
    return await ai_router.get_available_models(refresh=refresh)

@router.get("/status")
async def get_status():
    """Status dos providers"""
    return await ai_router.get_providers_status()

@router.get("/models/recommended")
async def get_recommended_models():
    """Modelos recomendados por categoria"""
    return ai_router.get_recommended_models()

# Adicionar ao app principal
def include_ai_router(app):
    """Incluir router AI no app principal"""
    app.include_router(router)

# Cleanup ao fechar aplicação
async def cleanup_ai():
    """Limpeza ao fechar aplicação"""
    await ai_router.close()