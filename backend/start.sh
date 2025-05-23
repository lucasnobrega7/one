#!/bin/bash
# Startup script para Railway - força execução da API v2.0

echo "🚀 Starting Agentes de Conversão API v2.0..."
echo "📊 Environment: $NODE_ENV"
echo "🔌 Port: $PORT"

# Instalar dependências se necessário
pip install -r requirements.txt

# Gerar cliente Prisma
echo "🔨 Generating Prisma client..."
prisma generate

# Executar API v2.0
echo "🌟 Starting API v2.0 with main_v2.py..."
exec uvicorn main_v2:app --host 0.0.0.0 --port ${PORT:-8000}