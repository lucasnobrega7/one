/**
 * Smart AI Client - Sistema inteligente com fallback automático
 * Integração OpenRouter (87% margem) + OpenAI (fallback)
 */

import OpenAI from 'openai';
import { OpenRouterProvider, ModelInfo } from './providers/openrouter';

export interface AIConfig {
  openrouter: {
    apiKey: string;
    enabled: boolean;
  };
  openai: {
    apiKey: string;
    enabled: boolean;
  };
  fallback: {
    enabled: boolean;
    retries: number;
  };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatParams {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  tools?: any[];
  tool_choice?: any;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code: string;
    type: string;
  };
  provider: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number;
  };
}

export class SmartAIClient {
  private openrouter?: OpenRouterProvider;
  private openai?: OpenAI;
  private config: AIConfig;
  private availableModels: ModelInfo[] = [];

  constructor(config: AIConfig) {
    this.config = config;

    // Inicializar OpenRouter (provider principal)
    if (config.openrouter.enabled && config.openrouter.apiKey) {
      this.openrouter = new OpenRouterProvider({
        apiKey: config.openrouter.apiKey,
      });
    }

    // Inicializar OpenAI (fallback)
    if (config.openai.enabled && config.openai.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }
  }

  /**
   * Carrega lista de modelos disponíveis
   */
  async loadAvailableModels(): Promise<ModelInfo[]> {
    if (this.openrouter) {
      this.availableModels = await this.openrouter.getAvailableModels();
    }
    return this.availableModels;
  }

  /**
   * Chat completion inteligente com fallback
   */
  async createChatCompletion(params: ChatParams): Promise<AIResponse> {
    const defaultModel = params.model || 'openai/gpt-4o-mini';
    
    // Tentar OpenRouter primeiro (87% margem)
    if (this.openrouter) {
      const openrouterResult = await this.openrouter.createChatCompletion({
        ...params,
        model: defaultModel,
      });

      if (openrouterResult.success) {
        return this.formatResponse(openrouterResult);
      }

      console.warn('OpenRouter failed, trying fallback:', openrouterResult.error);
    }

    // Fallback para OpenAI
    if (this.openai && this.config.fallback.enabled) {
      return await this.tryOpenAIFallback(params);
    }

    return {
      success: false,
      error: {
        message: 'No AI providers available',
        code: 'NO_PROVIDERS',
        type: 'configuration_error',
      },
      provider: 'none',
      model: defaultModel,
    };
  }

  /**
   * Stream chat completion
   */
  async *streamChatCompletion(params: ChatParams) {
    const defaultModel = params.model || 'openai/gpt-4o-mini';

    // Tentar OpenRouter stream
    if (this.openrouter) {
      try {
        const stream = this.openrouter.streamChatCompletion({
          ...params,
          model: defaultModel,
        });

        let hasYielded = false;
        for await (const chunk of stream) {
          hasYielded = true;
          yield chunk;
        }

        if (hasYielded) return;
      } catch (error) {
        console.warn('OpenRouter stream failed:', error);
      }
    }

    // Fallback stream para OpenAI
    if (this.openai && this.config.fallback.enabled) {
      yield* this.streamOpenAIFallback(params);
    }
  }

  /**
   * Fallback para OpenAI
   */
  private async tryOpenAIFallback(params: ChatParams): Promise<AIResponse> {
    if (!this.openai) {
      return {
        success: false,
        error: {
          message: 'OpenAI not configured',
          code: 'OPENAI_NOT_CONFIGURED',
          type: 'configuration_error',
        },
        provider: 'openai',
        model: params.model || 'gpt-4o-mini',
      };
    }

    try {
      // Mapear modelo OpenRouter para OpenAI
      const openaiModel = this.mapToOpenAIModel(params.model);
      
      const completion = await this.openai.chat.completions.create({
        model: openaiModel,
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
        provider: 'openai',
        model: openaiModel,
        usage: completion.usage ? {
          prompt_tokens: completion.usage.prompt_tokens,
          completion_tokens: completion.usage.completion_tokens,
          total_tokens: completion.usage.total_tokens,
        } : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'OpenAI error',
          code: error.code || 'OPENAI_ERROR',
          type: 'openai_error',
        },
        provider: 'openai',
        model: params.model || 'gpt-4o-mini',
      };
    }
  }

  /**
   * Stream fallback para OpenAI
   */
  private async *streamOpenAIFallback(params: ChatParams) {
    if (!this.openai) return;

    try {
      const openaiModel = this.mapToOpenAIModel(params.model);
      
      const stream = await this.openai.chat.completions.create({
        model: openaiModel,
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
            provider: 'openai',
            model: openaiModel,
          };
        }
      }
    } catch (error: any) {
      yield {
        success: false,
        error: {
          message: error.message || 'OpenAI stream error',
          code: error.code || 'OPENAI_STREAM_ERROR',
          type: 'openai_stream_error',
        },
        provider: 'openai',
        model: params.model || 'gpt-4o-mini',
      };
    }
  }

  /**
   * Mapeia modelo OpenRouter para OpenAI equivalente
   */
  private mapToOpenAIModel(model?: string): string {
    if (!model) return 'gpt-4o-mini';

    const modelMap: Record<string, string> = {
      'openai/gpt-4o': 'gpt-4o',
      'openai/gpt-4o-mini': 'gpt-4o-mini',
      'openai/gpt-4-turbo': 'gpt-4-turbo',
      'openai/gpt-3.5-turbo': 'gpt-3.5-turbo',
      'openai/o1-preview': 'o1-preview',
      'openai/o1-mini': 'o1-mini',
    };

    return modelMap[model] || 'gpt-4o-mini';
  }

  /**
   * Formatar resposta padronizada
   */
  private formatResponse(response: any): AIResponse {
    return {
      success: response.success,
      data: response.data,
      error: response.error,
      provider: response.provider,
      model: response.model,
      usage: response.data?.usage ? {
        prompt_tokens: response.data.usage.prompt_tokens || 0,
        completion_tokens: response.data.usage.completion_tokens || 0,
        total_tokens: response.data.usage.total_tokens || 0,
      } : undefined,
    };
  }

  /**
   * Obter modelos recomendados
   */
  getRecommendedModels() {
    if (this.openrouter) {
      return this.openrouter.getRecommendedModels();
    }

    return {
      fast: ['gpt-4o-mini'],
      balanced: ['gpt-4o'],
      premium: ['o1-preview'],
      reasoning: ['o1-preview', 'o1-mini'],
      coding: ['gpt-4o'],
      multimodal: ['gpt-4o'],
    };
  }

  /**
   * Verificar status dos providers
   */
  async getProvidersStatus() {
    const status = {
      openrouter: {
        enabled: !!this.openrouter,
        healthy: false,
        credits: null as any,
      },
      openai: {
        enabled: !!this.openai,
        healthy: false,
      },
    };

    // Testar OpenRouter
    if (this.openrouter) {
      const creditsResult = await this.openrouter.getCredits();
      status.openrouter.healthy = creditsResult.success;
      status.openrouter.credits = creditsResult.data;
    }

    // Testar OpenAI
    if (this.openai) {
      try {
        await this.openai.models.list();
        status.openai.healthy = true;
      } catch {
        status.openai.healthy = false;
      }
    }

    return status;
  }
}

export default SmartAIClient;