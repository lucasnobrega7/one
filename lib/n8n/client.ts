/**
 * N8N API Client
 * Cliente para integração com workflows do N8N com cache Redis
 */

import { getN8nCache } from './cache';

interface N8nConfig {
  apiKey: string;
  baseUrl: string;
}

interface N8nWorkflowRequest {
  workflowId: string;
  data?: Record<string, any>;
}

interface N8nWorkflowResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionId?: string;
}

interface N8nExecution {
  id: string;
  workflowId: string;
  mode: string;
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  finished: boolean;
  status: 'new' | 'running' | 'success' | 'error' | 'canceled' | 'waiting';
  data?: any;
}

export class N8nClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: N8nConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`N8N API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Lista todos os workflows (com cache Redis)
   */
  async getWorkflows(): Promise<N8nWorkflowResponse> {
    try {
      const cache = getN8nCache();
      
      // Verificar cache primeiro
      const cachedWorkflows = await cache.getCachedWorkflows();
      if (cachedWorkflows) {
        return {
          success: true,
          data: { data: cachedWorkflows }
        };
      }

      // Se não houver cache, buscar da API
      const data = await this.makeRequest('/workflows');
      
      // Cachear resultado por 5 minutos
      if (data?.data) {
        await cache.cacheWorkflows(data.data, 300);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Executa um workflow manualmente
   */
  async executeWorkflow({
    workflowId,
    data = {}
  }: N8nWorkflowRequest): Promise<N8nWorkflowResponse> {
    try {
      const result = await this.makeRequest(`/workflows/${workflowId}/execute`, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      return {
        success: true,
        data: result,
        executionId: result.executionId
      };
    } catch (error) {
      console.error('N8N workflow execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Ativa/Desativa um workflow
   */
  async toggleWorkflow(workflowId: string, active: boolean): Promise<N8nWorkflowResponse> {
    try {
      const result = await this.makeRequest(`/workflows/${workflowId}/activate`, {
        method: 'PATCH',
        body: JSON.stringify({ active })
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Busca execuções de um workflow
   */
  async getExecutions(workflowId?: string, limit = 20): Promise<N8nWorkflowResponse> {
    try {
      let endpoint = `/executions?limit=${limit}`;
      if (workflowId) {
        endpoint += `&workflowId=${workflowId}`;
      }

      const data = await this.makeRequest(endpoint);
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Busca uma execução específica
   */
  async getExecution(executionId: string): Promise<N8nWorkflowResponse> {
    try {
      const data = await this.makeRequest(`/executions/${executionId}`);
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Envia dados para webhook
   */
  async triggerWebhook(webhookId: string, data: any): Promise<N8nWorkflowResponse> {
    try {
      const url = `${this.baseUrl}/webhook/${webhookId}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Webhook Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Testa conexão com N8N
   */
  async testConnection(): Promise<N8nWorkflowResponse> {
    try {
      await this.makeRequest('/workflows');
      return {
        success: true,
        data: { message: 'Connection successful' }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }
}

// Singleton instance
let n8nClient: N8nClient | null = null;

export const getN8nClient = (): N8nClient => {
  if (!n8nClient) {
    const apiKey = process.env.N8N_API_KEY;
    const baseUrl = process.env.N8N_API_URL;
    
    if (!apiKey || !baseUrl) {
      throw new Error('N8N_API_KEY and N8N_API_URL environment variables are required');
    }

    n8nClient = new N8nClient({ apiKey, baseUrl });
  }

  return n8nClient;
};

export default N8nClient;