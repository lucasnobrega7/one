#!/bin/bash

# Deploy script for Agentes de Conversão API v2.0
# Railway deployment

echo "🚀 Iniciando deploy da API v2.0 para Railway..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado. Instale com: npm install -g @railway/cli"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "main_v2.py" ]; then
    echo "❌ Arquivo main_v2.py não encontrado. Execute este script no diretório backend/"
    exit 1
fi

echo "📋 Verificando arquivos necessários..."

# Check required files
required_files=("main_v2.py" "models_v2.py" "requirements.txt" "railway.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Arquivo necessário não encontrado: $file"
        exit 1
    fi
    echo "✅ $file encontrado"
done

echo "🔧 Configurando variáveis de ambiente..."

# Check for environment variables
if [ -z "$SUPABASE_URL" ]; then
    echo "⚠️  SUPABASE_URL não configurado"
fi

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "⚠️  SUPABASE_SERVICE_KEY não configurado"
fi

if [ -z "$REDIS_URL" ]; then
    echo "⚠️  REDIS_URL não configurado"
fi

echo "📦 Iniciando deploy..."

# Login to Railway (if not already logged in)
railway login

# Deploy to Railway
railway up

echo "✅ Deploy concluído!"
echo "🌐 API v2.0 disponível em: https://api.agentesdeconversao.com.br"
echo "📚 Documentação: https://api.agentesdeconversao.com.br/docs"