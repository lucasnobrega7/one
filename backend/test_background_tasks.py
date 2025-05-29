#!/usr/bin/env python3
"""
Script de teste para o Sistema de Background Tasks
Testa funcionalidades básicas e integração
"""

import asyncio
import json
import sys
import os
from datetime import datetime, timezone

# Adicionar diretório atual ao Python path
sys.path.append(os.path.dirname(__file__))

from core.background_tasks import (
    task_manager,
    TaskDefinition,
    TaskType,
    TaskPriority,
    submit_document_processing,
    submit_webhook_delivery,
    submit_n8n_sync
)

async def test_task_manager_initialization():
    """Testa inicialização do task manager"""
    print("🔧 Testando inicialização do Task Manager...")
    
    try:
        await task_manager.initialize()
        print("✅ Task Manager inicializado com sucesso")
        
        # Testar conexão Redis
        await task_manager.redis_client.ping()
        print("✅ Conexão Redis estabelecida")
        
        return True
    except Exception as e:
        print(f"❌ Erro na inicialização: {e}")
        return False

async def test_task_submission():
    """Testa submissão de tasks"""
    print("\n🔧 Testando submissão de tasks...")
    
    try:
        # Task simples
        task = TaskDefinition(
            name="Test Task",
            task_type=TaskType.WEBHOOK_DELIVERY,
            priority=TaskPriority.NORMAL,
            payload={
                "webhook_url": "https://httpbin.org/post",
                "data": {"test": "data"},
                "headers": {"User-Agent": "AgentesDeConversao/1.0"}
            },
            organization_id="test_org_123",
            user_id="test_user_456"
        )
        
        task_id = await task_manager.submit_task(task)
        print(f"✅ Task submetida: {task_id}")
        
        # Verificar se task foi salva
        task_status = await task_manager.get_task_status(task_id)
        if task_status:
            print(f"✅ Task encontrada no Redis: {task_status.status}")
        else:
            print("❌ Task não encontrada no Redis")
            return False
        
        return task_id
    except Exception as e:
        print(f"❌ Erro na submissão: {e}")
        return False

async def test_convenience_functions():
    """Testa funções de conveniência"""
    print("\n🔧 Testando funções de conveniência...")
    
    try:
        # Document processing
        doc_task_id = await submit_document_processing(
            document_id="test_doc_001",
            content="Este é um documento de teste para o sistema de background tasks.",
            organization_id="test_org_123",
            user_id="test_user_456",
            chunk_size=100
        )
        print(f"✅ Document processing task: {doc_task_id}")
        
        # Webhook delivery
        webhook_task_id = await submit_webhook_delivery(
            webhook_url="https://httpbin.org/post",
            data={"message": "Test webhook from background tasks"},
            organization_id="test_org_123"
        )
        print(f"✅ Webhook delivery task: {webhook_task_id}")
        
        # N8N sync
        n8n_task_id = await submit_n8n_sync(
            sync_type="test_sync",
            data={"test": "n8n_integration"},
            organization_id="test_org_123"
        )
        print(f"✅ N8N sync task: {n8n_task_id}")
        
        return [doc_task_id, webhook_task_id, n8n_task_id]
    except Exception as e:
        print(f"❌ Erro nas funções de conveniência: {e}")
        return []

async def test_task_execution():
    """Testa execução manual de uma task"""
    print("\n🔧 Testando execução de task...")
    
    try:
        # Criar task simples que vai funcionar
        task = TaskDefinition(
            name="Test Execution",
            task_type=TaskType.WEBHOOK_DELIVERY,
            priority=TaskPriority.HIGH,
            payload={
                "webhook_url": "https://httpbin.org/post",
                "data": {"execution_test": True, "timestamp": datetime.now(timezone.utc).isoformat()},
                "headers": {"Content-Type": "application/json"}
            },
            organization_id="test_org_123",
            user_id="test_user_456"
        )
        
        task_id = await task_manager.submit_task(task)
        print(f"✅ Task criada: {task_id}")
        
        # Executar task diretamente
        print("🔄 Executando task...")
        await task_manager.execute_task(task_id)
        
        # Verificar resultado
        final_status = await task_manager.get_task_status(task_id)
        print(f"📊 Status final: {final_status.status}")
        
        if final_status.status == "completed":
            print("✅ Task executada com sucesso!")
            if final_status.result:
                print(f"📝 Resultado: {final_status.result}")
        else:
            print(f"❌ Task falhou: {final_status.error}")
        
        return final_status.status == "completed"
    except Exception as e:
        print(f"❌ Erro na execução: {e}")
        return False

async def test_queue_operations():
    """Testa operações de fila"""
    print("\n🔧 Testando operações de fila...")
    
    try:
        # Obter estatísticas das filas
        stats = await task_manager.get_queue_stats()
        print("📊 Estatísticas das filas:")
        
        total_pending = 0
        total_running = 0
        
        for priority, queue_stats in stats.items():
            pending = queue_stats.get("pending", 0)
            running = queue_stats.get("running", 0)
            retrying = queue_stats.get("retrying", 0)
            
            total_pending += pending
            total_running += running
            
            print(f"  {priority.upper()}: {pending} pending, {running} running, {retrying} retrying")
        
        print(f"📈 Total: {total_pending} pending, {total_running} running")
        
        return True
    except Exception as e:
        print(f"❌ Erro nas operações de fila: {e}")
        return False

async def test_task_monitoring():
    """Testa monitoramento de tasks"""
    print("\n🔧 Testando monitoramento de tasks...")
    
    try:
        # Criar task que podemos monitorar
        task = TaskDefinition(
            name="Monitoring Test",
            task_type=TaskType.DOCUMENT_PROCESSING,
            priority=TaskPriority.NORMAL,
            payload={
                "document_id": "monitor_test_doc",
                "content": "Este é um documento para testar o monitoramento de progresso das background tasks.",
                "chunk_size": 50
            },
            organization_id="test_org_123",
            user_id="test_user_456"
        )
        
        task_id = await task_manager.submit_task(task)
        print(f"✅ Task de monitoramento criada: {task_id}")
        
        # Monitorar execução
        print("🔄 Iniciando execução e monitoramento...")
        
        # Executar em background
        execution_task = asyncio.create_task(task_manager.execute_task(task_id))
        
        # Monitorar progresso
        last_progress = -1
        while not execution_task.done():
            status = await task_manager.get_task_status(task_id)
            
            if status and status.progress != last_progress:
                print(f"📊 Progresso: {status.progress:.1%} - Status: {status.status}")
                last_progress = status.progress
            
            await asyncio.sleep(0.5)
        
        # Verificar resultado final
        final_status = await task_manager.get_task_status(task_id)
        print(f"🎯 Status final: {final_status.status}")
        
        if final_status.logs:
            print("📝 Últimos logs:")
            for log in final_status.logs[-3:]:  # Últimos 3 logs
                print(f"  [{log['level'].upper()}] {log['message']}")
        
        return final_status.status == "completed"
    except Exception as e:
        print(f"❌ Erro no monitoramento: {e}")
        return False

async def test_error_handling():
    """Testa tratamento de erros"""
    print("\n🔧 Testando tratamento de erros...")
    
    try:
        # Criar task que vai falhar
        task = TaskDefinition(
            name="Error Test",
            task_type=TaskType.WEBHOOK_DELIVERY,
            priority=TaskPriority.LOW,
            payload={
                "webhook_url": "https://url-inexistente-que-vai-falhar-12345.com/webhook",
                "data": {"error_test": True}
            },
            organization_id="test_org_123",
            user_id="test_user_456"
        )
        
        task_id = await task_manager.submit_task(task)
        print(f"✅ Task de erro criada: {task_id}")
        
        # Executar (vai falhar)
        await task_manager.execute_task(task_id)
        
        # Verificar que falhou corretamente
        final_status = await task_manager.get_task_status(task_id)
        
        if final_status.status in ["failed", "retrying"]:
            print(f"✅ Erro tratado corretamente: {final_status.status}")
            if final_status.error:
                print(f"📝 Mensagem de erro: {final_status.error.get('message', 'N/A')}")
            return True
        else:
            print(f"❌ Erro não tratado corretamente: {final_status.status}")
            return False
    except Exception as e:
        print(f"❌ Erro no teste de erro: {e}")
        return False

async def test_cleanup():
    """Testa limpeza de tasks antigas"""
    print("\n🔧 Testando limpeza de tasks...")
    
    try:
        # Criar algumas tasks antigas (simuladas)
        old_tasks = []
        for i in range(3):
            task = TaskDefinition(
                name=f"Old Task {i}",
                task_type=TaskType.WEBHOOK_DELIVERY,
                priority=TaskPriority.LOW,
                payload={"test": f"old_task_{i}"},
                organization_id="test_org_123",
                user_id="test_user_456"
            )
            
            task_id = await task_manager.submit_task(task)
            old_tasks.append(task_id)
        
        print(f"✅ Criadas {len(old_tasks)} tasks para teste de limpeza")
        
        # Tentar limpeza (vai encontrar 0 porque tasks são recentes)
        cleaned_count = await task_manager.cleanup_old_tasks(max_age_days=1)
        print(f"📝 Tasks limpas: {cleaned_count} (esperado 0 para tasks recentes)")
        
        return True
    except Exception as e:
        print(f"❌ Erro na limpeza: {e}")
        return False

async def run_all_tests():
    """Executa todos os testes"""
    print("🚀 Iniciando testes do Sistema de Background Tasks")
    print("=" * 60)
    
    tests = [
        ("Inicialização", test_task_manager_initialization),
        ("Submissão de Tasks", test_task_submission),
        ("Funções de Conveniência", test_convenience_functions),
        ("Execução de Tasks", test_task_execution),
        ("Operações de Fila", test_queue_operations),
        ("Monitoramento", test_task_monitoring),
        ("Tratamento de Erros", test_error_handling),
        ("Limpeza", test_cleanup),
    ]
    
    results = {}
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        
        try:
            start_time = datetime.now()
            result = await test_func()
            end_time = datetime.now()
            
            duration = (end_time - start_time).total_seconds()
            
            if result:
                print(f"✅ {test_name} PASSOU ({duration:.2f}s)")
                results[test_name] = "PASSOU"
                passed += 1
            else:
                print(f"❌ {test_name} FALHOU ({duration:.2f}s)")
                results[test_name] = "FALHOU"
                failed += 1
                
        except Exception as e:
            print(f"❌ {test_name} ERRO: {e}")
            results[test_name] = f"ERRO: {e}"
            failed += 1
    
    # Cleanup final
    try:
        await task_manager.close()
    except:
        pass
    
    # Relatório final
    print(f"\n{'='*60}")
    print(f"📊 RELATÓRIO FINAL DOS TESTES")
    print(f"{'='*60}")
    
    for test_name, result in results.items():
        status_icon = "✅" if result == "PASSOU" else "❌"
        print(f"{status_icon} {test_name}: {result}")
    
    print(f"\n📈 RESUMO:")
    print(f"  ✅ Passou: {passed}")
    print(f"  ❌ Falhou: {failed}")
    print(f"  📊 Total: {passed + failed}")
    
    success_rate = (passed / (passed + failed)) * 100 if (passed + failed) > 0 else 0
    print(f"  🎯 Taxa de Sucesso: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print(f"\n🎉 SISTEMA FUNCIONANDO CORRETAMENTE!")
        return 0
    else:
        print(f"\n⚠️  SISTEMA PRECISA DE ATENÇÃO!")
        return 1

async def main():
    """Função principal"""
    try:
        # Verificar variáveis de ambiente
        required_vars = ["REDIS_URL"]
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        
        if missing_vars:
            print(f"❌ Variáveis de ambiente obrigatórias: {missing_vars}")
            print("💡 Dica: export REDIS_URL=redis://localhost:6379")
            return 1
        
        # Executar testes
        return await run_all_tests()
        
    except KeyboardInterrupt:
        print("\n🛑 Testes interrompidos pelo usuário")
        return 1
    except Exception as e:
        print(f"\n❌ Erro fatal nos testes: {e}")
        return 1

if __name__ == "__main__":
    # Configurar logging mínimo
    import logging
    logging.basicConfig(level=logging.WARNING)
    
    # Executar testes
    exit_code = asyncio.run(main())
    sys.exit(exit_code)