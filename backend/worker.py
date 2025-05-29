#!/usr/bin/env python3
"""
Background Task Worker
Processa tasks assíncronas em processo separado
"""

import asyncio
import logging
import signal
import sys
import os
from typing import List
from datetime import datetime, timezone

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('worker.log')
    ]
)

logger = logging.getLogger(__name__)

# Importar task manager
from core.background_tasks import task_manager, TaskPriority

class BackgroundWorker:
    """Worker para processar background tasks"""
    
    def __init__(self, queues: List[str] = None, max_concurrent_tasks: int = 10):
        self.queues = queues or [f"queue:{p.value}" for p in TaskPriority]
        self.max_concurrent_tasks = max_concurrent_tasks
        self.running = False
        self.worker_id = f"worker-{os.getpid()}"
        
    async def start(self):
        """Inicia o worker"""
        logger.info(f"🚀 Starting Background Worker {self.worker_id}")
        logger.info(f"📊 Monitoring queues: {self.queues}")
        logger.info(f"⚡ Max concurrent tasks: {self.max_concurrent_tasks}")
        
        # Inicializar task manager
        await task_manager.initialize()
        
        self.running = True
        
        # Configurar signal handlers para shutdown graceful
        signal.signal(signal.SIGTERM, self._signal_handler)
        signal.signal(signal.SIGINT, self._signal_handler)
        
        try:
            # Iniciar loop principal
            await self._worker_loop()
        except Exception as e:
            logger.error(f"❌ Worker error: {e}")
        finally:
            await self._cleanup()
    
    def _signal_handler(self, signum, frame):
        """Handler para sinais de shutdown"""
        logger.info(f"🛑 Received signal {signum}, initiating graceful shutdown...")
        self.running = False
    
    async def _worker_loop(self):
        """Loop principal do worker"""
        logger.info("✅ Worker loop started")
        
        # Estatísticas
        tasks_processed = 0
        start_time = datetime.now(timezone.utc)
        
        while self.running:
            try:
                # Verificar se há espaço para mais tasks
                active_tasks = len([t for t in task_manager.running_tasks.values() if not t.done()])
                
                if active_tasks >= self.max_concurrent_tasks:
                    logger.debug(f"⏳ Max concurrent tasks reached ({active_tasks}), waiting...")
                    await asyncio.sleep(1)
                    continue
                
                # Processar retry queue primeiro
                await task_manager._process_retry_queue()
                
                # Processar filas normais por prioridade
                task_found = False
                
                for queue in self.queues:
                    try:
                        task_id = await task_manager.redis_client.rpop(queue)
                        if task_id:
                            task_id = task_id.decode()
                            logger.info(f"📝 Processing task {task_id} from {queue}")
                            
                            # Executar task em background
                            task = asyncio.create_task(task_manager.execute_task(task_id))
                            task_manager.running_tasks[task_id] = task
                            
                            tasks_processed += 1
                            task_found = True
                            
                            # Log estatísticas a cada 10 tasks
                            if tasks_processed % 10 == 0:
                                uptime = datetime.now(timezone.utc) - start_time
                                logger.info(f"📈 Stats: {tasks_processed} tasks processed, uptime: {uptime}")
                            
                            break
                    except Exception as e:
                        logger.error(f"❌ Error processing queue {queue}: {e}")
                
                # Limpar tasks concluídas
                await task_manager._cleanup_completed_tasks()
                
                # Se não encontrou nenhuma task, aguardar um pouco
                if not task_found:
                    await asyncio.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ Error in worker loop: {e}")
                await asyncio.sleep(5)  # Aguardar mais tempo em caso de erro
        
        logger.info(f"🏁 Worker loop finished. Total tasks processed: {tasks_processed}")
    
    async def _cleanup(self):
        """Cleanup ao finalizar worker"""
        logger.info("🧹 Starting cleanup...")
        
        # Aguardar tasks em execução terminarem (até 30 segundos)
        if task_manager.running_tasks:
            logger.info(f"⏳ Waiting for {len(task_manager.running_tasks)} running tasks to complete...")
            
            # Aguardar tasks terminarem gracefully
            for i in range(30):
                active_tasks = [t for t in task_manager.running_tasks.values() if not t.done()]
                if not active_tasks:
                    break
                
                logger.info(f"⏳ {len(active_tasks)} tasks still running... ({30-i}s remaining)")
                await asyncio.sleep(1)
            
            # Cancelar tasks restantes se necessário
            active_tasks = [t for t in task_manager.running_tasks.values() if not t.done()]
            if active_tasks:
                logger.warning(f"🚫 Force cancelling {len(active_tasks)} remaining tasks")
                for task in active_tasks:
                    task.cancel()
        
        # Fechar task manager
        await task_manager.close()
        logger.info("✅ Cleanup completed")

async def main():
    """Função principal"""
    # Configurações do worker via variáveis de ambiente
    queues = None
    if os.getenv("WORKER_QUEUES"):
        queues = os.getenv("WORKER_QUEUES").split(",")
    
    max_concurrent = int(os.getenv("WORKER_MAX_CONCURRENT", "10"))
    
    # Criar e iniciar worker
    worker = BackgroundWorker(queues=queues, max_concurrent_tasks=max_concurrent)
    
    try:
        await worker.start()
    except KeyboardInterrupt:
        logger.info("🛑 Keyboard interrupt received")
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Verificar dependências
    try:
        import redis.asyncio as redis
        import httpx
        from supabase import create_client
    except ImportError as e:
        logger.error(f"❌ Missing dependency: {e}")
        sys.exit(1)
    
    # Verificar variáveis de ambiente essenciais
    required_env_vars = ["REDIS_URL", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"❌ Missing required environment variables: {missing_vars}")
        sys.exit(1)
    
    logger.info("🔧 Starting Background Task Worker...")
    
    # Executar worker
    try:
        asyncio.run(main())
    except Exception as e:
        logger.error(f"❌ Failed to start worker: {e}")
        sys.exit(1)