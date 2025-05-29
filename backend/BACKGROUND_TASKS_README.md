# Sistema de Background Tasks

Sistema robusto de processamento assíncrono para a API FastAPI do projeto "Agentes de Conversão".

## 🚀 Funcionalidades

### Core Features
- **Queue Management**: Sistema de filas com priorização (Critical, High, Normal, Low)
- **Retry Policies**: Retry automático com backoff exponencial e jitter
- **Task Tracking**: Monitoramento completo do status e progresso das tasks
- **Error Handling**: Logging detalhado e tratamento de erros robusto
- **Horizontal Scaling**: Suporte a múltiplos workers

### Task Types Implementados

1. **Document Processing** (`document_processing`)
   - Chunking inteligente de documentos
   - Geração de embeddings via OpenRouter
   - Armazenamento no Supabase
   - Progress tracking em tempo real

2. **Webhook Delivery** (`webhook_delivery`) 
   - Entrega confiável de webhooks
   - Assinatura de payload opcional
   - Retry automático em falhas
   - Headers customizáveis

3. **Analytics Processing** (`analytics_processing`)
   - Processamento de métricas
   - Agregação de dados
   - Geração de relatórios
   - Cálculos estatísticos

4. **Email Notifications** (`email_notification`)
   - Sistema de templates
   - Envio assíncrono
   - Tracking de entrega

5. **External Sync** (`external_sync`)
   - Sincronização com N8N
   - Integração com sistemas externos
   - Webhook triggers

## 📋 API Endpoints

### Submissão de Tasks

```bash
# Task genérica
POST /api/background/tasks
{
  "name": "Minha Task",
  "task_type": "document_processing",
  "priority": "normal",
  "payload": {...}
}

# Processamento de documento
POST /api/background/tasks/document-processing
{
  "document_id": "doc_123",
  "content": "Conteúdo do documento...",
  "chunk_size": 1000,
  "priority": "normal"
}

# Entrega de webhook
POST /api/background/tasks/webhook-delivery
{
  "webhook_url": "https://example.com/webhook",
  "data": {...},
  "headers": {},
  "sign_payload": false,
  "priority": "high"
}

# Sincronização N8N
POST /api/background/tasks/n8n-sync
{
  "sync_type": "user_registration",
  "data": {...},
  "priority": "high"
}
```

### Monitoramento

```bash
# Status de uma task
GET /api/background/tasks/{task_id}

# Logs detalhados
GET /api/background/tasks/{task_id}/logs

# Stream de progresso em tempo real
GET /api/background/tasks/{task_id}/stream

# Cancelar task
POST /api/background/tasks/{task_id}/cancel

# Estatísticas das filas (admin)
GET /api/background/queue/stats

# Health check
GET /api/background/health
```

### Integrações

```bash
# Trigger workflow N8N
POST /api/background/integrations/n8n/trigger

# Processamento em lote de documentos
POST /api/background/integrations/knowledge/process-bulk

# Agendar analytics diário
POST /api/background/integrations/analytics/schedule-daily
```

## 🛠️ Configuração

### Variáveis de Ambiente

```bash
# Redis (obrigatório)
REDIS_URL=redis://localhost:6379

# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenRouter para embeddings
OPENROUTER_API_KEY=sk-or-v1-your-key

# N8N Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com

# Worker Configuration
WORKER_MAX_CONCURRENT=10
WORKER_QUEUES=queue:critical,queue:high,queue:normal,queue:low
```

### Docker Development

```bash
# Iniciar todos os serviços
docker-compose -f docker-compose.dev.yml up

# Apenas API e Redis
docker-compose -f docker-compose.dev.yml up api redis

# Com alta disponibilidade (2 workers)
docker-compose -f docker-compose.dev.yml --profile high-availability up
```

### Worker Standalone

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar worker
python worker.py

# Worker para filas específicas
WORKER_QUEUES=queue:critical,queue:high python worker.py

# Worker com mais concorrência
WORKER_MAX_CONCURRENT=20 python worker.py
```

## 🏗️ Arquitetura

### Componentes

1. **BackgroundTaskManager**: Gerenciador central
2. **TaskHandler**: Classes base para handlers específicos
3. **Redis**: Queue storage e task metadata
4. **Worker Process**: Processamento assíncrono
5. **API Router**: Interface REST

### Fluxo de Execução

1. **Submission**: Task é submetida via API
2. **Queuing**: Task é adicionada à fila por prioridade
3. **Processing**: Worker pega task da fila
4. **Execution**: Handler específico executa a task
5. **Completion**: Resultado é armazenado
6. **Cleanup**: Recursos são liberados

### Retry Logic

```python
# Configuração padrão
TaskRetryPolicy(
    max_retries=3,
    backoff_factor=2.0,
    base_delay=60,  # seconds
    max_delay=3600  # seconds
)

# Delays: 60s, 120s, 240s, então falha permanente
```

## 📊 Monitoramento

### Métricas Disponíveis

- **Queue Stats**: Tamanho das filas por prioridade
- **Task Status**: Pending, Running, Completed, Failed
- **Execution Time**: Tempo de processamento
- **Retry Count**: Número de tentativas
- **Error Rate**: Taxa de falhas

### Logging

```python
# Níveis de log
- INFO: Task lifecycle events
- WARNING: Retries e degradations
- ERROR: Falhas permanentes
- DEBUG: Detalhes de execução
```

### Health Checks

```bash
# API Health
GET /health

# Background Tasks Health
GET /api/background/health

# Redis connectivity check
docker exec agentes_worker python -c "
import asyncio
from core.background_tasks import task_manager
asyncio.run(task_manager.redis_client.ping())
"
```

## 🔧 Desenvolvimento

### Criando Novo Handler

```python
from core.background_tasks import TaskHandler, TaskDefinition

class MyCustomHandler(TaskHandler):
    async def execute(self, task: TaskDefinition) -> Dict[str, Any]:
        # Implementar lógica da task
        await self.update_progress(task.id, 0.5, "Meio do caminho")
        
        # Seu código aqui
        result = {"status": "completed"}
        
        await self.update_progress(task.id, 1.0, "Concluído")
        return result
```

### Registrar Handler

```python
# Em background_tasks.py
task_manager.task_handlers[TaskType.MY_CUSTOM] = MyCustomHandler(task_manager)
```

### Convenience Functions

```python
from core.background_tasks import submit_document_processing

# Submeter task programaticamente
task_id = await submit_document_processing(
    document_id="doc_123",
    content="Conteúdo...",
    organization_id="org_456",
    user_id="user_789"
)
```

### Decorator para Tasks

```python
from core.background_tasks import background_task, TaskType, TaskPriority

@background_task(TaskType.CUSTOM, priority=TaskPriority.HIGH)
async def my_async_function(data, organization_id=None, user_id=None):
    # Sua função será executada como background task
    return {"result": "success"}
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Redis Connection**
   ```bash
   # Verificar conectividade
   redis-cli ping
   
   # Logs do Redis
   docker logs agentes_redis
   ```

2. **Tasks Stuck**
   ```bash
   # Verificar filas
   redis-cli llen queue:normal
   
   # Limpar fila (cuidado!)
   redis-cli del queue:normal
   ```

3. **Worker Not Processing**
   ```bash
   # Logs do worker
   docker logs agentes_worker
   
   # Restart worker
   docker restart agentes_worker
   ```

4. **Memory Issues**
   ```bash
   # Limpar tasks antigas
   POST /api/background/queue/cleanup?max_age_days=1
   
   # Monitorar uso
   docker stats agentes_worker
   ```

### Debugging

```python
# Enable debug logging
import logging
logging.getLogger('core.background_tasks').setLevel(logging.DEBUG)

# Monitor task execution
import asyncio
from core.background_tasks import task_manager

async def monitor_task(task_id):
    while True:
        status = await task_manager.get_task_status(task_id)
        print(f"Task {task_id}: {status.status} - {status.progress}%")
        
        if status.status in ["completed", "failed", "cancelled"]:
            break
            
        await asyncio.sleep(1)
```

## 📈 Performance

### Otimizações

1. **Worker Scaling**: Múltiplos workers para alta carga
2. **Queue Partitioning**: Filas especializadas por tipo
3. **Connection Pooling**: Reutilização de conexões HTTP
4. **Batch Processing**: Agrupamento de tasks similares

### Benchmarks Típicos

- **Document Processing**: ~2s para 1000 words
- **Webhook Delivery**: ~200ms para endpoint local
- **Analytics Processing**: ~5s para 30 dias de dados
- **Throughput**: ~100 tasks/min/worker

## 🔐 Segurança

### Autenticação
- JWT tokens para API access
- Organization-level isolation
- User permission checks

### Webhook Security
- Payload signing opcional
- HTTPS enforcement
- Rate limiting

### Data Privacy
- Logs não contêm dados sensíveis
- TTL automático para resultados
- Cleanup regular de tasks antigas

## 🚀 Deployment

### Railway Production

```bash
# Build API
railway link your-api-service
railway up

# Build Worker
railway link your-worker-service
railway up --dockerfile Dockerfile.worker

# Environment variables
railway variables set REDIS_URL=redis://...
railway variables set WORKER_MAX_CONCURRENT=20
```

### Scaling Considerations

- **Redis**: Use Redis Cloud para produção
- **Workers**: Escalar horizontalmente conforme carga
- **Monitoring**: Implementar métricas customizadas
- **Alerting**: Configurar alertas para falhas

---

## 📞 Suporte

Para dúvidas sobre o sistema de Background Tasks:

1. Verificar logs: `docker logs agentes_worker`
2. Testar health check: `GET /api/background/health`
3. Monitorar filas: `GET /api/background/queue/stats`
4. Consultar documentação da API: `/docs`

Sistema implementado seguindo as melhores práticas de resilência, observabilidade e escalabilidade. 🎯