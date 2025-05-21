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

# Listar serviços disponíveis
echo "Listando serviços do projeto..."
PROJECT_INFO=$(railway project info 2>&1)
echo "$PROJECT_INFO"

# Extrair lista de serviços
SERVICES=$(echo "$PROJECT_INFO" | grep -oP '(?<=SERVICES\n)[\s\S]*?(?=\n\n|$)' | grep -v '^\s*$')
SERVICE_COUNT=$(echo "$SERVICES" | wc -l)

# Se não existir serviço, criar um novo
if [ -z "$SERVICES" ]; then
    echo "Nenhum serviço encontrado. Criando serviço 'api'..."
    # Como não podemos criar via CLI de forma não interativa, sugerimos como criar
    echo "Por favor, crie um serviço manualmente no dashboard do Railway"
    echo "Ou execute 'railway service' interativamente para selecionar um serviço"
    echo "Depois, execute este script novamente especificando o serviço"
    exit 1
fi

# Se houver apenas um serviço, usá-lo automaticamente
if [ $(echo "$SERVICES" | wc -l) -eq 1 ]; then
    SERVICE_NAME=$(echo "$SERVICES" | awk '{print $1}')
    echo "Usando serviço: $SERVICE_NAME"

    # Linkar com o serviço
    echo "Linkando ao serviço $SERVICE_NAME..."
    railway service "$SERVICE_NAME" || true

    # Fazer deploy da aplicação
    echo "Fazendo deploy da aplicação..."
    railway up --service "$SERVICE_NAME"

    # Configurar variáveis de ambiente LLM se necessário
    if [ ! -z "$ANTHROPIC_API_KEY" ]
    then
        echo "Configurando API key do Anthropic..."
        railway variables set ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY --service "$SERVICE_NAME"
    fi

    # Mostrar status da aplicação
    echo "Deploy concluído. Status da aplicação:"
    railway status

    echo "Aplicação disponível em:"
    railway domain --service "$SERVICE_NAME"
else
    echo "Múltiplos serviços encontrados. Por favor, especifique um serviço usando:"
    echo "railway service <nome-do-serviço>"
    echo "Serviços disponíveis:"
    echo "$SERVICES"
    exit 1
fi

echo "Deploy finalizado com sucesso!"