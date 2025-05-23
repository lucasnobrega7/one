#!/bin/bash

# 🚀 DEPLOY FINAL - Agentes de Conversão API v2.0 
# Script completo com credenciais reais do Supabase

echo "🚀 Iniciando deploy da API v2.0 com credenciais reais..."

# Verificar se estamos logados no Railway
if ! railway status &> /dev/null; then
    echo "❌ Você precisa fazer login no Railway primeiro:"
    echo "   railway login"
    exit 1
fi

echo "📦 Redis já configurado!"
echo "🔍 URL Redis: redis://default:UoElIalvWkHNDCtGXgiFcNgTPglirCkW@maglev.proxy.rlwy.net:34576"

echo "🔐 Configurando variáveis de ambiente..."

# Redis Configuration
railway variables --set "REDIS_URL=redis://default:UoElIalvWkHNDCtGXgiFcNgTPglirCkW@maglev.proxy.rlwy.net:34576"

# Supabase Configuration
railway variables --set "SUPABASE_URL=https://faccixlabriqwxkxqprw.supabase.co"
railway variables --set "NEXT_PUBLIC_SUPABASE_URL=https://faccixlabriqwxkxqprw.supabase.co"
railway variables --set "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2NpeGxhYnJpcXd4a3hxcHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjcxMjIsImV4cCI6MjA2MzYwMzEyMn0.mVUCV8Zg1kw8fv6zvnp10YL5BYD04YLgbRXo1WCxP6U"
railway variables --set "SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2NpeGxhYnJpcXd4a3hxcHJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAyNzEyMiwiZXhwIjoyMDYzNjAzMTIyfQ.ZTY8KZxF_B2Isx5P4OKqRnryDSIeXGH4GK5hEX6nC7E"

# Prisma Database URLs
railway variables --set "DATABASE_URL=postgresql://postgres.faccixlabriqwxkxqprw:Alegria2025\$%@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
railway variables --set "DIRECT_URL=postgresql://postgres.faccixlabriqwxkxqprw:Alegria2025\$%@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# AI Providers (SET THESE MANUALLY IN RAILWAY DASHBOARD)
# railway variables --set "OPENAI_API_KEY=your_openai_api_key_here"
# railway variables --set "ANTHROPIC_API_KEY=your_anthropic_api_key_here"

# Production Settings
railway variables --set "NODE_ENV=production"
railway variables --set "PORT=8000"
railway variables --set "CORS_ORIGINS=https://www.agentesdeconversao.com.br,https://agentesdeconversao.com.br"

# WhatsApp Integration
railway variables --set "ZAPI_BASE_URL=https://api.z-api.io/instances"
railway variables --set "ZAPI_CLIENT_TOKEN=Fc02494ac2382436b8223b0852084f1f0S"
railway variables --set "ZAPI_INSTANCE_ID=3DC2E5A59E3BE0E1DB56FAA941CA5283"
railway variables --set "ZAPI_TOKEN=AF7015BA7C2FE1262D818563"

# Security & Monitoring
railway variables --set "LOG_LEVEL=INFO"
railway variables --set "ENABLE_METRICS=true"
railway variables --set "ALLOWED_HOSTS=*.agentesdeconversao.com.br,*.railway.app,localhost"

echo "✅ Variáveis configuradas!"

echo "🔄 Iniciando deploy..."
railway up

echo "🎉 Deploy concluído!"
echo "📱 URL da API: https://api.agentesdeconversao.com.br"
echo "📚 Docs: https://api.agentesdeconversao.com.br/docs"
echo "🔄 Para conectar domínio customizado:"
echo "   railway domain add api.agentesdeconversao.com.br"