#!/bin/bash

# Script para fazer deploy no Railway com suporte a MCP LLM

echo "Iniciando deploy do projeto no Railway..."

# Verificar se railway CLI está instalado
if ! command -v railway &> /dev/null
then
    echo "Railway CLI não está instalado. Instalando..."
    npm install -g @railway/cli
fi

# Verifica se o projeto já está linkado
if ! railway status &> /dev/null
then
    echo "Projeto não está linkado. Executando railway link..."
    railway link -p 2855002d-7e68-4a01-a3d2-26829329fe68
fi

# Fazer deploy da aplicação
echo "Fazendo deploy da aplicação..."
railway up

# Configurar variáveis de ambiente LLM se necessário
if [ ! -z "$ANTHROPIC_API_KEY" ]
then
    echo "Configurando API key do Anthropic..."
    railway variables set ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
fi

# Mostrar status da aplicação
echo "Deploy concluído. Status da aplicação:"
railway status

echo "Aplicação disponível em:"
railway domain

echo "Deploy finalizado com sucesso!"