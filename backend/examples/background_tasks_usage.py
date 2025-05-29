"""
Exemplos de uso do Sistema de Background Tasks
Casos práticos de implementação e integração
"""

import asyncio
import httpx
from datetime import datetime, timedelta
from typing import Dict, Any, List

# Configuração base
API_BASE_URL = "http://localhost:8000"
AUTH_TOKEN = "your-jwt-token-here"

class BackgroundTasksClient:
    """Cliente para interagir com Background Tasks API"""
    
    def __init__(self, base_url: str, auth_token: str):
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }
    
    async def submit_document_processing(self, document_id: str, content: str) -> str:
        """Submete processamento de documento"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/background/tasks/document-processing",
                headers=self.headers,
                json={
                    "document_id": document_id,
                    "content": content,
                    "chunk_size": 1000,
                    "priority": "normal"
                }
            )
            
            if response.status_code == 200:
                return response.json()["task_id"]
            else:
                raise Exception(f"Failed to submit task: {response.text}")
    
    async def submit_webhook_delivery(self, webhook_url: str, data: Dict[str, Any]) -> str:
        """Submete entrega de webhook"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/background/tasks/webhook-delivery",
                headers=self.headers,
                json={
                    "webhook_url": webhook_url,
                    "data": data,
                    "priority": "high",
                    "sign_payload": True
                }
            )
            
            if response.status_code == 200:
                return response.json()["task_id"]
            else:
                raise Exception(f"Failed to submit webhook: {response.text}")
    
    async def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """Obtém status da task"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/background/tasks/{task_id}",
                headers=self.headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"Failed to get task status: {response.text}")
    
    async def monitor_task_progress(self, task_id: str, callback=None):
        """Monitora progresso da task em tempo real"""
        async with httpx.AsyncClient() as client:
            async with client.stream(
                "GET",
                f"{self.base_url}/api/background/tasks/{task_id}/stream",
                headers=self.headers
            ) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        import json
                        data = json.loads(line[6:])
                        
                        if callback:
                            await callback(data)
                        else:
                            print(f"Progress: {data.get('progress', 0):.1%} - {data.get('status')}")
                        
                        if data.get("status") in ["completed", "failed", "cancelled"]:
                            break
    
    async def trigger_n8n_workflow(self, workflow_data: Dict[str, Any]) -> str:
        """Trigger workflow N8N"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/background/integrations/n8n/trigger",
                headers=self.headers,
                json=workflow_data
            )
            
            if response.status_code == 200:
                return response.json()["task_id"]
            else:
                raise Exception(f"Failed to trigger N8N: {response.text}")

# Exemplos de uso prático

async def example_document_processing():
    """Exemplo: Processamento de documento para knowledge base"""
    print("🔄 Exemplo: Processamento de Documento")
    
    client = BackgroundTasksClient(API_BASE_URL, AUTH_TOKEN)
    
    # Simular upload de documento
    document_content = """
    Este é um exemplo de documento que será processado.
    O sistema irá dividir em chunks, gerar embeddings e armazenar no banco.
    Isso permite busca semântica eficiente na base de conhecimento.
    """
    
    # Submeter processamento
    task_id = await client.submit_document_processing(
        document_id="example_doc_001",
        content=document_content
    )
    
    print(f"✅ Task submetida: {task_id}")
    
    # Monitorar progresso
    async def progress_callback(data):
        progress = data.get('progress', 0)
        status = data.get('status')
        print(f"📊 {status}: {progress:.1%}")
    
    await client.monitor_task_progress(task_id, progress_callback)
    
    # Verificar resultado final
    final_status = await client.get_task_status(task_id)
    print(f"🎯 Resultado final: {final_status['status']}")
    
    return task_id

async def example_webhook_onboarding():
    """Exemplo: Webhook para onboarding de usuário"""
    print("🔄 Exemplo: Webhook de Onboarding")
    
    client = BackgroundTasksClient(API_BASE_URL, AUTH_TOKEN)
    
    # Dados do novo usuário
    user_data = {
        "event": "user.created",
        "data": {
            "user_id": "user_12345",
            "email": "novo@usuario.com",
            "name": "Novo Usuário",
            "plan": "pro",
            "onboarding_step": 1
        },
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Submeter webhook para N8N
    task_id = await client.submit_webhook_delivery(
        webhook_url="https://primary-em-atividade.up.railway.app/webhook/user-registration",
        data=user_data
    )
    
    print(f"✅ Webhook submetido: {task_id}")
    
    # Aguardar conclusão
    while True:
        status = await client.get_task_status(task_id)
        print(f"📊 Status: {status['status']} - Progress: {status.get('progress', 0):.1%}")
        
        if status['status'] in ['completed', 'failed']:
            break
        
        await asyncio.sleep(1)
    
    return task_id

async def example_bulk_document_processing():
    """Exemplo: Processamento em lote de documentos"""
    print("🔄 Exemplo: Processamento em Lote")
    
    client = BackgroundTasksClient(API_BASE_URL, AUTH_TOKEN)
    
    # Simular múltiplos documentos
    documents = [
        {
            "id": f"doc_{i:03d}",
            "content": f"Documento {i} com conteúdo específico para teste de processamento em lote."
        }
        for i in range(1, 6)
    ]
    
    # Submeter processamento em lote
    async with httpx.AsyncClient() as http_client:
        response = await http_client.post(
            f"{API_BASE_URL}/api/background/integrations/knowledge/process-bulk",
            headers=client.headers,
            json=documents
        )
        
        if response.status_code == 200:
            result = response.json()
            task_ids = result["task_ids"]
            print(f"✅ {len(task_ids)} tasks submetidas em lote")
        else:
            raise Exception(f"Failed bulk submission: {response.text}")
    
    # Monitorar todas as tasks
    completed_count = 0
    while completed_count < len(task_ids):
        completed_count = 0
        
        for task_id in task_ids:
            status = await client.get_task_status(task_id)
            if status['status'] in ['completed', 'failed']:
                completed_count += 1
        
        print(f"📊 Progresso do lote: {completed_count}/{len(task_ids)} concluídas")
        
        if completed_count < len(task_ids):
            await asyncio.sleep(2)
    
    print("🎯 Processamento em lote concluído!")
    return task_ids

async def example_n8n_automation():
    """Exemplo: Automação completa com N8N"""
    print("🔄 Exemplo: Automação N8N")
    
    client = BackgroundTasksClient(API_BASE_URL, AUTH_TOKEN)
    
    # Dados para trigger do workflow
    automation_data = {
        "trigger_type": "agent_created",
        "agent_data": {
            "agent_id": "agent_789",
            "name": "Agente de Vendas",
            "organization_id": "org_123",
            "created_by": "user_456"
        },
        "automation_config": {
            "send_welcome_email": True,
            "setup_webhook": True,
            "create_analytics_dashboard": True
        }
    }
    
    # Trigger workflow
    task_id = await client.trigger_n8n_workflow(automation_data)
    print(f"✅ Automação N8N disparada: {task_id}")
    
    # Monitorar execução
    await client.monitor_task_progress(task_id)
    
    return task_id

async def example_error_handling():
    """Exemplo: Tratamento de erros e retry"""
    print("🔄 Exemplo: Tratamento de Erros")
    
    client = BackgroundTasksClient(API_BASE_URL, AUTH_TOKEN)
    
    # Submeter webhook para URL inválida (vai falhar)
    try:
        task_id = await client.submit_webhook_delivery(
            webhook_url="https://url-inexistente-que-vai-falhar.com/webhook",
            data={"test": "error_handling"}
        )
        
        print(f"✅ Task de teste submetida: {task_id}")
        
        # Monitorar tentativas de retry
        retry_count = 0
        while True:
            status = await client.get_task_status(task_id)
            
            if status['retry_count'] > retry_count:
                retry_count = status['retry_count']
                print(f"🔄 Tentativa {retry_count}: {status['status']}")
            
            if status['status'] == 'failed':
                print(f"❌ Task falhou após {retry_count} tentativas")
                print(f"Erro: {status.get('error', {}).get('message', 'Unknown error')}")
                break
            elif status['status'] == 'completed':
                print(f"✅ Task completada (não esperado neste exemplo)")
                break
            
            await asyncio.sleep(2)
    
    except Exception as e:
        print(f"❌ Erro ao submeter task: {e}")
    
    return task_id

async def example_analytics_scheduling():
    """Exemplo: Agendamento de analytics"""
    print("🔄 Exemplo: Analytics Agendadas")
    
    client = BackgroundTasksClient(API_BASE_URL, AUTH_TOKEN)
    
    # Agendar processamento diário
    async with httpx.AsyncClient() as http_client:
        response = await http_client.post(
            f"{API_BASE_URL}/api/background/integrations/analytics/schedule-daily",
            headers=client.headers
        )
        
        if response.status_code == 200:
            result = response.json()
            task_id = result["task_id"]
            print(f"✅ Analytics diárias agendadas: {task_id}")
            print(f"📅 Próxima execução: {result['scheduled_for']}")
        else:
            raise Exception(f"Failed to schedule analytics: {response.text}")
    
    return task_id

async def example_queue_monitoring():
    """Exemplo: Monitoramento das filas"""
    print("🔄 Exemplo: Monitoramento de Filas")
    
    # Verificar estatísticas das filas (requer admin)
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/api/background/queue/stats",
            headers={
                "Authorization": f"Bearer {AUTH_TOKEN}",
                "Content-Type": "application/json"
            }
        )
        
        if response.status_code == 200:
            stats = response.json()
            print("📊 Estatísticas das Filas:")
            
            for priority, queue_stats in stats["queues"].items():
                print(f"  {priority.upper()}:")
                print(f"    Pendentes: {queue_stats['pending']}")
                print(f"    Executando: {queue_stats['running']}")
                print(f"    Retry: {queue_stats['retrying']}")
            
            print(f"\n📈 Totais:")
            print(f"  Pendentes: {stats['total_pending']}")
            print(f"  Executando: {stats['total_running']}")
            print(f"  Tentando novamente: {stats['total_retrying']}")
        else:
            print(f"❌ Erro ao obter estatísticas: {response.text}")

# Função principal para executar exemplos
async def main():
    """Executa todos os exemplos"""
    print("🚀 Iniciando Exemplos de Background Tasks\n")
    
    examples = [
        ("Processamento de Documento", example_document_processing),
        ("Webhook de Onboarding", example_webhook_onboarding),
        ("Processamento em Lote", example_bulk_document_processing),
        ("Automação N8N", example_n8n_automation),
        ("Tratamento de Erros", example_error_handling),
        ("Analytics Agendadas", example_analytics_scheduling),
        ("Monitoramento de Filas", example_queue_monitoring),
    ]
    
    results = {}
    
    for name, example_func in examples:
        print(f"\n{'='*50}")
        print(f"🔧 Executando: {name}")
        print(f"{'='*50}")
        
        try:
            result = await example_func()
            results[name] = result
            print(f"✅ {name} executado com sucesso!")
        except Exception as e:
            print(f"❌ Erro em {name}: {e}")
            results[name] = f"Error: {e}"
        
        # Pausa entre exemplos
        await asyncio.sleep(2)
    
    print(f"\n{'='*50}")
    print("📋 Resumo dos Resultados:")
    print(f"{'='*50}")
    
    for name, result in results.items():
        status = "✅" if not str(result).startswith("Error") else "❌"
        print(f"{status} {name}: {result}")
    
    print(f"\n🎯 Exemplos concluídos!")

if __name__ == "__main__":
    # Configurar para desenvolvimento
    import os
    
    # Usar variáveis de ambiente se disponíveis
    API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
    AUTH_TOKEN = os.getenv("AUTH_TOKEN", "your-jwt-token-here")
    
    print(f"🔧 Configuração:")
    print(f"  API URL: {API_BASE_URL}")
    print(f"  Auth Token: {'*' * (len(AUTH_TOKEN) - 4) + AUTH_TOKEN[-4:] if len(AUTH_TOKEN) > 4 else '****'}")
    
    # Executar exemplos
    asyncio.run(main())