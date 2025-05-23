/**
 * Cliente API v2.0 - Agentes de Conversão
 * Implementa streaming avançado, context data e ferramentas
 */

interface AdvancedChatRequest {
  messages: Array<{ role: string; content: string }>;
  agent_id?: string;
  conversation_id?: string;
  visitor_id?: string;
  streaming?: boolean;
  context_data?: Record<string, any>;
  callback_url?: string;
  temperature?: number;
  model_override?: string;
  presence_penalty?: number;
  frequency_penalty?: number;
  top_p?: number;
  system_prompt_override?: string;
  tools?: AgentTool[];
}

interface AgentTool {
  id?: string;
  type: 'http' | 'form' | 'lead_capture' | 'search' | 'calculator';
  name: string;
  config: Record<string, any>;
}

interface ConversationVariable {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object';
}

interface MessageSource {
  score: number;
  source: string;
  datasource_id: string;
  datasource_name: string;
  content_excerpt: string;
  custom_id?: string;
  tags?: string[];
}

interface StreamResponse {
  event: 'answer' | 'source' | 'metadata' | 'done' | 'error' | 'progress';
  data: any;
  conversation_id?: string;
  message_id?: string;
  timestamp?: string;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  metadata?: Record<string, any>;
}

class ApiClientV2 {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
        metadata: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // ===========================================
  // STREAMING CHAT - Funcionalidade Principal
  // ===========================================

  async chatWithStreaming(
    request: AdvancedChatRequest,
    onMessage: (chunk: StreamResponse) => void,
    onComplete: (data: any) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const controller = new AbortController();
    
    try {
      const response = await fetch(`${this.baseURL}/api/agents/${request.agent_id}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          ...request,
          streaming: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              onComplete({ 
                conversation_id: request.conversation_id,
                timestamp: new Date().toISOString()
              });
              return;
            }
            
            if (data.startsWith('[ERROR]')) {
              onError(new Error(data.slice(7)));
              return;
            }

            try {
              const parsed = JSON.parse(data) as StreamResponse;
              parsed.timestamp = new Date().toISOString();
              onMessage(parsed);
            } catch (e) {
              console.warn('Failed to parse SSE data:', data);
            }
          }
        }
      }
    } catch (error) {
      onError(error as Error);
    }
  }

  // ===========================================
  // AGENT MANAGEMENT AVANÇADO
  // ===========================================

  async createAgent(agentData: {
    name: string;
    description: string;
    system_prompt: string;
    model_id: string;
    temperature?: number;
    max_tokens?: number;
    tools?: AgentTool[];
    visibility?: 'public' | 'private';
    interface_config?: Record<string, any>;
  }): Promise<ApiResponse> {
    return this.request('/api/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async updateAgent(agentId: string, updates: Partial<{
    name: string;
    description: string;
    system_prompt: string;
    temperature: number;
    tools: AgentTool[];
    interface_config: Record<string, any>;
  }>): Promise<ApiResponse> {
    return this.request(`/api/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async listAgents(): Promise<ApiResponse> {
    return this.request('/api/agents');
  }

  async getAgent(agentId: string): Promise<ApiResponse> {
    return this.request(`/api/agents/${agentId}`);
  }

  async deleteAgent(agentId: string): Promise<ApiResponse> {
    return this.request(`/api/agents/${agentId}`, { method: 'DELETE' });
  }

  // ===========================================
  // CONVERSATION MANAGEMENT
  // ===========================================

  async getConversation(conversationId: string): Promise<ApiResponse> {
    return this.request(`/api/conversations/${conversationId}`);
  }

  async updateConversation(
    conversationId: string,
    updates: {
      status?: 'ACTIVE' | 'RESOLVED' | 'HUMAN_REQUESTED';
      priority?: 'LOW' | 'MEDIUM' | 'HIGH';
      metadata?: Record<string, any>;
      variables?: ConversationVariable[];
    }
  ): Promise<ApiResponse> {
    return this.request(`/api/conversations/${conversationId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async listConversations(filters: {
    agent_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
    
    return this.request(`/api/conversations?${params}`);
  }

  // ===========================================
  // KNOWLEDGE BASE & SEARCH
  // ===========================================

  async searchKnowledgeBase(
    knowledgeBaseId: string,
    query: string,
    options: {
      topK?: number;
      threshold?: number;
      filters?: Record<string, any>;
    } = {}
  ): Promise<ApiResponse> {
    return this.request('/api/knowledge/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        knowledgeBaseId,
        topK: options.topK || 5,
        threshold: options.threshold || 0.7,
        filters: options.filters,
      }),
    });
  }

  async uploadDocument(
    knowledgeBaseId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('knowledgeBaseId', knowledgeBaseId);

    // Para progress tracking, seria necessário usar XMLHttpRequest
    if (onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({ success: true, data: response });
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', `${this.baseURL}/api/knowledge/upload`);
        if (this.token) {
          xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
        }
        xhr.send(formData);
      });
    }

    // Fallback sem progress tracking
    return this.request('/api/knowledge/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type para FormData
    });
  }

  // ===========================================
  // ANALYTICS E MÉTRICAS
  // ===========================================

  async getAnalytics(params: {
    period?: string;
    agentId?: string;
    type?: 'usage' | 'conversations' | 'agents';
  } = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return this.request(`/api/analytics?${queryParams}`);
  }

  async trackEvent(eventData: {
    eventType: string;
    agentId?: string;
    conversationId?: string;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse> {
    return this.request('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // ===========================================
  // WEBHOOKS
  // ===========================================

  async configureWebhook(config: {
    name: string;
    url: string;
    events: string[];
    secret?: string;
    isActive?: boolean;
  }): Promise<ApiResponse> {
    return this.request('/api/webhooks', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async listWebhooks(): Promise<ApiResponse> {
    return this.request('/api/webhooks');
  }

  async updateWebhook(
    webhookId: string, 
    updates: Partial<{
      name: string;
      url: string;
      events: string[];
      isActive: boolean;
    }>
  ): Promise<ApiResponse> {
    return this.request('/api/webhooks', {
      method: 'PUT',
      body: JSON.stringify({ id: webhookId, ...updates }),
    });
  }

  async deleteWebhook(webhookId: string): Promise<ApiResponse> {
    return this.request(`/api/webhooks?id=${webhookId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================
  // CONFIGURAÇÕES
  // ===========================================

  async getSettings(): Promise<ApiResponse> {
    return this.request('/api/settings');
  }

  async updateSettings(settings: Record<string, any>): Promise<ApiResponse> {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // ===========================================
  // MODELOS IA
  // ===========================================

  async listModels(filters?: {
    provider?: string;
    category?: string;
  }): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    return this.request(`/api/models${params.toString() ? `?${params}` : ''}`);
  }

  async testModel(modelData: {
    modelId: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<ApiResponse> {
    return this.request('/api/models', {
      method: 'POST',
      body: JSON.stringify(modelData),
    });
  }

  // ===========================================
  // REAL-TIME EVENTS (SSE)
  // ===========================================

  createEventSource(endpoint: string, onMessage: (data: any) => void): EventSource {
    const url = `${this.baseURL}${endpoint}${this.token ? `?token=${this.token}` : ''}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.warn('Failed to parse SSE message:', event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return eventSource;
  }

  // ===========================================
  // HEALTH CHECK
  // ===========================================

  async healthCheck(): Promise<ApiResponse> {
    return this.request('/api/health');
  }
}

// Instância singleton para uso global
export const apiClientV2 = new ApiClientV2();

// Exports adicionais
export type {
  AdvancedChatRequest,
  AgentTool,
  ConversationVariable,
  MessageSource,
  StreamResponse,
  ApiResponse,
};

export default ApiClientV2;