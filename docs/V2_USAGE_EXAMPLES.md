# 🚀 Exemplos de Uso - Agentes de Conversão v2.0

**Versão**: 2.0.0  
**Data**: 23/05/2025

Este documento fornece exemplos práticos de como usar as novas funcionalidades v2.0 do sistema.

## 📋 Índice

1. [Cliente API v2.0](#cliente-api-v20)
2. [Streaming Chat Avançado](#streaming-chat-avançado)
3. [Sistema de Ferramentas](#sistema-de-ferramentas)
4. [Analytics em Tempo Real](#analytics-em-tempo-real)
5. [Context de Onboarding](#context-de-onboarding)

---

## 🔌 Cliente API v2.0

### Configuração Básica

```typescript
import { apiClientV2 } from '@/lib/api-client-v2';

// Configurar token de autenticação
apiClientV2.setToken('your-session-token');

// Health check
const health = await apiClientV2.healthCheck();
console.log('API Status:', health.success ? 'Online' : 'Offline');
```

### Criação de Agente Avançado

```typescript
// Criar agente com ferramentas
const agentResponse = await apiClientV2.createAgent({
  name: 'Assistente de Vendas Premium',
  description: 'Agente especializado em conversão e lead capture',
  system_prompt: 'Você é um especialista em vendas...',
  model_id: 'gpt-4',
  temperature: 0.7,
  tools: [
    {
      type: 'lead_capture',
      name: 'Captura de Leads',
      config: {
        required_fields: ['name', 'email'],
        optional_fields: ['phone', 'company'],
        webhook_url: 'https://api.exemplo.com/leads'
      }
    },
    {
      type: 'search',
      name: 'Busca Web',
      config: {
        search_engine: 'google',
        max_results: 5,
        safe_search: true
      }
    }
  ]
});

if (agentResponse.success) {
  console.log('Agente criado:', agentResponse.data);
}
```

---

## 💬 Streaming Chat Avançado

### Exemplo Básico de Streaming

```typescript
import { apiClientV2 } from '@/lib/api-client-v2';

const chatWithStreaming = async (agentId: string, message: string) => {
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  setIsStreaming(true);

  await apiClientV2.chatWithStreaming(
    {
      messages: [{ role: 'user', content: message }],
      agent_id: agentId,
      streaming: true,
      context_data: {
        user_location: 'Brazil',
        session_id: 'abc123',
        page_url: window.location.href
      }
    },
    // onMessage callback
    (chunk) => {
      switch (chunk.event) {
        case 'answer':
          setResponse(prev => prev + chunk.data);
          break;
        case 'source':
          setSources(prev => [...prev, chunk.data]);
          break;
        case 'progress':
          console.log('Progress:', chunk.data.progress + '%');
          break;
        case 'metadata':
          console.log('Metadata:', chunk.data);
          break;
      }
    },
    // onComplete callback
    (data) => {
      setIsStreaming(false);
      console.log('Chat completo:', data);
    },
    // onError callback
    (error) => {
      setIsStreaming(false);
      console.error('Erro no chat:', error);
    }
  );
};
```

### Streaming com React Hook

```typescript
import { useState, useCallback } from 'react';
import { apiClientV2 } from '@/lib/api-client-v2';

export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState([]);
  const [metadata, setMetadata] = useState({});

  const sendMessage = useCallback(async (agentId: string, message: string, context?: any) => {
    setIsStreaming(true);
    setResponse('');
    setSources([]);
    setMetadata({});

    try {
      await apiClientV2.chatWithStreaming(
        {
          messages: [{ role: 'user', content: message }],
          agent_id: agentId,
          context_data: context,
          streaming: true,
        },
        (chunk) => {
          if (chunk.event === 'answer') {
            setResponse(prev => prev + chunk.data);
          } else if (chunk.event === 'source') {
            setSources(prev => [...prev, chunk.data]);
          } else if (chunk.event === 'metadata') {
            setMetadata(chunk.data);
          }
        },
        () => setIsStreaming(false),
        (error) => {
          setIsStreaming(false);
          console.error('Chat error:', error);
        }
      );
    } catch (error) {
      setIsStreaming(false);
      console.error('Failed to start chat:', error);
    }
  }, []);

  return {
    sendMessage,
    isStreaming,
    response,
    sources,
    metadata,
  };
}
```

---

## 🛠️ Sistema de Ferramentas

### Configurar Ferramenta HTTP

```typescript
// Adicionar ferramenta de API externa
const httpTool = {
  type: 'http' as const,
  name: 'Consulta CEP',
  description: 'Busca informações de endereço por CEP',
  config: {
    url: 'https://viacep.com.br/ws/{cep}/json/',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    auth_type: 'none'
  }
};

const response = await apiClientV2.request(`/api/agents/${agentId}/tools`, {
  method: 'POST',
  body: JSON.stringify(httpTool)
});
```

### Ferramenta de Lead Capture

```typescript
const leadCaptureTool = {
  type: 'lead_capture' as const,
  name: 'Captura de Leads Premium',
  config: {
    required_fields: ['name', 'email', 'phone'],
    optional_fields: ['company', 'website', 'notes'],
    webhook_url: 'https://hooks.zapier.com/hooks/catch/abc123/',
    success_message: 'Obrigado! Entraremos em contato em breve.',
    validation_rules: {
      email: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
      phone: '^\\+?[1-9]\\d{1,14}$'
    }
  }
};
```

### Listar e Gerenciar Ferramentas

```typescript
// Listar ferramentas do agente
const toolsResponse = await apiClientV2.request(`/api/agents/${agentId}/tools`);

if (toolsResponse.success) {
  const { tools, available_types } = toolsResponse.data;
  
  console.log('Ferramentas ativas:', tools);
  console.log('Tipos disponíveis:', available_types);
}

// Atualizar ferramenta
const updateResponse = await apiClientV2.request(`/api/agents/${agentId}/tools`, {
  method: 'PUT',
  body: JSON.stringify({
    toolId: 'tool-uuid',
    is_active: false,
    config: {
      // nova configuração
    }
  })
});

// Remover ferramenta
const deleteResponse = await apiClientV2.request(
  `/api/agents/${agentId}/tools?toolId=tool-uuid`,
  { method: 'DELETE' }
);
```

---

## 📊 Analytics em Tempo Real

### Conectar ao Stream de Eventos

```typescript
import { apiClientV2 } from '@/lib/api-client-v2';

const setupRealTimeAnalytics = () => {
  const eventSource = apiClientV2.createEventSource(
    '/api/events/dashboard',
    (data) => {
      switch (data.type) {
        case 'conversation_started':
          console.log('Nova conversa:', data.data);
          updateConversationsCount(prev => prev + 1);
          break;
          
        case 'message_received':
          console.log('Nova mensagem:', data.data);
          addToRecentActivity(data);
          break;
          
        case 'agent_responded':
          console.log('Agente respondeu:', data.data);
          updateResponseMetrics(data.data);
          break;
          
        case 'system_update':
          console.log('Atualização do sistema:', data.data);
          updateDashboardStats(data.data.stats);
          break;
      }
    }
  );

  // Cleanup
  return () => eventSource.close();
};
```

### Dashboard com Analytics

```typescript
import { useState, useEffect } from 'react';

export function RealTimeDashboard() {
  const [stats, setStats] = useState({
    activeConversations: 0,
    totalMessages: 0,
    responseTime: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const cleanup = setupRealTimeAnalytics();
    return cleanup;
  }, []);

  const updateDashboardStats = (newStats) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  const addToRecentActivity = (activity) => {
    setRecentActivity(prev => [activity, ...prev.slice(0, 9)]);
  };

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard 
          title="Conversas Ativas" 
          value={stats.activeConversations}
          trend="+12%"
        />
        <StatCard 
          title="Mensagens Hoje" 
          value={stats.totalMessages}
          trend="+5%"
        />
        <StatCard 
          title="Tempo de Resposta" 
          value={`${stats.responseTime}s`}
          trend="-8%"
        />
      </div>
      
      <RecentActivity activities={recentActivity} />
    </div>
  );
}
```

---

## 🎯 Context de Onboarding

### Usar o Context Avançado

```typescript
import { useAdvancedOnboarding } from '@/contexts/AdvancedOnboardingContext';

export function OnboardingStep() {
  const { state, actions } = useAdvancedOnboarding();

  const handleTestAgent = async () => {
    try {
      const result = await actions.testAgentWithStreaming(
        agentId, 
        'Como posso ajudar meus clientes?'
      );
      
      console.log('Teste concluído:', result);
      actions.completeStep(3, { test_results: result });
    } catch (error) {
      console.error('Erro no teste:', error);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>Passo {state.currentStep} de {state.totalSteps}</h2>
      
      {/* Progress Bar */}
      <ProgressBar 
        value={state.analytics.completion_rate} 
        className="mb-4"
      />
      
      {/* Real-time Response */}
      {state.streaming.isStreaming && (
        <div className="streaming-response">
          <p>{state.streaming.currentResponse}</p>
          {state.streaming.sources.length > 0 && (
            <div className="sources">
              <h4>Fontes utilizadas:</h4>
              {state.streaming.sources.map((source, i) => (
                <div key={i} className="source-item">
                  {source.source} (Score: {source.score})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Analytics Display */}
      <div className="analytics-summary">
        <span>Tempo gasto: {Math.floor(state.analytics.time_spent / 60)}m</span>
        <span>Ações realizadas: {state.analytics.actions_performed.length}</span>
        <span>Progresso: {state.analytics.completion_rate.toFixed(1)}%</span>
      </div>
      
      <button onClick={handleTestAgent}>
        Testar Agente com Streaming
      </button>
    </div>
  );
}
```

### Upload de Conhecimento com Progress

```typescript
const handleFileUpload = async (files: FileList) => {
  const { actions } = useAdvancedOnboarding();
  
  try {
    // Upload com tracking de progresso
    await actions.uploadKnowledgeBase(files);
    
    // Testar a base de conhecimento
    const testResults = await actions.testKnowledgeBase(
      datastoreId,
      'Qual o conteúdo principal dos documentos?'
    );
    
    console.log('Resultados do teste:', testResults);
    
  } catch (error) {
    console.error('Erro no upload:', error);
  }
};
```

### Configuração de Webhooks

```typescript
const setupWebhooks = async () => {
  const { actions } = useAdvancedOnboarding();
  
  try {
    await actions.configureWebhook({
      url: 'https://minha-api.com/webhook',
      events: ['conversation.created', 'message.received'],
      secret: 'webhook-secret-key'
    });
    
    actions.completeStep(5, { 
      webhook_configured: true,
      integration_type: 'custom_webhook'
    });
    
  } catch (error) {
    console.error('Erro ao configurar webhook:', error);
  }
};
```

---

## 🔧 Configurações Avançadas

### Gerenciar Configurações de Usuário

```typescript
// Buscar configurações atuais
const settingsResponse = await apiClientV2.getSettings();

if (settingsResponse.success) {
  const { settings, usage, availableModels } = settingsResponse.data;
  
  console.log('Configurações atuais:', settings);
  console.log('Uso atual:', usage);
}

// Atualizar configurações
const updateResponse = await apiClientV2.updateSettings({
  theme: 'dark',
  default_model: 'gpt-4',
  default_temperature: 0.8,
  email_notifications: true,
  advanced_features: true
});
```

### Modelos Disponíveis

```typescript
// Listar modelos por provedor
const modelsResponse = await apiClientV2.listModels({
  provider: 'openai',
  category: 'chat'
});

if (modelsResponse.success) {
  const { models, stats } = modelsResponse.data;
  
  models.forEach(model => {
    console.log(`${model.name}: ${model.costPer1kTokens} per 1K tokens`);
  });
}

// Testar modelo
const testResponse = await apiClientV2.testModel({
  modelId: 'gpt-4',
  prompt: 'Explique inteligência artificial em 100 palavras',
  temperature: 0.7,
  maxTokens: 150
});
```

---

## 🎉 Exemplos Completos

### Chat Widget Completo

```typescript
import React, { useState } from 'react';
import { useStreamingChat } from '@/hooks/useStreamingChat';

export function ChatWidget({ agentId }: { agentId: string }) {
  const [message, setMessage] = useState('');
  const { sendMessage, isStreaming, response, sources } = useStreamingChat();

  const handleSend = async () => {
    if (!message.trim()) return;
    
    await sendMessage(agentId, message, {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      page_url: window.location.href
    });
    
    setMessage('');
  };

  return (
    <div className="chat-widget">
      <div className="messages">
        {response && (
          <div className="ai-message">
            <div className="content">{response}</div>
            {sources.length > 0 && (
              <div className="sources">
                <strong>Fontes:</strong>
                {sources.map((source, i) => (
                  <span key={i} className="source-tag">
                    {source.source}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isStreaming}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend} 
          disabled={isStreaming || !message.trim()}
        >
          {isStreaming ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
```

---

## 📝 Notas Importantes

### Performance
- Use streaming para respostas longas
- Implemente debouncing em uploads
- Cache responses quando apropriado

### Segurança
- Sempre valide tokens de autenticação
- Sanitize dados de entrada
- Use HTTPS em produção

### Monitoramento
- Configure webhooks para eventos críticos
- Monitore usage via analytics
- Implemente health checks

---

**🚀 Status**: Funcionalidades v2.0 Implementadas  
**📈 Progresso**: 99% Completo  
**🔄 Próximo**: Integração Flowise