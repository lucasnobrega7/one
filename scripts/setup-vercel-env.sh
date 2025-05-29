#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel para todos os ambientes
# Este script deve ser executado com as credenciais apropriadas

echo "=== Configuração de Variáveis de Ambiente no Vercel ==="
echo "Este script configurará todas as variáveis necessárias para os ambientes Preview e Development"

# Lista de variáveis essenciais que precisam ser configuradas
VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "DATABASE_URL"
    "DIRECT_URL"
    "PRISMA_DATABASE_URL"
    "PRISMA_DIRECT_URL"
    "NEXT_PUBLIC_APP_URL"
    "NEXT_PUBLIC_LANDING_URL"
    "NEXT_PUBLIC_DASHBOARD_URL"
    "NEXT_PUBLIC_AUTH_URL"
    "NEXT_PUBLIC_DOCS_URL"
    "NEXT_PUBLIC_API_URL"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "OPENROUTER_API_KEY"
    "OPENROUTER_CHATBOT_KEY"
)

echo ""
echo "Variáveis a serem configuradas:"
for var in "${VARS[@]}"; do
    echo "  - $var"
done

echo ""
echo "IMPORTANTE: Execute os seguintes comandos para cada variável:"
echo ""

for var in "${VARS[@]}"; do
    echo "# Configure $var para Preview e Development:"
    echo "vercel env add $var preview"
    echo "vercel env add $var development"
    echo ""
done

echo "=== Instruções Adicionais ==="
echo "1. Certifique-se de ter os valores corretos de cada variável"
echo "2. Os valores podem ser obtidos do ambiente de Production ou do arquivo .env.local"
echo "3. Para variáveis com URLs de subdomínios, use o formato correto:"
echo "   - NEXT_PUBLIC_LANDING_URL=https://lp.agentesdeconversao.ai"
echo "   - NEXT_PUBLIC_DASHBOARD_URL=https://dash.agentesdeconversao.ai"
echo "   - NEXT_PUBLIC_AUTH_URL=https://login.agentesdeconversao.ai"
echo "   - NEXT_PUBLIC_DOCS_URL=https://docs.agentesdeconversao.ai"
echo "   - NEXT_PUBLIC_API_URL=https://api.agentesdeconversao.ai"
