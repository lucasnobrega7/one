# Integração Railway MCP para LLMs

Este documento descreve como configurar e utilizar a integração entre Railway e o Claude Model Control Protocol (MCP) para Large Language Models (LLMs).

## 🚀 Início Rápido

1. Link com o projeto Railway:
   ```
   railway link -p 2855002d-7e68-4a01-a3d2-26829329fe68
   ```

2. Executar o gerenciador de MCP:
   ```
   node railway-mcp-manager.js
   ```

3. Fazer deploy com suporte a MCP:
   ```
   ./railway-deploy.sh
   ```

## 📋 Configuração

O arquivo `railway-mcp-config.json` contém as configurações para a integração MCP:

```json
{
  "llm": {
    "provider": "anthropic",
    "model": "claude-3-sonnet-20240229",
    "apiKey": "${ANTHROPIC_API_KEY}"
  },
  "railway": {
    "project": "api-oficial",
    "environment": "production"
  }
}
```

## 🔧 Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Railway:

- `ANTHROPIC_API_KEY`: Chave API do Anthropic
- `SUPABASE_URL`: URL do Supabase
- `SUPABASE_SERVICE_KEY`: Chave de serviço do Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: URL pública do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `REDIS_URL`: URL de conexão Redis
- `ALLOWED_ORIGINS`: Origens permitidas para CORS (separadas por vírgula)
- `CLERK_WEBHOOK_SECRET`: Segredo para webhooks do Clerk

## 📚 Templates LLM

O Railway oferece diversos templates para deployments de LLM:

1. **AnythingLLM**
   - Aplicação full-stack para RAG e agentes
   - [Template Link](https://railway.com/template/HNSCS1)

2. **Langfuse v3**
   - Plataforma de observabilidade para LLMs
   - [Documentação](https://langfuse.com/self-hosting/railway)

3. **Letta Server**
   - Servidor LLM versátil com suporte multi-provider
   - [Template Link](https://railway.com/template/jgUR1t)

## 🔄 Ciclo de Desenvolvimento

1. **Local**: Inicie e teste o MCP localmente:
   ```
   export CLAUDE_API_KEY=<your-key>
   npm run start:mcp
   ```

2. **Staging**: Teste em ambiente de staging:
   ```
   railway link -e staging
   railway up
   ```

3. **Produção**: Faça deploy em produção:
   ```
   railway link -e production
   railway up
   ```

## 📊 Monitoramento

Monitore os logs e performance da sua aplicação MCP:

```
railway logs
```

## 🆘 Solução de Problemas

Se encontrar problemas com o MCP:

1. Verifique o status do Railway:
   ```
   railway status
   ```

2. Verifique as variáveis de ambiente:
   ```
   railway variables
   ```

3. Reinicie o serviço:
   ```
   railway service restart
   ```

---

Esta documentação foi criada com o suporte do Claude a partir de [https://context7.com/railwayapp/docs/llms.txt](https://context7.com/railwayapp/docs/llms.txt).