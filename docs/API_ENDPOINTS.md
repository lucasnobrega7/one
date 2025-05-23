# 🚀 API Endpoints - Agentes de Conversão

**Versão**: 1.1.0  
**Data**: 23/05/2025  
**Base URL**: `https://api.agentesdeconversao.com.br`

## 🔐 Autenticação

Todos os endpoints requerem autenticação via NextAuth v5. Inclua o token de sessão no header:

```bash
Authorization: Bearer <session-token>
```

## 📋 Endpoints Principais

### 🤖 Agentes

#### `GET /api/agents`
Lista todos os agentes do usuário.

**Resposta**:
```json
[
  {
    "id": "uuid",
    "name": "Agente de Vendas",
    "description": "Especialista em conversão",
    "system_prompt": "Você é um especialista...",
    "model_id": "gpt-4",
    "temperature": 0.7,
    "knowledge_base_id": "uuid",
    "created_at": "2025-05-23T10:00:00Z"
  }
]
```

#### `POST /api/agents`
Cria um novo agente.

**Body**:
```json
{
  "name": "Nome do Agente",
  "description": "Descrição",
  "systemPrompt": "Prompt do sistema",
  "modelId": "gpt-4",
  "temperature": 0.7,
  "useKnowledgeBase": true,
  "knowledgeBaseId": "uuid"
}
```

#### `PUT /api/agents`
Atualiza um agente existente.

#### `DELETE /api/agents?id=uuid`
Remove um agente.

#### `GET /api/agents/[id]`
Busca um agente específico.

### 💬 Chat

#### `POST /api/chat`
Envia uma mensagem para o agente.

**Body**:
```json
{
  "message": "Olá, como posso ajudar?",
  "conversationId": "uuid", // opcional
  "agentId": "uuid"
}
```

**Resposta**:
```json
{
  "conversationId": "uuid",
  "message": "Resposta do agente"
}
```

#### `GET /api/chat?conversationId=uuid`
Busca mensagens de uma conversa.

#### `POST /api/agents/[id]/chat/stream`
**🆕 Novo!** Chat com streaming em tempo real.

**Body**:
```json
{
  "message": "Sua mensagem",
  "conversationId": "uuid", // opcional
  "temperature": 0.7,
  "maxTokens": 2048
}
```

**Resposta**: Stream de texto em tempo real.

### 🗄️ Conversações

#### `GET /api/conversations`
Lista todas as conversações do usuário.

### 📚 Base de Conhecimento

#### `GET /api/knowledge`
Lista bases de conhecimento do usuário.

#### `POST /api/knowledge/upload`
Faz upload de documentos para a base de conhecimento.

**FormData**:
- `file`: Arquivo (PDF, TXT, DOCX)
- `knowledgeBaseId`: UUID da base

#### `POST /api/knowledge/search`
**🆕 Novo!** Busca semântica na base de conhecimento.

**Body**:
```json
{
  "query": "Como configurar webhooks?",
  "knowledgeBaseId": "uuid",
  "topK": 5,
  "threshold": 0.7
}
```

**Resposta**:
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "documento.pdf",
      "content": "Conteúdo relevante...",
      "score": 0.95,
      "relevantChunk": "Trecho relevante..."
    }
  ],
  "query": "Como configurar webhooks?",
  "totalResults": 3
}
```

### 📊 Analytics

#### `GET /api/analytics?period=30&agentId=uuid`
**🆕 Novo!** Métricas detalhadas e analytics.

**Parâmetros**:
- `period`: Período em dias (padrão: 30)
- `agentId`: ID do agente (opcional)

**Resposta**:
```json
{
  "overview": {
    "totalAgents": 5,
    "totalConversations": 150,
    "totalMessages": 1200,
    "avgMessagesPerConversation": 8,
    "activeConversations": 23
  },
  "timeSeries": [
    {
      "date": "2025-05-23",
      "conversations": 12,
      "messages": 95
    }
  ],
  "topAgents": [
    {
      "id": "uuid",
      "name": "Agente de Vendas",
      "conversations": 45,
      "messages": 380
    }
  ]
}
```

#### `POST /api/analytics`
Registra eventos personalizados para analytics.

### ⚙️ Configurações

#### `GET /api/settings`
**🆕 Novo!** Busca configurações do usuário.

**Resposta**:
```json
{
  "settings": {
    "theme": "dark",
    "language": "pt-br",
    "email_notifications": true,
    "default_model": "gpt-4",
    "default_temperature": 0.7,
    "max_tokens": 2048
  },
  "usage": {
    "totalRequests": 1250,
    "totalTokens": 450000,
    "remainingQuota": 750
  }
}
```

#### `PUT /api/settings`
Atualiza configurações do usuário.

#### `DELETE /api/settings?action=reset_settings`
Reset configurações ou limpar dados.

### 🔗 Webhooks

#### `GET /api/webhooks`
**🆕 Novo!** Lista webhooks do usuário.

#### `POST /api/webhooks`
Cria um novo webhook.

**Body**:
```json
{
  "name": "Webhook Vendas",
  "url": "https://api.exemplo.com/webhook",
  "events": ["conversation.created", "message.created"],
  "secret": "webhook-secret"
}
```

#### `PUT /api/webhooks`
Atualiza webhook existente.

#### `DELETE /api/webhooks?id=uuid`
Remove webhook.

### 🧠 Modelos

#### `GET /api/models?provider=openai&category=chat`
**🆕 Novo!** Lista modelos IA disponíveis.

**Resposta**:
```json
{
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "openai",
      "category": "chat",
      "description": "Modelo mais avançado da OpenAI",
      "maxTokens": 8192,
      "costPer1kTokens": 0.03,
      "features": ["reasoning", "coding", "creative_writing"],
      "isAvailable": true
    }
  ],
  "stats": {
    "totalModels": 12,
    "availableModels": 10,
    "providers": ["openai", "anthropic", "google"]
  }
}
```

#### `POST /api/models`
Testa um modelo com prompt específico.

#### `PUT /api/models`
Configura parâmetros personalizados para um modelo.

## 🔧 Utilitários

### `GET /api/health`
Health check da API.

### `GET /api/check-env`
Verifica configuração de variáveis de ambiente.

### `GET /api/auth/health`
Verifica status da autenticação.

## 📝 Notas de Implementação

### Novidades da v1.1.0

1. **Streaming de Chat**: Respostas em tempo real via Server-Sent Events
2. **Busca Semântica**: RAG implementado para bases de conhecimento
3. **Analytics Avançados**: Métricas detalhadas com séries temporais
4. **Webhooks**: Sistema completo de notificações
5. **Configurações**: Painel avançado de configurações
6. **Catálogo de Modelos**: Gerenciamento centralizado de modelos IA

### Autenticação

- Migrado para NextAuth v5
- Compatível com Google OAuth e Credentials
- Sessões JWT seguras

### Segurança

- Todos os endpoints validam autorização
- Rate limiting implementado
- Sanitização de dados de entrada
- Assinaturas de webhook com HMAC-SHA256

### Performance

- Cache Redis para operações frequentes
- Streaming para respostas longas
- Queries otimizadas no Supabase
- Build otimizado (98% das funcionalidades prontas)

---

**🚀 Status**: Production Ready  
**📈 Progresso**: 98% Completo  
**🔄 Próximo**: Integração Flowise