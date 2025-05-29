"""
Sistema de Background Tasks para a API FastAPI
Processamento assíncrono para operações pesadas e automações
"""

import asyncio
import json
import uuid
import hashlib
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, List, Callable, Union
from enum import Enum
from dataclasses import dataclass, asdict
from functools import wraps

import httpx
import redis.asyncio as redis
from pydantic import BaseModel, Field
from supabase import create_client, Client
import os

# Configuração
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "https://primary-em-atividade.up.railway.app")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")

# Logger
logger = logging.getLogger(__name__)

# Enums
class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running" 
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    CANCELLED = "cancelled"

class TaskPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"

class TaskType(str, Enum):
    DOCUMENT_PROCESSING = "document_processing"
    WEBHOOK_DELIVERY = "webhook_delivery"
    ANALYTICS_PROCESSING = "analytics_processing"
    EMAIL_NOTIFICATION = "email_notification"
    EXTERNAL_SYNC = "external_sync"
    KNOWLEDGE_EMBEDDING = "knowledge_embedding"
    DATA_CLEANUP = "data_cleanup"
    REPORT_GENERATION = "report_generation"

# Models
@dataclass
class TaskRetryPolicy:
    max_retries: int = 3
    backoff_factor: float = 2.0
    base_delay: int = 60  # seconds
    max_delay: int = 3600  # seconds
    
    def get_delay(self, attempt: int) -> int:
        """Calcula delay exponencial com jitter"""
        delay = min(self.base_delay * (self.backoff_factor ** attempt), self.max_delay)
        # Adiciona jitter para evitar thundering herd
        import random
        jitter = random.uniform(0.8, 1.2)
        return int(delay * jitter)

class TaskConfig(BaseModel):
    timeout: int = 300  # 5 minutes
    retry_policy: TaskRetryPolicy = Field(default_factory=TaskRetryPolicy)
    store_result: bool = True
    result_ttl: int = 86400  # 24 hours
    send_notifications: bool = False
    
class TaskDefinition(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    task_type: TaskType
    priority: TaskPriority = TaskPriority.NORMAL
    payload: Dict[str, Any]
    config: TaskConfig = Field(default_factory=TaskConfig)
    organization_id: Optional[str] = None
    user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    scheduled_for: Optional[datetime] = None
    dependencies: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)

class TaskResult(BaseModel):
    task_id: str
    status: TaskStatus
    result: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, str]] = None
    attempts: int = 0
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    execution_time: Optional[float] = None
    retry_count: int = 0
    next_retry_at: Optional[datetime] = None
    progress: float = 0.0
    logs: List[Dict[str, Any]] = Field(default_factory=list)

class TaskHandler:
    """Classe base para handlers de tasks"""
    
    def __init__(self, task_manager: 'BackgroundTaskManager'):
        self.task_manager = task_manager
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
    
    async def execute(self, task: TaskDefinition) -> Dict[str, Any]:
        """Executa a task - deve ser implementado pelas subclasses"""
        raise NotImplementedError
    
    async def update_progress(self, task_id: str, progress: float, message: str = ""):
        """Atualiza progresso da task"""
        await self.task_manager.update_task_progress(task_id, progress, message)
    
    async def add_log(self, task_id: str, level: str, message: str, extra: Dict[str, Any] = None):
        """Adiciona log à task"""
        await self.task_manager.add_task_log(task_id, level, message, extra)

class DocumentProcessingHandler(TaskHandler):
    """Handler para processamento de documentos"""
    
    async def execute(self, task: TaskDefinition) -> Dict[str, Any]:
        payload = task.payload
        document_id = payload.get("document_id")
        document_content = payload.get("content", "")
        chunk_size = payload.get("chunk_size", 1000)
        
        await self.update_progress(task.id, 0.1, "Iniciando processamento de documento")
        
        # Chunking do documento
        chunks = await self._chunk_document(document_content, chunk_size)
        await self.update_progress(task.id, 0.3, f"Documento dividido em {len(chunks)} chunks")
        
        # Gerar embeddings
        embeddings = []
        total_chunks = len(chunks)
        
        for i, chunk in enumerate(chunks):
            embedding = await self._generate_embedding(chunk)
            embeddings.append({
                "chunk_id": f"{document_id}_chunk_{i}",
                "content": chunk,
                "embedding": embedding,
                "position": i
            })
            
            progress = 0.3 + (0.6 * (i + 1) / total_chunks)
            await self.update_progress(task.id, progress, f"Processado chunk {i+1}/{total_chunks}")
        
        # Salvar no banco
        await self._save_embeddings(document_id, embeddings, task.organization_id)
        await self.update_progress(task.id, 1.0, "Processamento concluído")
        
        return {
            "document_id": document_id,
            "chunks_processed": len(chunks),
            "embeddings_generated": len(embeddings),
            "status": "completed"
        }
    
    async def _chunk_document(self, content: str, chunk_size: int) -> List[str]:
        """Divide documento em chunks"""
        words = content.split()
        chunks = []
        current_chunk = []
        current_size = 0
        
        for word in words:
            if current_size + len(word) > chunk_size and current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = [word]
                current_size = len(word)
            else:
                current_chunk.append(word)
                current_size += len(word) + 1
        
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks
    
    async def _generate_embedding(self, text: str) -> List[float]:
        """Gera embedding usando OpenRouter"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/embeddings",
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://agentesdeconversao.com.br"
                    },
                    json={
                        "model": "text-embedding-3-small",
                        "input": text
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["data"][0]["embedding"]
                else:
                    # Fallback: retorna embedding mock
                    return [0.1] * 1536
                    
        except Exception as e:
            logger.error(f"Erro ao gerar embedding: {e}")
            return [0.1] * 1536
    
    async def _save_embeddings(self, document_id: str, embeddings: List[Dict], organization_id: str):
        """Salva embeddings no Supabase"""
        try:
            supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
            
            for embedding in embeddings:
                supabase.table("document_embeddings").insert({
                    "id": str(uuid.uuid4()),
                    "document_id": document_id,
                    "organization_id": organization_id,
                    "chunk_id": embedding["chunk_id"],
                    "content": embedding["content"],
                    "embedding": embedding["embedding"],
                    "position": embedding["position"],
                    "created_at": datetime.now(timezone.utc).isoformat()
                }).execute()
                
        except Exception as e:
            logger.error(f"Erro ao salvar embeddings: {e}")
            raise

class WebhookDeliveryHandler(TaskHandler):
    """Handler para entrega de webhooks"""
    
    async def execute(self, task: TaskDefinition) -> Dict[str, Any]:
        payload = task.payload
        webhook_url = payload.get("webhook_url")
        webhook_data = payload.get("data", {})
        headers = payload.get("headers", {})
        
        await self.update_progress(task.id, 0.1, "Preparando webhook")
        
        # Assinar payload se necessário
        if payload.get("sign_payload", False):
            webhook_data = await self._sign_webhook_payload(webhook_data)
        
        await self.update_progress(task.id, 0.3, "Enviando webhook")
        
        # Enviar webhook
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    webhook_url,
                    json=webhook_data,
                    headers=headers
                )
                
                await self.update_progress(task.id, 0.8, f"Webhook enviado - Status: {response.status_code}")
                
                if response.status_code < 400:
                    await self.update_progress(task.id, 1.0, "Webhook entregue com sucesso")
                    return {
                        "status": "delivered",
                        "status_code": response.status_code,
                        "response": response.text[:1000]  # Primeiros 1000 chars
                    }
                else:
                    raise Exception(f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                await self.add_log(task.id, "error", f"Erro no webhook: {str(e)}")
                raise
    
    async def _sign_webhook_payload(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Assina payload do webhook"""
        timestamp = int(datetime.now(timezone.utc).timestamp())
        payload_str = json.dumps(payload, sort_keys=True)
        
        # Gerar assinatura
        secret = os.getenv("WEBHOOK_SECRET", "default-secret")
        signature = hashlib.sha256(f"{timestamp}.{payload_str}.{secret}".encode()).hexdigest()
        
        return {
            **payload,
            "_webhook_meta": {
                "timestamp": timestamp,
                "signature": signature
            }
        }

class AnalyticsProcessingHandler(TaskHandler):
    """Handler para processamento de analytics"""
    
    async def execute(self, task: TaskDefinition) -> Dict[str, Any]:
        payload = task.payload
        date_range = payload.get("date_range", {})
        organization_id = task.organization_id
        
        await self.update_progress(task.id, 0.1, "Coletando dados de analytics")
        
        # Coletar dados
        analytics_data = await self._collect_analytics_data(organization_id, date_range)
        await self.update_progress(task.id, 0.5, "Processando métricas")
        
        # Processar métricas
        metrics = await self._process_metrics(analytics_data)
        await self.update_progress(task.id, 0.8, "Salvando resultados")
        
        # Salvar resultados
        await self._save_analytics_results(organization_id, metrics)
        await self.update_progress(task.id, 1.0, "Analytics processado")
        
        return {
            "organization_id": organization_id,
            "metrics_processed": len(metrics),
            "date_range": date_range,
            "status": "completed"
        }
    
    async def _collect_analytics_data(self, organization_id: str, date_range: Dict) -> Dict[str, Any]:
        """Coleta dados de analytics"""
        # Mock data - em produção conectaria com Supabase
        return {
            "conversations": 150,
            "messages": 850,
            "agents": 5,
            "users": 25
        }
    
    async def _process_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Processa métricas"""
        return {
            "conversion_rate": 0.12,
            "avg_session_duration": 300,
            "bounce_rate": 0.35,
            "satisfaction_score": 4.2
        }
    
    async def _save_analytics_results(self, organization_id: str, metrics: Dict[str, Any]):
        """Salva resultados de analytics"""
        # Mock - em produção salvaria no Supabase
        pass

class EmailNotificationHandler(TaskHandler):
    """Handler para notificações por email"""
    
    async def execute(self, task: TaskDefinition) -> Dict[str, Any]:
        payload = task.payload
        recipient = payload.get("recipient")
        template = payload.get("template")
        data = payload.get("data", {})
        
        await self.update_progress(task.id, 0.2, "Preparando email")
        
        # Renderizar template
        email_content = await self._render_email_template(template, data)
        await self.update_progress(task.id, 0.6, "Enviando email")
        
        # Enviar email (mock)
        await asyncio.sleep(1)  # Simula envio
        await self.update_progress(task.id, 1.0, "Email enviado")
        
        return {
            "recipient": recipient,
            "template": template,
            "status": "sent"
        }
    
    async def _render_email_template(self, template: str, data: Dict[str, Any]) -> str:
        """Renderiza template de email"""
        # Mock template rendering
        return f"Email template: {template} with data: {data}"

class ExternalSyncHandler(TaskHandler):
    """Handler para sincronização com sistemas externos"""
    
    async def execute(self, task: TaskDefinition) -> Dict[str, Any]:
        payload = task.payload
        system = payload.get("system")
        sync_type = payload.get("sync_type")
        
        await self.update_progress(task.id, 0.1, f"Sincronizando com {system}")
        
        if system == "n8n":
            result = await self._sync_with_n8n(sync_type, payload)
        else:
            result = {"status": "unsupported_system"}
        
        await self.update_progress(task.id, 1.0, "Sincronização concluída")
        return result
    
    async def _sync_with_n8n(self, sync_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Sincroniza com N8N"""
        webhook_url = f"{N8N_WEBHOOK_URL}/webhook/{sync_type}"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(webhook_url, json=payload)
            return {
                "status": "synced" if response.status_code < 400 else "failed",
                "response_code": response.status_code
            }

class BackgroundTaskManager:
    """Gerenciador principal de background tasks"""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.task_handlers: Dict[TaskType, TaskHandler] = {}
        self.running_tasks: Dict[str, asyncio.Task] = {}
        self.logger = logging.getLogger(__name__)
        
    async def initialize(self):
        """Inicializa o gerenciador"""
        self.redis_client = redis.from_url(REDIS_URL)
        
        # Registrar handlers
        self.task_handlers[TaskType.DOCUMENT_PROCESSING] = DocumentProcessingHandler(self)
        self.task_handlers[TaskType.WEBHOOK_DELIVERY] = WebhookDeliveryHandler(self)
        self.task_handlers[TaskType.ANALYTICS_PROCESSING] = AnalyticsProcessingHandler(self)
        self.task_handlers[TaskType.EMAIL_NOTIFICATION] = EmailNotificationHandler(self)
        self.task_handlers[TaskType.EXTERNAL_SYNC] = ExternalSyncHandler(self)
        
        self.logger.info("Background Task Manager inicializado")
    
    async def submit_task(self, task: TaskDefinition) -> str:
        """Submete uma nova task"""
        # Salvar task no Redis
        task_data = task.model_dump_json()
        await self.redis_client.hset(f"task:{task.id}", mapping={
            "definition": task_data,
            "status": TaskStatus.PENDING,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        # Adicionar à fila baseada na prioridade
        queue_name = f"queue:{task.priority.value}"
        await self.redis_client.lpush(queue_name, task.id)
        
        self.logger.info(f"Task {task.id} submetida para fila {queue_name}")
        return task.id
    
    async def get_task_status(self, task_id: str) -> Optional[TaskResult]:
        """Obtém status de uma task"""
        task_data = await self.redis_client.hgetall(f"task:{task_id}")
        
        if not task_data:
            return None
        
        # Construir TaskResult dos dados do Redis
        result_data = {
            "task_id": task_id,
            "status": task_data.get("status", TaskStatus.PENDING),
            "attempts": int(task_data.get("attempts", 0)),
            "retry_count": int(task_data.get("retry_count", 0)),
            "progress": float(task_data.get("progress", 0.0))
        }
        
        # Carregar dados JSON se existirem
        for field in ["result", "error", "logs"]:
            if field in task_data:
                try:
                    result_data[field] = json.loads(task_data[field])
                except json.JSONDecodeError:
                    pass
        
        # Carregar timestamps
        for field in ["started_at", "completed_at", "next_retry_at"]:
            if field in task_data:
                try:
                    result_data[field] = datetime.fromisoformat(task_data[field])
                except ValueError:
                    pass
        
        if "execution_time" in task_data:
            result_data["execution_time"] = float(task_data["execution_time"])
        
        return TaskResult(**result_data)
    
    async def update_task_progress(self, task_id: str, progress: float, message: str = ""):
        """Atualiza progresso de uma task"""
        await self.redis_client.hset(f"task:{task_id}", mapping={
            "progress": progress,
            "last_message": message,
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
    
    async def add_task_log(self, task_id: str, level: str, message: str, extra: Dict[str, Any] = None):
        """Adiciona log a uma task"""
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "message": message,
            "extra": extra or {}
        }
        
        # Buscar logs existentes
        existing_logs = await self.redis_client.hget(f"task:{task_id}", "logs")
        logs = json.loads(existing_logs) if existing_logs else []
        
        logs.append(log_entry)
        
        # Manter apenas os últimos 50 logs
        if len(logs) > 50:
            logs = logs[-50:]
        
        await self.redis_client.hset(f"task:{task_id}", "logs", json.dumps(logs))
    
    async def execute_task(self, task_id: str):
        """Executa uma task"""
        try:
            # Marcar como running
            await self.redis_client.hset(f"task:{task_id}", mapping={
                "status": TaskStatus.RUNNING,
                "started_at": datetime.now(timezone.utc).isoformat()
            })
            
            # Carregar definição da task
            task_data = await self.redis_client.hget(f"task:{task_id}", "definition")
            task = TaskDefinition.model_validate_json(task_data)
            
            # Obter handler
            handler = self.task_handlers.get(task.task_type)
            if not handler:
                raise Exception(f"No handler for task type: {task.task_type}")
            
            # Executar com timeout
            start_time = datetime.now(timezone.utc)
            
            result = await asyncio.wait_for(
                handler.execute(task),
                timeout=task.config.timeout
            )
            
            end_time = datetime.now(timezone.utc)
            execution_time = (end_time - start_time).total_seconds()
            
            # Marcar como concluída
            await self.redis_client.hset(f"task:{task_id}", mapping={
                "status": TaskStatus.COMPLETED,
                "result": json.dumps(result),
                "completed_at": end_time.isoformat(),
                "execution_time": execution_time,
                "progress": 1.0
            })
            
            self.logger.info(f"Task {task_id} concluída em {execution_time:.2f}s")
            
        except asyncio.TimeoutError:
            await self._handle_task_failure(task_id, "Task timeout", is_retryable=True)
        except Exception as e:
            await self._handle_task_failure(task_id, str(e), is_retryable=True)
    
    async def _handle_task_failure(self, task_id: str, error_message: str, is_retryable: bool = True):
        """Lida com falha de task"""
        # Incrementar contador de tentativas
        current_attempts = await self.redis_client.hincrby(f"task:{task_id}", "attempts", 1)
        
        # Carregar definição para verificar retry policy
        task_data = await self.redis_client.hget(f"task:{task_id}", "definition")
        task = TaskDefinition.model_validate_json(task_data)
        
        if is_retryable and current_attempts <= task.config.retry_policy.max_retries:
            # Agendar retry
            retry_delay = task.config.retry_policy.get_delay(current_attempts - 1)
            next_retry = datetime.now(timezone.utc) + timedelta(seconds=retry_delay)
            
            await self.redis_client.hset(f"task:{task_id}", mapping={
                "status": TaskStatus.RETRYING,
                "retry_count": current_attempts,
                "next_retry_at": next_retry.isoformat(),
                "error": json.dumps({"message": error_message, "retryable": True})
            })
            
            # Re-adicionar à fila com delay
            await self.redis_client.zadd(f"retry_queue:{task.priority.value}", {task_id: next_retry.timestamp()})
            
            self.logger.warning(f"Task {task_id} agendada para retry em {retry_delay}s")
        else:
            # Marcar como falha permanente
            await self.redis_client.hset(f"task:{task_id}", mapping={
                "status": TaskStatus.FAILED,
                "error": json.dumps({"message": error_message, "retryable": False}),
                "completed_at": datetime.now(timezone.utc).isoformat()
            })
            
            self.logger.error(f"Task {task_id} falhou permanentemente: {error_message}")
    
    async def start_worker(self, queues: List[str] = None):
        """Inicia worker para processar tasks"""
        if queues is None:
            queues = [f"queue:{p.value}" for p in TaskPriority]
        
        self.logger.info(f"Iniciando worker para filas: {queues}")
        
        while True:
            try:
                # Processar retry queue primeiro
                await self._process_retry_queue()
                
                # Processar filas normais
                for queue in queues:
                    task_id = await self.redis_client.rpop(queue)
                    if task_id:
                        # Executar task em background
                        task = asyncio.create_task(self.execute_task(task_id.decode()))
                        self.running_tasks[task_id.decode()] = task
                        
                        # Limpar tasks concluídas
                        await self._cleanup_completed_tasks()
                
                # Aguardar um pouco antes do próximo ciclo
                await asyncio.sleep(1)
                
            except Exception as e:
                self.logger.error(f"Erro no worker: {e}")
                await asyncio.sleep(5)
    
    async def _process_retry_queue(self):
        """Processa fila de retry"""
        now = datetime.now(timezone.utc).timestamp()
        
        for priority in TaskPriority:
            retry_queue = f"retry_queue:{priority.value}"
            
            # Buscar tasks prontas para retry
            ready_tasks = await self.redis_client.zrangebyscore(
                retry_queue, min=0, max=now, withscores=False
            )
            
            for task_id in ready_tasks:
                # Mover de volta para fila normal
                await self.redis_client.zrem(retry_queue, task_id)
                await self.redis_client.lpush(f"queue:{priority.value}", task_id)
    
    async def _cleanup_completed_tasks(self):
        """Limpa tasks concluídas da memória"""
        completed_tasks = []
        for task_id, task in self.running_tasks.items():
            if task.done():
                completed_tasks.append(task_id)
        
        for task_id in completed_tasks:
            del self.running_tasks[task_id]
    
    async def cancel_task(self, task_id: str) -> bool:
        """Cancela uma task"""
        # Cancelar se estiver rodando
        if task_id in self.running_tasks:
            self.running_tasks[task_id].cancel()
            del self.running_tasks[task_id]
        
        # Remover das filas
        for priority in TaskPriority:
            await self.redis_client.lrem(f"queue:{priority.value}", 0, task_id)
            await self.redis_client.zrem(f"retry_queue:{priority.value}", task_id)
        
        # Marcar como cancelada
        await self.redis_client.hset(f"task:{task_id}", mapping={
            "status": TaskStatus.CANCELLED,
            "completed_at": datetime.now(timezone.utc).isoformat()
        })
        
        return True
    
    async def get_queue_stats(self) -> Dict[str, Any]:
        """Obtém estatísticas das filas"""
        stats = {}
        
        for priority in TaskPriority:
            queue_name = f"queue:{priority.value}"
            retry_queue_name = f"retry_queue:{priority.value}"
            
            queue_size = await self.redis_client.llen(queue_name)
            retry_size = await self.redis_client.zcard(retry_queue_name)
            
            stats[priority.value] = {
                "pending": queue_size,
                "retrying": retry_size,
                "running": len([t for t in self.running_tasks.values() if not t.done()])
            }
        
        return stats
    
    async def cleanup_old_tasks(self, max_age_days: int = 7):
        """Limpa tasks antigas"""
        cutoff = datetime.now(timezone.utc) - timedelta(days=max_age_days)
        cutoff_timestamp = cutoff.timestamp()
        
        # Buscar todas as keys de task
        task_keys = await self.redis_client.keys("task:*")
        
        cleaned_count = 0
        for key in task_keys:
            task_data = await self.redis_client.hgetall(key)
            
            if "completed_at" in task_data:
                try:
                    completed_at = datetime.fromisoformat(task_data["completed_at"])
                    if completed_at.timestamp() < cutoff_timestamp:
                        await self.redis_client.delete(key)
                        cleaned_count += 1
                except ValueError:
                    pass
        
        self.logger.info(f"Limpas {cleaned_count} tasks antigas")
        return cleaned_count
    
    async def close(self):
        """Fecha conexões e limpa recursos"""
        # Cancelar todas as tasks em execução
        for task in self.running_tasks.values():
            task.cancel()
        
        # Fechar Redis
        if self.redis_client:
            await self.redis_client.close()
        
        self.logger.info("Background Task Manager fechado")

# Instância global
task_manager = BackgroundTaskManager()

# Convenience functions
async def submit_document_processing(
    document_id: str,
    content: str,
    organization_id: str,
    user_id: str,
    chunk_size: int = 1000,
    priority: TaskPriority = TaskPriority.NORMAL
) -> str:
    """Submete task de processamento de documento"""
    task = TaskDefinition(
        name=f"Process Document {document_id}",
        task_type=TaskType.DOCUMENT_PROCESSING,
        priority=priority,
        payload={
            "document_id": document_id,
            "content": content,
            "chunk_size": chunk_size
        },
        organization_id=organization_id,
        user_id=user_id,
        tags=["document", "embedding"]
    )
    
    return await task_manager.submit_task(task)

async def submit_webhook_delivery(
    webhook_url: str,
    data: Dict[str, Any],
    organization_id: str,
    headers: Dict[str, str] = None,
    sign_payload: bool = False,
    priority: TaskPriority = TaskPriority.HIGH
) -> str:
    """Submete task de entrega de webhook"""
    task = TaskDefinition(
        name=f"Webhook to {webhook_url}",
        task_type=TaskType.WEBHOOK_DELIVERY,
        priority=priority,
        payload={
            "webhook_url": webhook_url,
            "data": data,
            "headers": headers or {},
            "sign_payload": sign_payload
        },
        organization_id=organization_id,
        tags=["webhook", "integration"]
    )
    
    return await task_manager.submit_task(task)

async def submit_analytics_processing(
    organization_id: str,
    date_range: Dict[str, str],
    user_id: str,
    priority: TaskPriority = TaskPriority.LOW
) -> str:
    """Submete task de processamento de analytics"""
    task = TaskDefinition(
        name=f"Analytics for {organization_id}",
        task_type=TaskType.ANALYTICS_PROCESSING,
        priority=priority,
        payload={
            "date_range": date_range
        },
        organization_id=organization_id,
        user_id=user_id,
        tags=["analytics", "metrics"]
    )
    
    return await task_manager.submit_task(task)

async def submit_n8n_sync(
    sync_type: str,
    data: Dict[str, Any],
    organization_id: str,
    priority: TaskPriority = TaskPriority.HIGH
) -> str:
    """Submete task de sincronização com N8N"""
    task = TaskDefinition(
        name=f"N8N Sync: {sync_type}",
        task_type=TaskType.EXTERNAL_SYNC,
        priority=priority,
        payload={
            "system": "n8n",
            "sync_type": sync_type,
            "data": data
        },
        organization_id=organization_id,
        tags=["n8n", "sync", "automation"]
    )
    
    return await task_manager.submit_task(task)

# Decorator para tasks síncronas
def background_task(
    task_type: TaskType,
    priority: TaskPriority = TaskPriority.NORMAL,
    **config_kwargs
):
    """Decorator para transformar função em background task"""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extrair contexto se disponível
            organization_id = kwargs.pop("organization_id", None)
            user_id = kwargs.pop("user_id", None)
            
            task = TaskDefinition(
                name=f"{func.__name__}",
                task_type=task_type,
                priority=priority,
                payload={"args": args, "kwargs": kwargs},
                organization_id=organization_id,
                user_id=user_id,
                config=TaskConfig(**config_kwargs)
            )
            
            return await task_manager.submit_task(task)
        
        return wrapper
    return decorator