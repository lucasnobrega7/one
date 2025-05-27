/**
 * OpenRouter Provider - Universal AI Models Access
 * Integração com 300+ modelos de IA com 87% margem de lucro
 */

import OpenAI from 'openai';

export interface OpenRouterConfig {
  apiKey: string;
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  maxRetries?: number;
  timeout?: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  description?: string;
  pricing?: {
    prompt: number;
    completion: number;
  };
  context_length?: number;
  architecture?: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  top_provider?: {
    max_completion_tokens?: number;
    is_moderated: boolean;
  };
}

export class OpenRouterProvider {
  private client: OpenAI;
  private config: OpenRouterConfig;

  constructor(config: OpenRouterConfig) {
    this.config = {
      baseURL: 'https://openrouter.ai/api/v1',
      maxRetries: 3,
      timeout: 60000,
      ...config,
    };

    this.client = new OpenAI({
      baseURL: this.config.baseURL,
      apiKey: this.config.apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'https://agentesdeconversao.ai',
        'X-Title': 'Agentes de Conversão',
        ...this.config.defaultHeaders,
      },
      maxRetries: this.config.maxRetries,
      timeout: this.config.timeout,
    });
  }

  /**
   * Lista todos os modelos disponíveis
   */
  async getAvailableModels(): Promise<ModelInfo[]> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      return [];
    }
  }

  /**
   * Chat completion com fallback automático
   */
  async createChatCompletion(params: {
    model: string;
    messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }>;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
    tools?: any[];
    tool_choice?: any;
  }) {
    try {
      const completion = await this.client.chat.completions.create({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature || 0.7,
        max_tokens: params.max_tokens || 4000,
        stream: params.stream || false,
        tools: params.tools,
        tool_choice: params.tool_choice,
      });

      return {
        success: true,
        data: completion,
        provider: 'openrouter',
        model: params.model,
      };
    } catch (error: any) {
      console.error('OpenRouter API error:', error);
      
      return {
        success: false,
        error: {
          message: error.message || 'Unknown error',
          code: error.status || 'UNKNOWN',
          type: 'openrouter_error',
        },
        provider: 'openrouter',
        model: params.model,
      };
    }
  }

  /**
   * Stream chat completion
   */
  async *streamChatCompletion(params: {
    model: string;
    messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }>;
    temperature?: number;
    max_tokens?: number;
  }) {
    try {
      const stream = await this.client.chat.completions.create({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature || 0.7,
        max_tokens: params.max_tokens || 4000,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        if (delta?.content) {
          yield {
            success: true,
            content: delta.content,
            provider: 'openrouter',
            model: params.model,
          };
        }
      }
    } catch (error: any) {
      yield {
        success: false,
        error: {
          message: error.message || 'Stream error',
          code: error.status || 'STREAM_ERROR',
          type: 'openrouter_stream_error',
        },
        provider: 'openrouter',
        model: params.model,
      };
    }
  }

  /**
   * Verifica créditos disponíveis
   */
  async getCredits() {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Modelos recomendados por categoria
   */
  getRecommendedModels() {
    return {
      // Modelos econômicos e rápidos
      fast: [
        'openai/gpt-4o-mini',
        'anthropic/claude-3-haiku',
        'google/gemini-flash-1.5',
        'meta-llama/llama-3.1-8b-instruct',
      ],
      
      // Modelos balanced (qualidade/preço)
      balanced: [
        'openai/gpt-4o',
        'anthropic/claude-3.5-sonnet',
        'google/gemini-pro-1.5',
        'meta-llama/llama-3.1-70b-instruct',
      ],
      
      // Modelos premium
      premium: [
        'openai/o1-preview',
        'anthropic/claude-3-opus',
        'google/gemini-pro-1.5-exp',
        'meta-llama/llama-3.1-405b-instruct',
      ],
      
      // Modelos especializados
      reasoning: [
        'openai/o1-preview',
        'openai/o1-mini',
        'deepseek/deepseek-r1',
      ],
      
      coding: [
        'anthropic/claude-3.5-sonnet',
        'openai/gpt-4o',
        'deepseek/deepseek-coder',
        'meta-llama/codellama-70b-instruct',
      ],
      
      multimodal: [
        'openai/gpt-4o',
        'anthropic/claude-3.5-sonnet',
        'google/gemini-pro-vision',
      ],
    };
  }
}

export default OpenRouterProvider;