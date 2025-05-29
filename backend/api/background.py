"""
API endpoints para Background Tasks
Sistema de monitoramento e controle de tasks assíncronas
"""

from fastapi import APIRouter, HTTPException, Depends, status, Query, Body
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta, timezone
import json
import asyncio
import uuid

from pydantic import BaseModel, Field
from core.auth import get_current_active_user, get_admin_user, User
from core.background_tasks import (
    task_manager,
    TaskDefinition,
    TaskResult,
    TaskStatus,
    TaskPriority,
    TaskType,
    submit_document_processing,
    submit_webhook_delivery,
    submit_analytics_processing,
    submit_n8n_sync
)

router = APIRouter(prefix="/api/background", tags=["Background Tasks"])

# Models para requests
class TaskSubmissionRequest(BaseModel):
    name: str
    task_type: TaskType
    priority: TaskPriority = TaskPriority.NORMAL
    payload: Dict[str, Any]
    scheduled_for: Optional[datetime] = None
    tags: List[str] = Field(default_factory=list)

class DocumentProcessingRequest(BaseModel):
    document_id: str
    content: str
    chunk_size: int = Field(default=1000, ge=100, le=5000)
    priority: TaskPriority = TaskPriority.NORMAL

class WebhookDeliveryRequest(BaseModel):
    webhook_url: str = Field(..., regex=r"^https?://")
    data: Dict[str, Any]
    headers: Dict[str, str] = Field(default_factory=dict)
    sign_payload: bool = False
    priority: TaskPriority = TaskPriority.HIGH

class AnalyticsProcessingRequest(BaseModel):
    date_range: Dict[str, str]
    priority: TaskPriority = TaskPriority.LOW

class N8NSyncRequest(BaseModel):
    sync_type: str
    data: Dict[str, Any]
    priority: TaskPriority = TaskPriority.HIGH

class TaskFilter(BaseModel):
    status: Optional[List[TaskStatus]] = None
    task_type: Optional[List[TaskType]] = None
    priority: Optional[List[TaskPriority]] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    tags: Optional[List[str]] = None

class TaskSearchResponse(BaseModel):
    tasks: List[TaskResult]
    total: int
    page: int
    per_page: int
    has_next: bool

class QueueStatsResponse(BaseModel):
    queues: Dict[str, Dict[str, int]]
    total_pending: int
    total_running: int
    total_retrying: int
    worker_status: str

# Endpoints principais

@router.post("/tasks", response_model=Dict[str, str])
async def submit_task(
    request: TaskSubmissionRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Submete uma nova background task
    """
    try:
        task = TaskDefinition(
            name=request.name,
            task_type=request.task_type,
            priority=request.priority,
            payload=request.payload,
            organization_id=current_user.organization_id,
            user_id=current_user.id,
            scheduled_for=request.scheduled_for,
            tags=request.tags
        )
        
        task_id = await task_manager.submit_task(task)
        
        return {
            "task_id": task_id,
            "status": "submitted",
            "message": f"Task {request.name} submitted successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit task: {str(e)}"
        )

@router.post("/tasks/document-processing", response_model=Dict[str, str])
async def submit_document_processing_task(
    request: DocumentProcessingRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Submete task de processamento de documento para knowledge base
    """
    try:
        task_id = await submit_document_processing(
            document_id=request.document_id,
            content=request.content,
            organization_id=current_user.organization_id,
            user_id=current_user.id,
            chunk_size=request.chunk_size,
            priority=request.priority
        )
        
        return {
            "task_id": task_id,
            "status": "submitted",
            "message": f"Document processing task submitted for document {request.document_id}"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit document processing task: {str(e)}"
        )

@router.post("/tasks/webhook-delivery", response_model=Dict[str, str])
async def submit_webhook_delivery_task(
    request: WebhookDeliveryRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Submete task de entrega de webhook
    """
    try:
        task_id = await submit_webhook_delivery(
            webhook_url=request.webhook_url,
            data=request.data,
            organization_id=current_user.organization_id,
            headers=request.headers,
            sign_payload=request.sign_payload,
            priority=request.priority
        )
        
        return {
            "task_id": task_id,
            "status": "submitted",
            "message": f"Webhook delivery task submitted to {request.webhook_url}"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit webhook delivery task: {str(e)}"
        )

@router.post("/tasks/analytics-processing", response_model=Dict[str, str])
async def submit_analytics_processing_task(
    request: AnalyticsProcessingRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Submete task de processamento de analytics
    """
    try:
        task_id = await submit_analytics_processing(
            organization_id=current_user.organization_id,
            date_range=request.date_range,
            user_id=current_user.id,
            priority=request.priority
        )
        
        return {
            "task_id": task_id,
            "status": "submitted",
            "message": "Analytics processing task submitted"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit analytics processing task: {str(e)}"
        )

@router.post("/tasks/n8n-sync", response_model=Dict[str, str])
async def submit_n8n_sync_task(
    request: N8NSyncRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Submete task de sincronização com N8N
    """
    try:
        task_id = await submit_n8n_sync(
            sync_type=request.sync_type,
            data=request.data,
            organization_id=current_user.organization_id,
            priority=request.priority
        )
        
        return {
            "task_id": task_id,
            "status": "submitted",
            "message": f"N8N sync task submitted for {request.sync_type}"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit N8N sync task: {str(e)}"
        )

@router.get("/tasks/{task_id}", response_model=TaskResult)
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Obtém status detalhado de uma task
    """
    task_result = await task_manager.get_task_status(task_id)
    
    if not task_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )
    
    return task_result

@router.get("/tasks/{task_id}/logs")
async def get_task_logs(
    task_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Obtém logs detalhados de uma task
    """
    task_result = await task_manager.get_task_status(task_id)
    
    if not task_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )
    
    return {
        "task_id": task_id,
        "logs": task_result.logs,
        "total_logs": len(task_result.logs)
    }

@router.get("/tasks/{task_id}/stream")
async def stream_task_progress(
    task_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Stream de progresso em tempo real de uma task
    """
    async def generate_progress():
        last_progress = -1
        
        while True:
            task_result = await task_manager.get_task_status(task_id)
            
            if not task_result:
                yield f"data: {json.dumps({'error': 'Task not found'})}\n\n"
                break
            
            if task_result.progress != last_progress:
                progress_data = {
                    "task_id": task_id,
                    "status": task_result.status,
                    "progress": task_result.progress,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
                
                yield f"data: {json.dumps(progress_data)}\n\n"
                last_progress = task_result.progress
            
            if task_result.status in [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED]:
                break
            
            await asyncio.sleep(1)
    
    return StreamingResponse(
        generate_progress(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@router.post("/tasks/{task_id}/cancel")
async def cancel_task(
    task_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Cancela uma task em execução
    """
    success = await task_manager.cancel_task(task_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found or cannot be cancelled"
        )
    
    return {
        "task_id": task_id,
        "status": "cancelled",
        "message": "Task cancelled successfully"
    }

@router.get("/tasks", response_model=List[TaskResult])
async def list_tasks(
    status: Optional[List[TaskStatus]] = Query(None),
    task_type: Optional[List[TaskType]] = Query(None),
    priority: Optional[List[TaskPriority]] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lista tasks do usuário com filtros
    """
    # Em uma implementação completa, isso seria implementado no task_manager
    # Por agora, retorna lista vazia
    return []

@router.get("/queue/stats", response_model=QueueStatsResponse)
async def get_queue_stats(
    current_user: User = Depends(get_admin_user)
):
    """
    Obtém estatísticas das filas (apenas admin)
    """
    try:
        stats = await task_manager.get_queue_stats()
        
        total_pending = sum(q["pending"] for q in stats.values())
        total_running = sum(q["running"] for q in stats.values())
        total_retrying = sum(q["retrying"] for q in stats.values())
        
        return QueueStatsResponse(
            queues=stats,
            total_pending=total_pending,
            total_running=total_running,
            total_retrying=total_retrying,
            worker_status="active"  # Em produção, verificaria se worker está ativo
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get queue stats: {str(e)}"
        )

@router.post("/queue/cleanup")
async def cleanup_old_tasks(
    max_age_days: int = Query(7, ge=1, le=30),
    current_user: User = Depends(get_admin_user)
):
    """
    Limpa tasks antigas (apenas admin)
    """
    try:
        cleaned_count = await task_manager.cleanup_old_tasks(max_age_days)
        
        return {
            "status": "success",
            "cleaned_tasks": cleaned_count,
            "max_age_days": max_age_days,
            "message": f"Cleaned {cleaned_count} old tasks"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cleanup old tasks: {str(e)}"
        )

@router.get("/health")
async def background_tasks_health():
    """
    Health check do sistema de background tasks
    """
    try:
        stats = await task_manager.get_queue_stats()
        
        # Verificar se Redis está acessível
        redis_status = "healthy"
        try:
            await task_manager.redis_client.ping()
        except:
            redis_status = "unhealthy"
        
        return {
            "status": "healthy" if redis_status == "healthy" else "degraded",
            "redis": redis_status,
            "queues": stats,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

# Endpoints especializados para integrações

@router.post("/integrations/n8n/trigger")
async def trigger_n8n_workflow(
    workflow_data: Dict[str, Any] = Body(...),
    workflow_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user)
):
    """
    Trigger manual de workflow N8N via background task
    """
    try:
        sync_type = workflow_id or "manual_trigger"
        
        task_id = await submit_n8n_sync(
            sync_type=sync_type,
            data={
                "workflow_id": workflow_id,
                "trigger_data": workflow_data,
                "user_id": current_user.id,
                "organization_id": current_user.organization_id
            },
            organization_id=current_user.organization_id,
            priority=TaskPriority.HIGH
        )
        
        return {
            "task_id": task_id,
            "workflow_id": workflow_id,
            "status": "triggered",
            "message": "N8N workflow triggered successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to trigger N8N workflow: {str(e)}"
        )

@router.post("/integrations/knowledge/process-bulk")
async def process_bulk_documents(
    documents: List[Dict[str, Any]] = Body(...),
    chunk_size: int = Query(1000, ge=100, le=5000),
    current_user: User = Depends(get_current_active_user)
):
    """
    Processa múltiplos documentos em paralelo
    """
    try:
        task_ids = []
        
        for doc in documents:
            task_id = await submit_document_processing(
                document_id=doc.get("id", str(uuid.uuid4())),
                content=doc.get("content", ""),
                organization_id=current_user.organization_id,
                user_id=current_user.id,
                chunk_size=chunk_size,
                priority=TaskPriority.NORMAL
            )
            task_ids.append(task_id)
        
        return {
            "task_ids": task_ids,
            "documents_submitted": len(documents),
            "status": "submitted",
            "message": f"Bulk processing submitted for {len(documents)} documents"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit bulk document processing: {str(e)}"
        )

@router.post("/integrations/analytics/schedule-daily")
async def schedule_daily_analytics(
    current_user: User = Depends(get_current_active_user)
):
    """
    Agenda processamento diário de analytics
    """
    try:
        # Agendar para próxima meia-noite
        tomorrow = datetime.now(timezone.utc).replace(
            hour=0, minute=0, second=0, microsecond=0
        ) + timedelta(days=1)
        
        task_id = await submit_analytics_processing(
            organization_id=current_user.organization_id,
            date_range={
                "start": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat(),
                "end": datetime.now(timezone.utc).isoformat()
            },
            user_id=current_user.id,
            priority=TaskPriority.LOW
        )
        
        return {
            "task_id": task_id,
            "scheduled_for": tomorrow.isoformat(),
            "status": "scheduled",
            "message": "Daily analytics processing scheduled"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to schedule daily analytics: {str(e)}"
        )

# Webhook receiver para notificações de tasks
@router.post("/webhook/task-completed")
async def task_completed_webhook(
    payload: Dict[str, Any] = Body(...)
):
    """
    Webhook para receber notificações de tasks completadas
    """
    try:
        task_id = payload.get("task_id")
        status = payload.get("status")
        
        # Processar notificação
        # Em produção, isso poderia disparar outros workflows
        
        return {
            "status": "received",
            "task_id": task_id,
            "message": "Task completion notification processed"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# Middleware para inicializar task manager
async def ensure_task_manager_initialized():
    """Garante que o task manager está inicializado"""
    if not task_manager.redis_client:
        await task_manager.initialize()

# Aplicar middleware a todos os endpoints
@router.middleware("http")
async def task_manager_middleware(request, call_next):
    await ensure_task_manager_initialized()
    response = await call_next(request)
    return response