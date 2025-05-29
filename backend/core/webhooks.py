"""
Sistema principal de webhooks para integração Supabase <-> FastAPI <-> N8N
Processamento assíncrono, retry políticas e delivery tracking
"""

import asyncio
import json
import hmac
import hashlib
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, List, Union, Callable
from enum import Enum
from dataclasses import dataclass, asdict
from urllib.parse import urlparse
import uuid

import httpx
import redis.asyncio as redis
from pydantic import BaseModel, Field, HttpUrl
from supabase import create_client, Client
import os

# Configuração
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
N8N_BASE_URL = os.getenv("N8N_WEBHOOK_URL", "https://primary-em-atividade.up.railway.app")
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "your-webhook-secret-key")
API_BASE_URL = os.getenv("API_BASE_URL", "https://api.agentesdeconversao.com.br")

# Logger configurado
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# =========================================
# ENUMS E MODELOS
# =========================================

class WebhookEventStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"

class WebhookEventType(str, Enum):
    # User events
    USER_REGISTERED = "user.registered"
    USER_UPDATED = "user.updated"
    
    # Payment events
    PAYMENT_CONFIRMED = "payment.confirmed"
    PAYMENT_FAILED = "payment.failed"
    
    # Integration events
    WHATSAPP_CONNECTED = "integration.whatsapp.connected"
    OPENAI_CONNECTED = "integration.openai.connected"
    INTEGRATION_DISCONNECTED = "integration.disconnected"
    
    # Agent events
    AGENT_CREATED = "agent.created"
    AGENT_UPDATED = "agent.updated"
    AGENT_DELETED = "agent.deleted"
    
    # Template events
    TEMPLATE_APPLIED = "template.applied"
    
    # Conversation events
    CONVERSATION_CREATED = "conversation.created"
    CONVERSATION_ENDED = "conversation.ended"
    MESSAGE_ADDED = "conversation.message.added"
    
    # Onboarding events
    ONBOARDING_STEP_COMPLETED = "onboarding.step.completed"
    ONBOARDING_COMPLETED = "onboarding.completed"
    
    # System events
    SYSTEM_NOTIFICATION = "system.notification"
    ERROR_OCCURRED = "system.error"

class WebhookDeliveryStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"
    TIMEOUT = "timeout"
    RETRYING = "retrying"

@dataclass
class WebhookRetryPolicy:
    max_retries: int = 5
    backoff_factor: float = 2.0
    base_delay: int = 30  # seconds
    max_delay: int = 3600  # 1 hour
    timeout: int = 30  # seconds per request
    
    def get_delay(self, attempt: int) -> int:
        """Calcula delay exponencial com jitter"""
        delay = min(self.base_delay * (self.backoff_factor ** attempt), self.max_delay)
        # Adiciona jitter para evitar thundering herd
        import random
        jitter = random.uniform(0.8, 1.2)
        return int(delay * jitter)

class WebhookPayload(BaseModel):
    event_type: WebhookEventType
    event_id: str
    timestamp: datetime
    source: str = "api"
    data: Dict[str, Any]
    user_id: Optional[str] = None
    organization_id: Optional[str] = None
    retry_count: int = 0
    signature: Optional[str] = None

class WebhookEndpoint(BaseModel):
    id: str
    url: HttpUrl
    events: List[WebhookEventType]
    secret: Optional[str] = None
    is_active: bool = True
    headers: Dict[str, str] = Field(default_factory=dict)
    retry_policy: WebhookRetryPolicy = Field(default_factory=WebhookRetryPolicy)

class WebhookDelivery(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    webhook_event_id: str
    webhook_endpoint_id: str
    status: WebhookDeliveryStatus
    status_code: Optional[int] = None
    response_body: Optional[str] = None
    response_headers: Optional[Dict[str, str]] = None
    error_message: Optional[str] = None
    delivery_duration_ms: Optional[int] = None
    attempt_number: int = 1
    delivered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# =========================================
# SISTEMA DE ASSINATURA
# =========================================

class WebhookSigner:
    """Gerencia assinatura de webhooks para segurança"""
    
    def __init__(self, secret: str):
        self.secret = secret.encode() if isinstance(secret, str) else secret
    
    def sign_payload(self, payload: str, timestamp: str) -> str:
        """Cria assinatura HMAC-SHA256"""
        message = f"{timestamp}.{payload}".encode()
        signature = hmac.new(self.secret, message, hashlib.sha256).hexdigest()
        return f"sha256={signature}"
    
    def verify_signature(self, payload: str, timestamp: str, signature: str) -> bool:
        """Verifica assinatura do webhook"""
        try:
            expected_signature = self.sign_payload(payload, timestamp)
            return hmac.compare_digest(expected_signature, signature)
        except Exception as e:
            logger.error(f"Erro na verificação de assinatura: {e}")
            return False

# =========================================
# N8N CLIENT
# =========================================

class N8NClient:
    """Cliente para integração com N8N workflows"""
    
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.client = httpx.AsyncClient(timeout=30.0)
        
        # Mapeamento de eventos para workflows N8N
        self.event_workflow_mapping = {
            WebhookEventType.USER_REGISTERED: "user-registration",
            WebhookEventType.PAYMENT_CONFIRMED: "payment-processed",
            WebhookEventType.WHATSAPP_CONNECTED: "whatsapp-connected",
            WebhookEventType.OPENAI_CONNECTED: "openai-connected",
            WebhookEventType.AGENT_CREATED: "agent-created",
            WebhookEventType.TEMPLATE_APPLIED: "template-applied",
            WebhookEventType.ONBOARDING_COMPLETED: "onboarding-complete"
        }
    
    async def send_webhook(self, event_type: WebhookEventType, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Envia webhook para N8N workflow correspondente"""
        workflow_path = self.event_workflow_mapping.get(event_type)
        
        if not workflow_path:
            logger.warning(f"Nenhuma workflow N8N configurada para evento: {event_type}")
            return {"status": "skipped", "reason": "no_workflow_configured"}
        
        webhook_url = f"{self.base_url}/webhook/{workflow_path}"
        
        try:
            # Preparar dados para N8N
            n8n_payload = {
                "event": event_type.value,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": payload
            }
            
            logger.info(f"Enviando webhook para N8N: {webhook_url}")
            
            response = await self.client.post(
                webhook_url,
                json=n8n_payload,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "AgentesDeConversao-Webhook/1.0"
                }
            )
            
            result = {
                "status": "success" if response.status_code < 400 else "failed",
                "status_code": response.status_code,
                "response": response.text[:1000] if response.text else "",
                "url": webhook_url
            }
            
            if response.status_code >= 400:
                logger.error(f"N8N webhook falhou: {response.status_code} - {response.text}")
            else:
                logger.info(f"N8N webhook enviado com sucesso para {workflow_path}")
            
            return result
            
        except Exception as e:
            logger.error(f"Erro ao enviar webhook para N8N: {e}")
            return {
                "status": "failed",
                "error": str(e),
                "url": webhook_url
            }
    
    async def close(self):
        """Fecha o cliente HTTP"""
        await self.client.aclose()

# =========================================
# WEBHOOK MANAGER PRINCIPAL
# =========================================

class WebhookManager:
    """Gerenciador principal do sistema de webhooks"""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.supabase_client: Optional[Client] = None
        self.n8n_client: Optional[N8NClient] = None
        self.signer = WebhookSigner(WEBHOOK_SECRET)
        self.http_client = httpx.AsyncClient(timeout=30.0)
        self.processing_tasks: Dict[str, asyncio.Task] = {}
        
    async def initialize(self):
        """Inicializa o gerenciador"""
        try:
            # Conectar ao Redis
            if REDIS_URL:
                self.redis_client = redis.from_url(REDIS_URL)
                await self.redis_client.ping()
                logger.info("Redis conectado com sucesso")
            
            # Conectar ao Supabase
            if SUPABASE_URL and SUPABASE_SERVICE_KEY:
                self.supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
                logger.info("Supabase conectado com sucesso")
            
            # Inicializar cliente N8N
            self.n8n_client = N8NClient(N8N_BASE_URL)
            logger.info("N8N client inicializado")
            
            logger.info("WebhookManager inicializado com sucesso")
            
        except Exception as e:
            logger.error(f"Erro ao inicializar WebhookManager: {e}")
            raise
    
    async def create_event(
        self,
        event_type: WebhookEventType,
        data: Dict[str, Any],
        user_id: Optional[str] = None,
        organization_id: Optional[str] = None,
        source: str = "api"
    ) -> str:
        """Cria um novo evento de webhook"""
        try:
            event_id = str(uuid.uuid4())
            
            # Criar payload do webhook
            payload = WebhookPayload(
                event_type=event_type,
                event_id=event_id,
                timestamp=datetime.now(timezone.utc),
                source=source,
                data=data,
                user_id=user_id,
                organization_id=organization_id
            )
            
            # Salvar evento no Supabase
            if self.supabase_client:
                event_record = {
                    "id": event_id,
                    "event_type": event_type.value,
                    "event_source": source,
                    "user_id": user_id,
                    "organization_id": organization_id,
                    "data": data,
                    "status": WebhookEventStatus.PENDING.value,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                
                result = self.supabase_client.table("webhook_events").insert(event_record).execute()
                logger.info(f"Evento criado no Supabase: {event_id}")
            
            # Adicionar à fila de processamento
            if self.redis_client:
                await self.redis_client.lpush(
                    "webhook_queue:high" if self._is_high_priority(event_type) else "webhook_queue:normal",
                    payload.model_dump_json()
                )
                logger.info(f"Evento adicionado à fila: {event_id}")
            
            # Processar imediatamente se Redis não estiver disponível
            else:
                await self._process_webhook_event(payload)
            
            return event_id
            
        except Exception as e:
            logger.error(f"Erro ao criar evento de webhook: {e}")
            raise
    
    def _is_high_priority(self, event_type: WebhookEventType) -> bool:
        """Determina se um evento é de alta prioridade"""
        high_priority_events = {
            WebhookEventType.PAYMENT_CONFIRMED,
            WebhookEventType.USER_REGISTERED,
            WebhookEventType.AGENT_CREATED,
            WebhookEventType.ONBOARDING_COMPLETED
        }
        return event_type in high_priority_events
    
    async def _process_webhook_event(self, payload: WebhookPayload):
        """Processa um evento de webhook"""
        try:
            logger.info(f"Processando evento: {payload.event_type} ({payload.event_id})")
            
            # Atualizar status para processando
            await self._update_event_status(payload.event_id, WebhookEventStatus.PROCESSING)
            
            # Enviar para N8N se aplicável
            n8n_result = None
            if self.n8n_client:
                n8n_result = await self.n8n_client.send_webhook(payload.event_type, payload.data)
            
            # Buscar endpoints configurados
            endpoints = await self._get_active_endpoints_for_event(payload.event_type)
            
            # Enviar para cada endpoint
            delivery_results = []
            for endpoint in endpoints:
                delivery = await self._deliver_webhook(payload, endpoint)
                delivery_results.append(delivery)
            
            # Processar lógica específica do evento
            await self._handle_event_logic(payload)
            
            # Atualizar status final
            all_successful = all(
                delivery.status == WebhookDeliveryStatus.SUCCESS 
                for delivery in delivery_results
            )
            
            final_status = WebhookEventStatus.COMPLETED if all_successful else WebhookEventStatus.FAILED
            await self._update_event_status(payload.event_id, final_status)
            
            # Salvar resultados
            event_result = {
                "n8n_result": n8n_result,
                "deliveries": len(delivery_results),
                "successful_deliveries": sum(1 for d in delivery_results if d.status == WebhookDeliveryStatus.SUCCESS),
                "processed_at": datetime.now(timezone.utc).isoformat()
            }
            
            await self._save_event_result(payload.event_id, event_result)
            
            logger.info(f"Evento processado com sucesso: {payload.event_id}")
            
        except Exception as e:
            logger.error(f"Erro ao processar evento {payload.event_id}: {e}")
            await self._update_event_status(payload.event_id, WebhookEventStatus.FAILED, str(e))
            
            # Verificar se deve tentar novamente
            if payload.retry_count < 3:
                await self._schedule_retry(payload)
    
    async def _deliver_webhook(self, payload: WebhookPayload, endpoint: WebhookEndpoint) -> WebhookDelivery:
        """Entrega webhook para um endpoint específico"""
        delivery_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        
        try:
            # Preparar dados do webhook
            webhook_data = {
                "event": payload.event_type.value,
                "event_id": payload.event_id,
                "timestamp": payload.timestamp.isoformat(),
                "data": payload.data
            }
            
            # Adicionar user_id e organization_id se disponíveis
            if payload.user_id:
                webhook_data["user_id"] = payload.user_id
            if payload.organization_id:
                webhook_data["organization_id"] = payload.organization_id
            
            # Preparar headers
            headers = {
                "Content-Type": "application/json",
                "User-Agent": "AgentesDeConversao-Webhook/1.0",
                **endpoint.headers
            }
            
            # Adicionar assinatura se secret estiver configurado
            webhook_body = json.dumps(webhook_data, sort_keys=True)
            timestamp_str = str(int(payload.timestamp.timestamp()))
            
            if endpoint.secret:
                signer = WebhookSigner(endpoint.secret)
                signature = signer.sign_payload(webhook_body, timestamp_str)
                headers["X-Webhook-Signature"] = signature
                headers["X-Webhook-Timestamp"] = timestamp_str
            
            # Enviar webhook
            response = await self.http_client.post(
                str(endpoint.url),
                content=webhook_body,
                headers=headers,
                timeout=endpoint.retry_policy.timeout
            )
            
            end_time = datetime.now(timezone.utc)
            duration_ms = int((end_time - start_time).total_seconds() * 1000)
            
            # Criar registro de delivery
            delivery = WebhookDelivery(
                id=delivery_id,
                webhook_event_id=payload.event_id,
                webhook_endpoint_id=endpoint.id,
                status=WebhookDeliveryStatus.SUCCESS if response.status_code < 400 else WebhookDeliveryStatus.FAILED,
                status_code=response.status_code,
                response_body=response.text[:1000] if response.text else None,
                response_headers=dict(response.headers),
                delivery_duration_ms=duration_ms,
                delivered_at=end_time
            )
            
            # Salvar delivery no Supabase
            await self._save_delivery_record(delivery)
            
            logger.info(f"Webhook entregue para {endpoint.url}: {response.status_code}")
            return delivery
            
        except httpx.TimeoutException:
            end_time = datetime.now(timezone.utc)
            duration_ms = int((end_time - start_time).total_seconds() * 1000)
            
            delivery = WebhookDelivery(
                id=delivery_id,
                webhook_event_id=payload.event_id,
                webhook_endpoint_id=endpoint.id,
                status=WebhookDeliveryStatus.TIMEOUT,
                error_message="Request timeout",
                delivery_duration_ms=duration_ms,
                delivered_at=end_time
            )
            
            await self._save_delivery_record(delivery)
            logger.warning(f"Timeout ao entregar webhook para {endpoint.url}")
            return delivery
            
        except Exception as e:
            end_time = datetime.now(timezone.utc)
            duration_ms = int((end_time - start_time).total_seconds() * 1000)
            
            delivery = WebhookDelivery(
                id=delivery_id,
                webhook_event_id=payload.event_id,
                webhook_endpoint_id=endpoint.id,
                status=WebhookDeliveryStatus.FAILED,
                error_message=str(e),
                delivery_duration_ms=duration_ms,
                delivered_at=end_time
            )
            
            await self._save_delivery_record(delivery)
            logger.error(f"Erro ao entregar webhook para {endpoint.url}: {e}")
            return delivery
    
    async def _handle_event_logic(self, payload: WebhookPayload):
        """Processa lógica específica para cada tipo de evento"""
        event_type = payload.event_type
        data = payload.data
        user_id = payload.user_id
        
        try:
            if event_type == WebhookEventType.USER_REGISTERED:
                await self._handle_user_registered(user_id, data)
                
            elif event_type == WebhookEventType.PAYMENT_CONFIRMED:
                await self._handle_payment_confirmed(user_id, data)
                
            elif event_type == WebhookEventType.WHATSAPP_CONNECTED:
                await self._handle_whatsapp_connected(user_id, data)
                
            elif event_type == WebhookEventType.OPENAI_CONNECTED:
                await self._handle_openai_connected(user_id, data)
                
            elif event_type == WebhookEventType.AGENT_CREATED:
                await self._handle_agent_created(user_id, data)
                
            elif event_type == WebhookEventType.TEMPLATE_APPLIED:
                await self._handle_template_applied(user_id, data)
                
            elif event_type == WebhookEventType.ONBOARDING_COMPLETED:
                await self._handle_onboarding_completed(user_id, data)
                
        except Exception as e:
            logger.error(f"Erro na lógica específica do evento {event_type}: {e}")
    
    async def _handle_user_registered(self, user_id: str, data: Dict[str, Any]):
        """Processa registro de novo usuário"""
        if self.supabase_client and user_id:
            # Criar notificação de boas-vindas
            await self._create_system_notification(
                user_id,
                "success",
                "🎉 Bem-vindo!",
                "Sua conta foi criada com sucesso. Vamos começar o processo de configuração do seu agente."
            )
    
    async def _handle_payment_confirmed(self, user_id: str, data: Dict[str, Any]):
        """Processa confirmação de pagamento"""
        if self.supabase_client and user_id:
            # Atualizar status de onboarding
            self.supabase_client.rpc("update_onboarding_step", {
                "p_user_id": user_id,
                "p_step": 2,
                "p_metadata": {"payment_confirmed_at": datetime.now(timezone.utc).isoformat()}
            }).execute()
    
    async def _handle_whatsapp_connected(self, user_id: str, data: Dict[str, Any]):
        """Processa conexão do WhatsApp"""
        if self.supabase_client and user_id:
            await self._create_system_notification(
                user_id,
                "success",
                "📱 WhatsApp Conectado",
                "WhatsApp foi conectado com sucesso! Seu agente agora pode responder mensagens automaticamente."
            )
    
    async def _handle_openai_connected(self, user_id: str, data: Dict[str, Any]):
        """Processa conexão da OpenAI"""
        if self.supabase_client and user_id:
            await self._create_system_notification(
                user_id,
                "success",
                "🤖 IA Configurada",
                "OpenAI foi configurada com sucesso! Seu agente está pronto para ter conversas inteligentes."
            )
    
    async def _handle_agent_created(self, user_id: str, data: Dict[str, Any]):
        """Processa criação de agente"""
        if self.supabase_client and user_id:
            await self._create_system_notification(
                user_id,
                "success",
                "🎯 Agente Criado",
                f"Seu agente '{data.get('name', 'Agente')}' foi criado com sucesso!"
            )
    
    async def _handle_template_applied(self, user_id: str, data: Dict[str, Any]):
        """Processa aplicação de template"""
        if self.supabase_client and user_id:
            template_name = data.get("template_name", "Template")
            await self._create_system_notification(
                user_id,
                "info",
                "📋 Template Aplicado",
                f"Template '{template_name}' foi aplicado ao seu agente."
            )
    
    async def _handle_onboarding_completed(self, user_id: str, data: Dict[str, Any]):
        """Processa conclusão do onboarding"""
        if self.supabase_client and user_id:
            await self._create_system_notification(
                user_id,
                "success",
                "🚀 Parabéns!",
                "Você completou o onboarding! Seu agente está pronto para uso. Acesse o dashboard para começar."
            )
    
    async def _create_system_notification(
        self,
        user_id: str,
        type: str,
        title: str,
        message: str,
        action_url: Optional[str] = None
    ):
        """Cria notificação do sistema"""
        if self.supabase_client:
            try:
                notification_data = {
                    "user_id": user_id,
                    "type": type,
                    "title": title,
                    "message": message,
                    "action_url": action_url,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                
                self.supabase_client.table("system_notifications").insert(notification_data).execute()
                logger.info(f"Notificação criada para usuário {user_id}: {title}")
                
            except Exception as e:
                logger.error(f"Erro ao criar notificação: {e}")
    
    async def _update_event_status(
        self,
        event_id: str,
        status: WebhookEventStatus,
        error_message: Optional[str] = None
    ):
        """Atualiza status de um evento"""
        if self.supabase_client:
            try:
                update_data = {
                    "status": status.value,
                    "processed_at": datetime.now(timezone.utc).isoformat()
                }
                
                if error_message:
                    update_data["error_message"] = error_message
                
                self.supabase_client.table("webhook_events").update(update_data).eq("id", event_id).execute()
                
            except Exception as e:
                logger.error(f"Erro ao atualizar status do evento {event_id}: {e}")
    
    async def _save_event_result(self, event_id: str, result: Dict[str, Any]):
        """Salva resultado do processamento de evento"""
        if self.redis_client:
            try:
                await self.redis_client.setex(
                    f"webhook_result:{event_id}",
                    86400,  # 24 hours
                    json.dumps(result, default=str)
                )
            except Exception as e:
                logger.error(f"Erro ao salvar resultado do evento {event_id}: {e}")
    
    async def _save_delivery_record(self, delivery: WebhookDelivery):
        """Salva registro de delivery no Supabase"""
        if self.supabase_client:
            try:
                delivery_data = {
                    "id": delivery.id,
                    "webhook_event_id": delivery.webhook_event_id,
                    "webhook_endpoint_id": delivery.webhook_endpoint_id,
                    "status_code": delivery.status_code,
                    "response_body": delivery.response_body,
                    "response_headers": delivery.response_headers,
                    "delivery_duration_ms": delivery.delivery_duration_ms,
                    "attempt_number": delivery.attempt_number,
                    "delivered_at": delivery.delivered_at.isoformat(),
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                
                self.supabase_client.table("webhook_deliveries").insert(delivery_data).execute()
                
            except Exception as e:
                logger.error(f"Erro ao salvar registro de delivery: {e}")
    
    async def _get_active_endpoints_for_event(self, event_type: WebhookEventType) -> List[WebhookEndpoint]:
        """Busca endpoints ativos que escutam este evento"""
        if not self.supabase_client:
            return []
        
        try:
            result = self.supabase_client.table("webhook_endpoints").select("*").eq("is_active", True).execute()
            
            endpoints = []
            for row in result.data:
                if event_type.value in row.get("events", []):
                    endpoint = WebhookEndpoint(
                        id=row["id"],
                        url=row["url"],
                        events=[WebhookEventType(e) for e in row["events"]],
                        secret=row.get("secret"),
                        is_active=row["is_active"],
                        headers=row.get("headers", {})
                    )
                    endpoints.append(endpoint)
            
            return endpoints
            
        except Exception as e:
            logger.error(f"Erro ao buscar endpoints para evento {event_type}: {e}")
            return []
    
    async def _schedule_retry(self, payload: WebhookPayload):
        """Agenda retry de um evento"""
        if not self.redis_client:
            return
        
        try:
            payload.retry_count += 1
            retry_policy = WebhookRetryPolicy()
            delay = retry_policy.get_delay(payload.retry_count - 1)
            
            # Adicionar à fila de retry com delay
            retry_time = datetime.now(timezone.utc) + timedelta(seconds=delay)
            await self.redis_client.zadd(
                "webhook_retry_queue",
                {payload.model_dump_json(): retry_time.timestamp()}
            )
            
            logger.info(f"Evento {payload.event_id} agendado para retry em {delay}s")
            
        except Exception as e:
            logger.error(f"Erro ao agendar retry: {e}")
    
    async def start_worker(self):
        """Inicia worker para processar webhooks"""
        logger.info("Iniciando webhook worker...")
        
        while True:
            try:
                # Processar fila de retry primeiro
                await self._process_retry_queue()
                
                # Processar filas normais (alta prioridade primeiro)
                for queue in ["webhook_queue:high", "webhook_queue:normal"]:
                    if self.redis_client:
                        payload_json = await self.redis_client.rpop(queue)
                        if payload_json:
                            payload = WebhookPayload.model_validate_json(payload_json.decode())
                            
                            # Processar em background
                            task = asyncio.create_task(self._process_webhook_event(payload))
                            self.processing_tasks[payload.event_id] = task
                            
                            # Limpar tasks concluídas
                            await self._cleanup_completed_tasks()
                
                # Aguardar um pouco antes do próximo ciclo
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"Erro no webhook worker: {e}")
                await asyncio.sleep(5)
    
    async def _process_retry_queue(self):
        """Processa fila de retry"""
        if not self.redis_client:
            return
        
        try:
            now = datetime.now(timezone.utc).timestamp()
            
            # Buscar eventos prontos para retry
            ready_events = await self.redis_client.zrangebyscore(
                "webhook_retry_queue",
                min=0,
                max=now,
                withscores=False
            )
            
            for event_json in ready_events:
                # Remover da fila de retry
                await self.redis_client.zrem("webhook_retry_queue", event_json)
                
                # Adicionar de volta à fila normal
                payload = WebhookPayload.model_validate_json(event_json.decode())
                queue = "webhook_queue:high" if self._is_high_priority(payload.event_type) else "webhook_queue:normal"
                await self.redis_client.lpush(queue, event_json)
                
        except Exception as e:
            logger.error(f"Erro ao processar fila de retry: {e}")
    
    async def _cleanup_completed_tasks(self):
        """Limpa tasks concluídas da memória"""
        completed_tasks = []
        for event_id, task in self.processing_tasks.items():
            if task.done():
                completed_tasks.append(event_id)
        
        for event_id in completed_tasks:
            del self.processing_tasks[event_id]
    
    async def get_event_status(self, event_id: str) -> Optional[Dict[str, Any]]:
        """Obtém status de um evento"""
        if not self.supabase_client:
            return None
        
        try:
            result = self.supabase_client.table("webhook_events").select("*").eq("id", event_id).execute()
            
            if result.data:
                event_data = result.data[0]
                
                # Buscar resultado do Redis se disponível
                redis_result = None
                if self.redis_client:
                    result_json = await self.redis_client.get(f"webhook_result:{event_id}")
                    if result_json:
                        redis_result = json.loads(result_json)
                
                return {
                    **event_data,
                    "processing_result": redis_result
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Erro ao buscar status do evento {event_id}: {e}")
            return None
    
    async def close(self):
        """Fecha conexões e limpa recursos"""
        # Cancelar todas as tasks em processamento
        for task in self.processing_tasks.values():
            if not task.done():
                task.cancel()
        
        # Fechar clientes
        if self.redis_client:
            await self.redis_client.close()
        
        if self.n8n_client:
            await self.n8n_client.close()
        
        await self.http_client.aclose()
        
        logger.info("WebhookManager fechado")

# =========================================
# INSTÂNCIA GLOBAL
# =========================================

webhook_manager = WebhookManager()

# =========================================
# CONVENIENCE FUNCTIONS
# =========================================

async def trigger_webhook(
    event_type: WebhookEventType,
    data: Dict[str, Any],
    user_id: Optional[str] = None,
    organization_id: Optional[str] = None
) -> str:
    """Função conveniente para disparar webhook"""
    return await webhook_manager.create_event(
        event_type=event_type,
        data=data,
        user_id=user_id,
        organization_id=organization_id
    )

async def trigger_user_registered(user_id: str, user_data: Dict[str, Any]) -> str:
    """Dispara webhook de usuário registrado"""
    return await trigger_webhook(
        WebhookEventType.USER_REGISTERED,
        user_data,
        user_id=user_id
    )

async def trigger_payment_confirmed(user_id: str, payment_data: Dict[str, Any]) -> str:
    """Dispara webhook de pagamento confirmado"""
    return await trigger_webhook(
        WebhookEventType.PAYMENT_CONFIRMED,
        payment_data,
        user_id=user_id
    )

async def trigger_agent_created(user_id: str, agent_data: Dict[str, Any]) -> str:
    """Dispara webhook de agente criado"""
    return await trigger_webhook(
        WebhookEventType.AGENT_CREATED,
        agent_data,
        user_id=user_id
    )

async def trigger_onboarding_completed(user_id: str) -> str:
    """Dispara webhook de onboarding completo"""
    return await trigger_webhook(
        WebhookEventType.ONBOARDING_COMPLETED,
        {"completed_at": datetime.now(timezone.utc).isoformat()},
        user_id=user_id
    )