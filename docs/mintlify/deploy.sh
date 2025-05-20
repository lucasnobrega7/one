#!/bin/bash

# Script para fazer o commit e deploy da documentação Mintlify

echo "🚀 Iniciando deploy da documentação Mintlify para docs.agentesdeconversao.com.br"

# Verificar se há mudanças para commit
git add .
git status

echo "📝 Alterações acima serão enviadas para o repositório"
read -p "Pressione Enter para continuar ou Ctrl+C para cancelar..."

# Fazer commit das alterações
git commit -m "Atualização da documentação Mintlify"

# Enviar para o repositório
git push origin main

echo "✅ Documentação enviada para o repositório."
echo "O deploy será feito automaticamente pelo Mintlify Cloud."
echo "Acesse a documentação em: https://docs.agentesdeconversao.com.br"