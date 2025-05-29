from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional, List
from datetime import datetime
import hmac
import hashlib
import json
import logging

from ..core.webhooks import (
    webhook_manager, 
    WebhookEventType, 
    trigger_webhook,
    trigger_user_registered,
    trigger_payment_confirmed,
    trigger_agent_created,
    trigger_onboarding_completed
)
from ..core.background_tasks import (
    task_manager,
    submit_webhook_delivery,
    submit_n8n_sync
)

router = APIRouter()
logger = logging.getLogger(__name__)

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    """Verifica a assinatura do webhook"""
    expected_signature = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected_signature, signature)

async def process_webhook_event(
    event_type: str,
    data: Dict[str, Any],
    user_id: Optional[str] = None
):
    """Processa o evento do webhook usando o novo sistema"""
    try:
        # Mapear evento para enum
        webhook_event_type = None
        
        if event_type == "user.registered":
            webhook_event_type = WebhookEventType.USER_REGISTERED
        elif event_type == "payment.confirmed":
            webhook_event_type = WebhookEventType.PAYMENT_CONFIRMED
        elif event_type == "agent.created":
            webhook_event_type = WebhookEventType.AGENT_CREATED
        elif event_type == "conversation.created":
            webhook_event_type = WebhookEventType.CONVERSATION_CREATED
        elif event_type == "conversation.message.added":
            webhook_event_type = WebhookEventType.MESSAGE_ADDED
        elif event_type == "integration.whatsapp.connected":
            webhook_event_type = WebhookEventType.WHATSAPP_CONNECTED
        elif event_type == "integration.openai.connected":
            webhook_event_type = WebhookEventType.OPENAI_CONNECTED
        elif event_type == "template.applied":
            webhook_event_type = WebhookEventType.TEMPLATE_APPLIED
        elif event_type == "onboarding.completed":
            webhook_event_type = WebhookEventType.ONBOARDING_COMPLETED
        
        if webhook_event_type:
            await trigger_webhook(
                event_type=webhook_event_type,
                data=data,
                user_id=user_id
            )
            logger.info(f"Webhook processado: {event_type}")
        else:
            logger.warning(f"Tipo de evento não reconhecido: {event_type}")
        
    except Exception as e:
        logger.error(f"Erro ao processar webhook: {str(e)}")
        raise

@router.post("/incoming/{endpoint_id}")
async def receive_webhook(
    endpoint_id: str,
    request: Request,
    background_tasks: BackgroundTasks
):
    """Recebe webhooks externos"""
    try:
        # Obtém o payload
        payload = await request.body()
        
        # Parse do payload
        try:
            data = json.loads(payload)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payload inválido"
            )
        
        # Extrair informações do evento
        event_type = data.get("event", "unknown")
        user_id = data.get("user_id")
        
        # Processa em background usando o novo sistema
        background_tasks.add_task(
            process_webhook_event,
            event_type,
            data,
            user_id
        )
        
        logger.info(f"Webhook recebido: {event_type} para endpoint {endpoint_id}")
        return {"status": "received", "event_type": event_type}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao receber webhook: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar webhook"
        )

@router.get("/endpoints", response_model=list[WebhookEndpointResponse])
async def list_webhook_endpoints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todos os endpoints de webhook do usuário"""
    try:
        endpoints = db.query(WebhookEndpoint).filter(
            WebhookEndpoint.user_id == current_user.id
        ).all()
        return endpoints
    except Exception as e:
        print(f"Erro ao listar endpoints: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/endpoints", response_model=WebhookEndpointResponse)
async def create_webhook_endpoint(
    endpoint: WebhookEndpointCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria um novo endpoint de webhook"""
    try:
        db_endpoint = WebhookEndpoint(
            user_id=current_user.id,
            name=endpoint.name,
            url=endpoint.url,
            events=endpoint.events,
            secret=endpoint.secret,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(db_endpoint)
        db.commit()
        db.refresh(db_endpoint)
        return db_endpoint
    except Exception as e:
        print(f"Erro ao criar endpoint: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar endpoint"
        )

@router.delete("/endpoints/{endpoint_id}")
async def delete_webhook_endpoint(
    endpoint_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove um endpoint de webhook"""
    try:
        endpoint = db.query(WebhookEndpoint).filter(
            WebhookEndpoint.id == endpoint_id,
            WebhookEndpoint.user_id == current_user.id
        ).first()
        
        if not endpoint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Endpoint não encontrado"
            )
        
        db.delete(endpoint)
        db.commit()
        
        return {"message": "Endpoint removido com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao deletar endpoint: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar endpoint"
        )

# =========================================
# NOVOS ENDPOINTS PARA SISTEMA INTEGRADO
# =========================================

@router.post("/trigger")
async def trigger_webhook_event(
    event_type: str,
    data: Dict[str, Any],
    user_id: Optional[str] = None,
    organization_id: Optional[str] = None
):
    """Dispara um evento de webhook manualmente"""
    try:
        event_id = await trigger_webhook(
            event_type=WebhookEventType(event_type),
            data=data,
            user_id=user_id,
            organization_id=organization_id
        )
        
        return {
            "status": "triggered",
            "event_id": event_id,
            "event_type": event_type
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de evento inválido: {event_type}"
        )
    except Exception as e:
        logger.error(f"Erro ao disparar webhook: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao disparar webhook"
        )

@router.get("/events/{event_id}/status")
async def get_webhook_event_status(event_id: str):
    """Obtém status de um evento de webhook"""
    try:
        status_info = await webhook_manager.get_event_status(event_id)
        
        if not status_info:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Evento não encontrado"
            )
        
        return status_info
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar status do evento: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar status do evento"
        )

@router.post("/n8n/sync")
async def sync_with_n8n(
    sync_type: str,
    data: Dict[str, Any],
    organization_id: Optional[str] = None
):
    """Sincroniza dados com N8N via background task"""
    try:
        task_id = await submit_n8n_sync(
            sync_type=sync_type,
            data=data,
            organization_id=organization_id or "default"
        )
        
        return {
            "status": "sync_scheduled",
            "task_id": task_id,
            "sync_type": sync_type
        }
        
    except Exception as e:
        logger.error(f"Erro ao sincronizar com N8N: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao sincronizar com N8N"
        )

# =========================================
# ENDPOINTS ESPECÍFICOS POR EVENTO
# =========================================

@router.post("/events/user-registered")
async def webhook_user_registered(
    user_id: str,
    email: str,
    name: Optional[str] = None,
    metadata: Dict[str, Any] = None
):
    """Webhook específico para registro de usuário"""
    try:
        event_id = await trigger_user_registered(
            user_id=user_id,
            user_data={
                "email": email,
                "name": name,
                "metadata": metadata or {},
                "registered_at": datetime.now().isoformat()
            }
        )
        
        return {
            "status": "user_registration_processed",
            "event_id": event_id,
            "user_id": user_id
        }
        
    except Exception as e:
        logger.error(f"Erro no webhook de registro de usuário: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar registro de usuário"
        )

@router.post("/events/payment-confirmed")
async def webhook_payment_confirmed(
    user_id: str,
    payment_id: str,
    amount: float,
    currency: str = "BRL",
    metadata: Dict[str, Any] = None
):
    """Webhook específico para confirmação de pagamento"""
    try:
        event_id = await trigger_payment_confirmed(
            user_id=user_id,
            payment_data={
                "payment_id": payment_id,
                "amount": amount,
                "currency": currency,
                "metadata": metadata or {},
                "confirmed_at": datetime.now().isoformat()
            }
        )
        
        return {
            "status": "payment_confirmation_processed",
            "event_id": event_id,
            "payment_id": payment_id
        }
        
    except Exception as e:
        logger.error(f"Erro no webhook de confirmação de pagamento: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar confirmação de pagamento"
        )

@router.post("/events/agent-created")
async def webhook_agent_created(
    user_id: str,
    agent_id: str,
    agent_name: str,
    agent_type: Optional[str] = None,
    metadata: Dict[str, Any] = None
):
    """Webhook específico para criação de agente"""
    try:
        event_id = await trigger_agent_created(
            user_id=user_id,
            agent_data={
                "agent_id": agent_id,
                "name": agent_name,
                "type": agent_type,
                "metadata": metadata or {},
                "created_at": datetime.now().isoformat()
            }
        )
        
        return {
            "status": "agent_creation_processed",
            "event_id": event_id,
            "agent_id": agent_id
        }
        
    except Exception as e:
        logger.error(f"Erro no webhook de criação de agente: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar criação de agente"
        )

@router.post("/events/onboarding-completed")
async def webhook_onboarding_completed(
    user_id: str,
    completion_data: Dict[str, Any] = None
):
    """Webhook específico para conclusão do onboarding"""
    try:
        event_id = await trigger_onboarding_completed(user_id=user_id)
        
        return {
            "status": "onboarding_completion_processed",
            "event_id": event_id,
            "user_id": user_id
        }
        
    except Exception as e:
        logger.error(f"Erro no webhook de conclusão do onboarding: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar conclusão do onboarding"
        )

@router.post("/events/integration-connected")
async def webhook_integration_connected(
    user_id: str,
    integration_type: str,  # whatsapp, openai, etc.
    provider: str,
    configuration: Dict[str, Any] = None
):
    """Webhook específico para conexão de integrações"""
    try:
        # Mapear tipo de integração para evento específico
        if integration_type == "whatsapp":
            webhook_event_type = WebhookEventType.WHATSAPP_CONNECTED
        elif integration_type == "openai":
            webhook_event_type = WebhookEventType.OPENAI_CONNECTED
        else:
            webhook_event_type = WebhookEventType.USER_UPDATED  # Fallback genérico
        
        event_id = await trigger_webhook(
            event_type=webhook_event_type,
            data={
                "integration_type": integration_type,
                "provider": provider,
                "configuration": configuration or {},
                "connected_at": datetime.now().isoformat()
            },
            user_id=user_id
        )
        
        return {
            "status": "integration_connection_processed",
            "event_id": event_id,
            "integration_type": integration_type
        }
        
    except Exception as e:
        logger.error(f"Erro no webhook de conexão de integração: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar conexão de integração"
        )

# =========================================
# ENDPOINTS DE MONITORAMENTO
# =========================================

@router.get("/stats")
async def get_webhook_stats():
    """Obtém estatísticas do sistema de webhooks"""
    try:
        # Buscar estatísticas do Redis se disponível
        if webhook_manager.redis_client:
            high_queue_size = await webhook_manager.redis_client.llen("webhook_queue:high")
            normal_queue_size = await webhook_manager.redis_client.llen("webhook_queue:normal")
            retry_queue_size = await webhook_manager.redis_client.zcard("webhook_retry_queue")
        else:
            high_queue_size = normal_queue_size = retry_queue_size = 0
        
        return {
            "status": "active",
            "queues": {
                "high_priority": high_queue_size,
                "normal_priority": normal_queue_size,
                "retry": retry_queue_size
            },
            "processing_tasks": len(webhook_manager.processing_tasks),
            "supported_events": [e.value for e in WebhookEventType],
            "n8n_integration": "active" if webhook_manager.n8n_client else "inactive"
        }
        
    except Exception as e:
        logger.error(f"Erro ao buscar estatísticas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar estatísticas"
        )

@router.get("/health")
async def webhook_health_check():
    """Verifica saúde do sistema de webhooks"""
    try:
        health_status = {
            "webhook_manager": "healthy",
            "redis": "unknown",
            "supabase": "unknown",
            "n8n": "unknown"
        }
        
        # Verificar Redis
        if webhook_manager.redis_client:
            try:
                await webhook_manager.redis_client.ping()
                health_status["redis"] = "healthy"
            except:
                health_status["redis"] = "unhealthy"
        
        # Verificar Supabase
        if webhook_manager.supabase_client:
            try:
                result = webhook_manager.supabase_client.table("health_check").select("status").limit(1).execute()
                health_status["supabase"] = "healthy" if result.data else "unhealthy"
            except:
                health_status["supabase"] = "unhealthy"
        
        # Verificar N8N
        if webhook_manager.n8n_client:
            health_status["n8n"] = "configured"
        
        overall_health = "healthy" if all(
            status in ["healthy", "configured", "unknown"] 
            for status in health_status.values()
        ) else "degraded"
        
        return {
            "overall_status": overall_health,
            "services": health_status,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Erro no health check: {str(e)}")
        return {
            "overall_status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }