#!/bin/bash

echo "🚀 Corrigindo deployment do Railway..."

# 1. Verificar se o backend está linkado corretamente
echo "📋 1. Verificando serviços Railway..."
cd backend
railway service

echo "📋 2. Verificando variáveis de ambiente..."
railway variables

echo "📋 3. Verificando status do deployment..."
railway status

echo "📋 4. Fazendo redeploy do backend..."
railway up

echo "📋 5. Configurando domínio customizado..."
echo "Para configurar o domínio customizado:"
echo "1. Acesse: https://railway.app/project/fcda25f6-a7e8-4746-bf1e-2d7aa7091137"
echo "2. Vá em Settings > Networking > Custom Domain"
echo "3. Adicione: api.agentesdeconversao.ai"
echo "4. Aguarde a configuração do SSL"

echo "✅ Script de correção concluído!"