#!/bin/bash

# Script de Verificação e Configuração do Banco de Dados
# Este script valida a conexão com o banco de dados e configura as migrações necessárias

echo "=== Verificação da Configuração do Banco de Dados ==="

# Passo 1: Instalar Prisma CLI localmente se não estiver instalado
echo "Verificando instalação do Prisma CLI..."
if ! command -v prisma &> /dev/null; then
    echo "Instalando Prisma CLI..."
    npm install -D prisma @prisma/client
    echo "✓ Prisma CLI instalado com sucesso"
else
    echo "✓ Prisma CLI já está instalado"
fi

# Passo 2: Verificar conexão com o banco de dados
echo ""
echo "Testando conexão com o banco de dados..."
npx prisma db pull --print

# Passo 3: Executar migrações pendentes
echo ""
echo "Aplicando migrações do banco de dados..."
npx prisma migrate deploy

# Passo 4: Gerar cliente Prisma
echo ""
echo "Gerando cliente Prisma..."
npx prisma generate

# Passo 5: Validar schema
echo ""
echo "Validando schema do banco de dados..."
npx prisma validate

echo ""
echo "=== Configuração do Banco de Dados Concluída ==="
echo ""
echo "PRÓXIMOS PASSOS:"
echo "1. Certifique-se de que as variáveis DATABASE_URL e DIRECT_URL estão configuradas no Vercel"
echo "2. Verifique se o banco PostgreSQL no Railway está acessível"
echo "3. Configure as URLs de conexão para todos os ambientes (production, preview, development)"
