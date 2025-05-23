# 🚀 INSTRUÇÕES DE DEPLOY - API v2.0

## ✅ **Credenciais Configuradas**

Todas as credenciais reais do Supabase foram configuradas:

- **Supabase URL**: `https://faccixlabriqwxkxqprw.supabase.co`
- **Database URL**: Connection pooling configurado
- **API Keys**: OpenAI e Anthropic configuradas
- **WhatsApp**: Z-API configurado

## 🔧 **1. Setup Local (Opcional)**

```bash
# Configurar Prisma localmente
./setup-prisma.sh
```

## 🚀 **2. Deploy no Railway**

```bash
# Fazer login no Railway (se ainda não estiver logado)
railway login

# Executar deploy completo
./railway-deploy.sh
```

## 🌐 **3. Configurar Domínio Customizado**

Após o deploy, configure o domínio:

```bash
# Adicionar domínio customizado
railway domain add api.agentesdeconversao.com.br
```

## 📋 **4. Verificar Deploy**

Teste os endpoints:

- **Health Check**: `GET https://api.agentesdeconversao.com.br/`
- **Documentação**: `GET https://api.agentesdeconversao.com.br/docs`
- **Modelos**: `GET https://api.agentesdeconversao.com.br/api/v2/models`

## 🔍 **5. Testar API**

```bash
# Executar testes automatizados
python test_api_v2.py https://api.agentesdeconversao.com.br
```

## 📊 **Features Disponíveis**

### ✅ **Endpoints Principais**

- `POST /api/v2/agents/{id}/chat/stream` - Chat streaming
- `GET /api/v2/events/dashboard` - SSE eventos
- `GET/POST /api/v2/agents/{id}/tools` - Ferramentas
- `GET /api/v2/analytics/dashboard` - Analytics
- `POST /api/v2/knowledge/search` - Base conhecimento
- `GET/POST /api/v2/webhooks` - Webhooks

### ✅ **Tecnologias Integradas**

- **FastAPI v2.0** com SSE otimizado
- **Prisma** com connection pooling
- **Redis** para cache e sessões
- **Supabase** PostgreSQL
- **Thread-safe** SSE generators

## 🔐 **Variáveis de Ambiente**

Todas configuradas automaticamente pelo script:

```env
SUPABASE_URL=https://faccixlabriqwxkxqprw.supabase.co
DATABASE_URL=postgresql://postgres.faccixlabriqwxkxqprw:Alegria2025$%@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
OPENAI_API_KEY=sk-svcacct...
ANTHROPIC_API_KEY=sk-ant-api03...
```

## 🆘 **Troubleshooting**

### Erro de Conexão Prisma
```bash
# Regenerar cliente Prisma
prisma generate
```

### Erro Redis
```bash
# Verificar addon Redis no Railway
railway status
```

### Erro CORS
```bash
# Verificar CORS_ORIGINS
railway variables get CORS_ORIGINS
```

---

**🎯 Status**: ✅ **PRONTO PARA PRODUÇÃO**

**🌐 URL Final**: `https://api.agentesdeconversao.com.br`