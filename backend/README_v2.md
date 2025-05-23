# Agentes de Conversão API v2.0

API avançada para criação e gerenciamento de agentes conversacionais inteligentes com streaming, ferramentas, analytics em tempo real e Server-Sent Events.

## 🚀 Novas Funcionalidades v2.0

### ✨ Streaming Chat Avançado
- **Endpoint**: `POST /api/v2/agents/{agent_id}/chat/stream`
- Streaming com eventos estruturados (progress, answer, source, metadata, done, error)
- Integração com base de conhecimento
- Suporte a contexto de conversação avançado

### 🛠️ Sistema de Ferramentas de Agente
- **CRUD completo**: `GET/POST/PUT/DELETE /api/v2/agents/{agent_id}/tools`
- 6 tipos de ferramentas suportadas:
  - `http` - Requisições HTTP
  - `search` - Busca na internet
  - `calculator` - Calculadora
  - `lead_capture` - Captura de leads
  - `form` - Formulários
  - `webhook` - Webhooks

### 📊 Analytics em Tempo Real
- **Endpoint**: `GET /api/v2/analytics/dashboard`
- Métricas avançadas com agregações
- Dados de performance em tempo real
- Análise de conversões e engajamento

### 🔄 Eventos SSE (Server-Sent Events)
- **Endpoint**: `GET /api/v2/events/dashboard`
- Stream de eventos em tempo real para dashboard
- Notificações instantâneas
- Conexões persistentes

### 🎯 Base de Conhecimento Avançada
- **Busca semântica**: `POST /api/v2/knowledge/search`
- **Upload de documentos**: `POST /api/v2/knowledge/upload`
- Suporte a múltiplos formatos de arquivo
- Indexação automática com embeddings

### 🔗 Sistema de Webhooks
- **CRUD completo**: `GET/POST/PUT/DELETE /api/v2/webhooks`
- Eventos personalizáveis
- Retry automático e logs de delivery
- Validação de assinatura

### ⚙️ Configurações Avançadas
- **Gerenciamento de modelos**: `GET/POST /api/v2/models`
- **Configurações de API**: `GET/PATCH /api/v2/settings`
- Suporte a múltiplos providers (OpenAI, Anthropic, Google, Mistral)

## 📋 Instalação e Deploy

### Dependências
```bash
pip install -r requirements.txt
```

### Variáveis de Ambiente
```bash
# Banco de Dados
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Cache
REDIS_URL=your_redis_url

# Autenticação
CLERK_WEBHOOK_SECRET=your_clerk_secret

# API Keys (opcional)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Deploy Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Deploy
./deploy.sh
```

### Execução Local
```bash
uvicorn main_v2:app --host 0.0.0.0 --port 8000 --reload
```

## 📚 Documentação da API

### Acesse a documentação interativa:
- **Swagger UI**: `https://api.agentesdeconversao.com.br/docs`
- **ReDoc**: `https://api.agentesdeconversao.com.br/redoc`

### Exemplo de Uso - Chat Streaming

```javascript
// Client-side JavaScript
const response = await fetch('/api/v2/agents/123/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token'
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Olá, preciso de ajuda' }
    ],
    context_data: {
      user_info: { name: 'João', email: 'joao@email.com' }
    }
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const event = JSON.parse(line.slice(6));
      
      switch (event.event) {
        case 'progress':
          console.log('Progress:', event.data);
          break;
        case 'answer':
          console.log('Answer chunk:', event.data);
          break;
        case 'source':
          console.log('Source:', event.data);
          break;
        case 'done':
          console.log('Completed:', event.data);
          break;
      }
    }
  }
}
```

### Exemplo de Uso - SSE Events

```javascript
// Client-side EventSource
const eventSource = new EventSource('/api/v2/events/dashboard', {
  headers: {
    'Authorization': 'Bearer your_token'
  }
});

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'conversation_started':
      console.log('Nova conversa:', data.data);
      break;
    case 'message_received':
      console.log('Nova mensagem:', data.data);
      break;
    case 'system_update':
      console.log('Atualização do sistema:', data.data);
      break;
  }
};
```

## 🏗️ Arquitetura

### Stack Tecnológico
- **FastAPI**: Framework web moderno e rápido
- **Pydantic v2**: Validação de dados e serialização
- **Supabase**: Banco de dados PostgreSQL
- **Redis**: Cache e sessões
- **SSE-Starlette**: Server-Sent Events
- **HTTPx**: Cliente HTTP assíncrono

### Estrutura de Arquivos
```
backend/
├── main_v2.py          # Aplicação principal v2.0
├── models_v2.py        # Modelos Pydantic v2.0
├── requirements.txt    # Dependências
├── Dockerfile          # Container Docker
├── railway.json        # Configuração Railway
├── deploy.sh          # Script de deploy
└── README_v2.md       # Esta documentação
```

## 🔐 Segurança

### Autenticação
- Bearer Token via Clerk
- Validação de organização
- Controle de acesso por recurso

### Rate Limiting
- Limitação por usuário/IP
- Throttling em endpoints críticos
- Proteção contra abuse

### Validação
- Schemas Pydantic rigorosos
- Sanitização de inputs
- Validação de tipos de arquivo

## 📈 Performance

### Otimizações
- Cache Redis para dados frequentes
- Conexões assíncronas
- Streaming responses
- Background tasks

### Monitoramento
- Logs estruturados
- Métricas de performance
- Health checks
- Error tracking

## 🤝 Contribuição

### Desenvolvimento
1. Clone o repositório
2. Configure as variáveis de ambiente
3. Execute `pip install -r requirements.txt`
4. Execute `uvicorn main_v2:app --reload`

### Testes
```bash
# Executar testes (quando implementados)
pytest tests/
```

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato através dos canais oficiais do projeto Agentes de Conversão.

---

**Versão**: 2.0.0  
**Última atualização**: $(date +%Y-%m-%d)  
**Status**: ✅ Produção