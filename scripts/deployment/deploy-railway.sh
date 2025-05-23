#!/bin/bash

echo "🚀 Configurando deploy no Railway..."

# Verificar se está logado
echo "📋 Verificando login..."
railway whoami

# Verificar se as variáveis de ambiente estão corretas
echo "⚙️ Verificando variáveis de ambiente..."
if [ -f .env.local ]; then
    echo "✅ Arquivo .env.local encontrado"
    echo "📝 Variáveis principais:"
    grep -E "NEXT_PUBLIC_SUPABASE_URL|NEXTAUTH_SECRET|GOOGLE_CLIENT_ID" .env.local | head -3
else
    echo "❌ Arquivo .env.local não encontrado"
fi

# Verificar build
echo "🔨 Testando build..."
npm run build 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Build passou"
else
    echo "❌ Build falhou - verificar erros"
fi

echo ""
echo "🎯 Para fazer o deploy manual:"
echo "1. railway link -p 2855002d-7e68-4a01-a3d2-26829329fe68"
echo "2. railway up"
echo ""
echo "📋 Status atual do projeto:"
railway status