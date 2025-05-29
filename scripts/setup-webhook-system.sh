#!/bin/bash

# Script para configurar o sistema completo de webhooks
# Aplica migrations, configura triggers e initializa dados

set -e

echo "🚀 Configurando Sistema de Webhooks - Agentes de Conversão"
echo "=============================================================="

# Verificar se estamos no diretório correto
if [ ! -f "backend/core/webhooks.py" ]; then
    echo "❌ Erro: Execute este script a partir do diretório raiz do projeto"
    exit 1
fi

# Verificar variáveis de ambiente necessárias
echo "📋 Verificando variáveis de ambiente..."

required_vars=("NEXT_PUBLIC_SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Variáveis de ambiente obrigatórias não configuradas:"
    printf " - %s\n" "${missing_vars[@]}"
    echo ""
    echo "Configure essas variáveis e execute novamente:"
    echo "export NEXT_PUBLIC_SUPABASE_URL='sua-url'"
    echo "export SUPABASE_SERVICE_ROLE_KEY='sua-chave'"
    exit 1
fi

echo "✅ Variáveis de ambiente verificadas"

# Aplicar migration do banco de dados
echo ""
echo "📊 Aplicando migration do banco de dados..."

if command -v psql &> /dev/null && [ -n "$DATABASE_URL" ]; then
    echo "Aplicando via psql..."
    psql "$DATABASE_URL" -f supabase/migrations/add_webhook_triggers.sql
    echo "✅ Migration aplicada via psql"
elif command -v supabase &> /dev/null; then
    echo "Aplicando via Supabase CLI..."
    supabase db push
    echo "✅ Migration aplicada via Supabase CLI"
else
    echo "⚠️  psql ou supabase CLI não encontrados."
    echo "Por favor, aplique manualmente o arquivo:"
    echo "   supabase/migrations/add_webhook_triggers.sql"
    echo ""
    echo "Ou use a interface web do Supabase para executar o SQL."
    read -p "Pressione Enter quando a migration estiver aplicada..."
fi

# Deploy da Edge Function (se Supabase CLI estiver disponível)
echo ""
echo "⚡ Configurando Edge Functions..."

if command -v supabase &> /dev/null; then
    echo "Fazendo deploy da Edge Function webhook-processor..."
    supabase functions deploy webhook-processor
    echo "✅ Edge Function deployada"
else
    echo "⚠️  Supabase CLI não encontrado."
    echo "Por favor, faça deploy manual da Edge Function:"
    echo "   supabase/functions/webhook-processor/"
    echo ""
    echo "Ou use a interface web do Supabase."
fi

# Verificar conexão com N8N
echo ""
echo "🔗 Verificando conexão com N8N..."

N8N_URL="${N8N_WEBHOOK_URL:-https://primary-em-atividade.up.railway.app}"
if curl -s -f "$N8N_URL" > /dev/null; then
    echo "✅ N8N está acessível em: $N8N_URL"
else
    echo "⚠️  N8N não está acessível em: $N8N_URL"
    echo "Verifique se a instância N8N está rodando."
fi

# Instalar dependências Python se necessário
echo ""
echo "📦 Verificando dependências Python..."

cd backend

if [ -f "requirements.txt" ]; then
    if ! python -c "import redis, httpx, supabase" 2>/dev/null; then
        echo "Instalando dependências Python..."
        pip install -r requirements.txt
        echo "✅ Dependências instaladas"
    else
        echo "✅ Dependências já instaladas"
    fi
fi

cd ..

# Criar arquivo de configuração de exemplo
echo ""
echo "⚙️  Criando arquivo de configuração..."

cat > .env.webhooks.example << 'EOF'
# Configuração do Sistema de Webhooks

# Redis (para filas de webhook)
REDIS_URL=redis://localhost:6379

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# N8N
N8N_WEBHOOK_URL=https://primary-em-atividade.up.railway.app

# API Backend
API_BASE_URL=https://api.agentesdeconversao.com.br

# Webhook Security
WEBHOOK_SECRET=your-webhook-secret-key-here

# OpenRouter (para IA)
OPENROUTER_API_KEY=sk-or-v1-your-key-here
EOF

echo "✅ Arquivo .env.webhooks.example criado"

# Criar script de teste
echo ""
echo "🧪 Criando script de teste..."

cat > scripts/test-webhooks.py << 'EOF'
#!/usr/bin/env python3
"""
Script de teste para o sistema de webhooks
"""

import asyncio
import httpx
import json
import os
from datetime import datetime

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")

async def test_webhook_system():
    """Testa o sistema de webhooks"""
    print("🧪 Testando Sistema de Webhooks")
    print("=" * 40)
    
    async with httpx.AsyncClient() as client:
        # 1. Teste de health check
        print("\n1. Verificando health check...")
        try:
            response = await client.get(f"{API_BASE_URL}/api/webhooks/health")
            if response.status_code == 200:
                health_data = response.json()
                print(f"✅ Status: {health_data['overall_status']}")
                for service, status in health_data['services'].items():
                    print(f"   {service}: {status}")
            else:
                print(f"❌ Health check falhou: {response.status_code}")
        except Exception as e:
            print(f"❌ Erro no health check: {e}")
        
        # 2. Teste de estatísticas
        print("\n2. Verificando estatísticas...")
        try:
            response = await client.get(f"{API_BASE_URL}/api/webhooks/stats")
            if response.status_code == 200:
                stats = response.json()
                print(f"✅ Status: {stats['status']}")
                print(f"   Filas: {stats['queues']}")
                print(f"   Tasks processando: {stats['processing_tasks']}")
                print(f"   N8N: {stats['n8n_integration']}")
            else:
                print(f"❌ Estatísticas falharam: {response.status_code}")
        except Exception as e:
            print(f"❌ Erro nas estatísticas: {e}")
        
        # 3. Teste de webhook de usuário
        print("\n3. Testando webhook de usuário...")
        try:
            test_user_data = {
                "user_id": "test-user-123",
                "email": "test@example.com",
                "name": "Usuário Teste"
            }
            
            response = await client.post(
                f"{API_BASE_URL}/api/webhooks/events/user-registered",
                json=test_user_data
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Webhook enviado: {result['event_id']}")
                
                # Verificar status do evento
                event_id = result['event_id']
                await asyncio.sleep(2)  # Aguardar processamento
                
                status_response = await client.get(
                    f"{API_BASE_URL}/api/webhooks/events/{event_id}/status"
                )
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    print(f"   Status do evento: {status_data['status']}")
                else:
                    print(f"   ❌ Erro ao verificar status: {status_response.status_code}")
            else:
                print(f"❌ Webhook falhou: {response.status_code}")
                print(f"   Resposta: {response.text}")
        except Exception as e:
            print(f"❌ Erro no webhook de usuário: {e}")
        
        # 4. Teste de sincronização N8N
        print("\n4. Testando sincronização N8N...")
        try:
            sync_data = {
                "sync_type": "user-registration",
                "data": {"user_id": "test-123", "email": "test@example.com"}
            }
            
            response = await client.post(
                f"{API_BASE_URL}/api/webhooks/n8n/sync",
                json=sync_data
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Sincronização agendada: {result['task_id']}")
            else:
                print(f"❌ Sincronização falhou: {response.status_code}")
        except Exception as e:
            print(f"❌ Erro na sincronização N8N: {e}")
    
    print("\n" + "=" * 40)
    print("🏁 Teste concluído!")

if __name__ == "__main__":
    asyncio.run(test_webhook_system())
EOF

chmod +x scripts/test-webhooks.py
echo "✅ Script de teste criado: scripts/test-webhooks.py"

# Criar script de inicialização do worker
echo ""
echo "⚙️  Criando script de worker..."

cat > scripts/start-webhook-worker.py << 'EOF'
#!/usr/bin/env python3
"""
Script para iniciar o worker de webhooks
"""

import asyncio
import logging
import signal
import sys
import os

# Adicionar o diretório backend ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from core.webhooks import webhook_manager

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Flag para shutdown graceful
shutdown_flag = False

def signal_handler(signum, frame):
    global shutdown_flag
    logger.info(f"Recebido sinal {signum}, iniciando shutdown...")
    shutdown_flag = True

async def main():
    """Função principal do worker"""
    # Registrar handlers de sinal
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)
    
    logger.info("🚀 Iniciando Webhook Worker...")
    
    try:
        # Inicializar webhook manager
        await webhook_manager.initialize()
        logger.info("✅ Webhook Manager inicializado")
        
        # Iniciar worker
        logger.info("🔄 Iniciando processamento de webhooks...")
        worker_task = asyncio.create_task(webhook_manager.start_worker())
        
        # Loop principal
        while not shutdown_flag:
            await asyncio.sleep(1)
        
        # Shutdown graceful
        logger.info("🔧 Iniciando shutdown graceful...")
        worker_task.cancel()
        
        try:
            await worker_task
        except asyncio.CancelledError:
            pass
        
        await webhook_manager.close()
        logger.info("✅ Webhook Worker fechado")
        
    except Exception as e:
        logger.error(f"❌ Erro no Webhook Worker: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
EOF

chmod +x scripts/start-webhook-worker.py
echo "✅ Script de worker criado: scripts/start-webhook-worker.py"

# Resumo final
echo ""
echo "🎉 CONFIGURAÇÃO CONCLUÍDA!"
echo "========================="
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. 🔧 Configure as variáveis de ambiente:"
echo "   cp .env.webhooks.example .env"
echo "   # Edite .env com suas configurações"
echo ""
echo "2. 🏃‍♂️ Inicie o servidor FastAPI:"
echo "   cd backend"
echo "   python main.py"
echo ""
echo "3. ⚡ Inicie o webhook worker (em outro terminal):"
echo "   python scripts/start-webhook-worker.py"
echo ""
echo "4. 🧪 Teste o sistema:"
echo "   python scripts/test-webhooks.py"
echo ""
echo "5. 🌐 Acesse N8N para ativar workflows:"
echo "   https://primary-em-atividade.up.railway.app"
echo ""
echo "📚 Documentação completa em:"
echo "   docs/WEBHOOK_INTEGRATION.md"
echo ""
echo "🔍 Endpoints de monitoramento:"
echo "   GET /api/webhooks/health"
echo "   GET /api/webhooks/stats"
echo "   GET /health"
echo ""
echo "✅ Sistema de webhooks configurado e pronto para uso!"