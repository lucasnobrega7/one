#!/bin/bash

# Script para configurar MCP para Railway

echo "==== Configuração do MCP para Railway ===="
echo ""
echo "Este script vai criar um arquivo de configuração MCP para Claude."
echo ""

# Criar diretório se não existir
mkdir -p ~/.claude/

# Criar arquivo de configuração MCP
cat > ~/.claude/claude-mcp-railway.json << EOF
{
  "services": {
    "railway": {
      "projectId": "2855002d-7e68-4a01-a3d2-26829329fe68",
      "environment": "production"
    },
    "anthropic": {
      "apiKey": "seu-api-key-anthropic"
    }
  },
  "mcp": {
    "enabled": true,
    "providers": ["railway"]
  },
  "settings": {
    "autoConnect": true,
    "notifyOnConnect": true
  }
}
EOF

echo "Arquivo de configuração MCP criado em ~/.claude/claude-mcp-railway.json"
echo ""
echo "Para usar esta configuração, execute:"
echo "claude --mcp-config ~/.claude/claude-mcp-railway.json"
echo ""
echo "Ou adicione esta configuração ao seu arquivo ~/.claude/config.json:"
echo ""
cat ~/.claude/claude-mcp-railway.json
echo ""
echo "==== Fim da Configuração ===="