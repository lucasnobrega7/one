from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from datetime import datetime
import hmac
import hashlib
import json

from ..database import get_db
from ..models import WebhookEvent, WebhookEndpoint, User
from ..auth import get_current_user
from ..schemas import WebhookEndpointCreate, WebhookEndpointResponse

router = APIRouter()

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
    db: Session
):
    """Processa o evento do webhook em background"""
    try:
        # Registra o evento
        webhook_event = WebhookEvent(
            event_type=event_type,
            data=data,
            processed_at=datetime.utcnow()
        )
        db.add(webhook_event)
        
        # Processa baseado no tipo de evento
        if event_type == "conversation.created":
            # TODO: Implementar lógica específica
            pass
        elif event_type == "conversation.message.added":
            # TODO: Implementar lógica específica
            pass
        elif event_type == "agent.created":
            # TODO: Implementar lógica específica
            pass
        
        db.commit()
    except Exception as e:
        print(f"Erro ao processar webhook: {str(e)}")
        db.rollback()

@router.post("/incoming/{endpoint_id}")
async def receive_webhook(
    endpoint_id: str,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Recebe webhooks externos"""
    try:
        # Busca o endpoint
        endpoint = db.query(WebhookEndpoint).filter(
            WebhookEndpoint.id == endpoint_id,
            WebhookEndpoint.is_active == True
        ).first()
        
        if not endpoint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Endpoint não encontrado"
            )
        
        # Obtém o payload
        payload = await request.body()
        
        # Verifica a assinatura se configurada
        if endpoint.secret:
            signature = request.headers.get("X-Webhook-Signature", "")
            if not verify_webhook_signature(payload, signature, endpoint.secret):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Assinatura inválida"
                )
        
        # Parse do payload
        try:
            data = json.loads(payload)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payload inválido"
            )
        
        # Processa em background
        event_type = data.get("event", "unknown")
        background_tasks.add_task(
            process_webhook_event,
            event_type,
            data,
            db
        )
        
        return {"status": "received"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao receber webhook: {str(e)}")
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

# Webhook específico para notificações internas
@router.post("/notify")
async def send_notification(
    event_type: str,
    data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Envia notificações para todos os endpoints configurados"""
    try:
        # Busca todos os endpoints ativos que escutam este evento
        endpoints = db.query(WebhookEndpoint).filter(
            WebhookEndpoint.is_active == True,
            WebhookEndpoint.events.contains([event_type])
        ).all()
        
        for endpoint in endpoints:
            # TODO: Implementar envio assíncrono de webhooks
            pass
        
        return {
            "status": "notified",
            "endpoints_count": len(endpoints)
        }
    except Exception as e:
        print(f"Erro ao enviar notificações: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao enviar notificações"
        )