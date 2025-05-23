#!/bin/bash

# 🔗 Setup Prisma com Supabase
# Script para configurar Prisma antes do deploy

echo "🔗 Configurando Prisma com Supabase..."

# Instalar dependências do Prisma
echo "📦 Instalando dependências do Prisma..."
pip install prisma asyncpg

# Gerar cliente Prisma
echo "🔨 Gerando cliente Prisma..."
prisma generate

# Aplicar migrações (se necessário)
echo "🔄 Verificando migrações..."
# prisma migrate deploy  # Descomente se precisar aplicar migrações

# Verificar conexão com o banco
echo "🔍 Testando conexão com Supabase..."
python -c "
import asyncio
from prisma import Prisma

async def test_connection():
    try:
        client = Prisma()
        await client.connect()
        print('✅ Conexão com Supabase estabelecida com sucesso!')
        await client.disconnect()
    except Exception as e:
        print(f'❌ Erro na conexão: {e}')

asyncio.run(test_connection())
"

echo "✅ Setup do Prisma concluído!"
echo "🚀 Agora você pode executar: ./railway-deploy.sh"