/**
 * Hook para integração com Backend AI
 * Conecta frontend com API backend que usa OpenRouter
 */

import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.agentesdeconversao.ai';

export interface BackendChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface BackendChatRequest {
  messages: BackendChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  tools?: any[];
}

export interface BackendChatResponse {
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
  };
  cost_analysis?: {
    openai_estimated_cost: number;
    openrouter_cost: number;
    savings: number;
    savings_percent: number;
    profit_margin: number;
  };
}

export interface BackendModelInfo {
  id: string;
  name: string;
  description?: string;
  pricing?: {
    prompt: number;
    completion: number;
  };
  context_length?: number;
  supports_tools: boolean;
  supports_vision: boolean;
  category: string;
}

export interface BackendProvidersStatus {
  openrouter: {
    enabled: boolean;
    healthy: boolean;
    credits?: any;
  };
  openai: {
    enabled: boolean;
    healthy: boolean;
  };
}

/**
 * Hook principal para integração com backend AI
 */
export function useBackendAI() {
  const [models, setModels] = useState<BackendModelInfo[]>([]);
  const [status, setStatus] = useState<BackendProvidersStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fazer chamada para API
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      throw new Error(err.message || 'Network error');
    }
  }, []);

  // Carregar modelos disponíveis
  const loadModels = useCallback(async (refresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await apiCall(`/api/ai/models?refresh=${refresh}`);
      setModels(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading models:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Verificar status dos providers
  const checkStatus = useCallback(async () => {
    try {
      const data = await apiCall('/api/ai/status');
      setStatus(data);
    } catch (err: any) {
      console.error('Error checking status:', err);
    }
  }, [apiCall]);

  // Enviar mensagem de chat
  const sendMessage = useCallback(async (request: BackendChatRequest): Promise<BackendChatResponse> => {
    try {
      setError(null);
      
      const response = await apiCall('/api/ai/chat/completions', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      return response;
    } catch (err: any) {
      const errorResponse: BackendChatResponse = {
        success: false,
        error: {
          message: err.message,
          code: 'FRONTEND_ERROR',
          type: 'network_error',
        },
        provider: 'none',
        model: request.model || 'unknown',
      };

      setError(err.message);
      return errorResponse;
    }
  }, [apiCall]);

  // Obter modelos recomendados
  const getRecommendedModels = useCallback(async () => {
    try {
      return await apiCall('/api/ai/models/recommended');
    } catch (err: any) {
      console.error('Error getting recommended models:', err);
      return {};
    }
  }, [apiCall]);

  // Carregar dados iniciais
  useEffect(() => {
    loadModels();
    checkStatus();
  }, [loadModels, checkStatus]);

  return {
    models,
    status,
    isLoading,
    error,
    loadModels,
    checkStatus,
    sendMessage,
    getRecommendedModels,
  };
}

/**
 * Hook para chat com estado usando backend
 */
export function useBackendChat(initialModel = 'openai/gpt-4o-mini') {
  const { sendMessage, error } = useBackendAI();
  const [messages, setMessages] = useState<BackendChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(initialModel);
  const [lastResponse, setLastResponse] = useState<BackendChatResponse | null>(null);

  // Adicionar mensagem ao histórico
  const addMessage = useCallback((message: BackendChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Enviar mensagem
  const send = useCallback(async (content: string, systemPrompt?: string) => {
    const userMessage: BackendChatMessage = { role: 'user', content };
    addMessage(userMessage);

    setIsLoading(true);

    try {
      const chatMessages: BackendChatMessage[] = [];

      if (systemPrompt) {
        chatMessages.push({ role: 'system', content: systemPrompt });
      }

      chatMessages.push(...messages, userMessage);

      const response = await sendMessage({
        messages: chatMessages,
        model: currentModel,
        temperature: 0.7,
        max_tokens: 4000,
      });

      setLastResponse(response);

      if (response.success && response.data) {
        const assistantMessage: BackendChatMessage = {
          role: 'assistant',
          content: response.data.choices?.[0]?.message?.content || 'Sem resposta',
        };
        addMessage(assistantMessage);
      } else {
        throw new Error(response.error?.message || 'Erro na resposta');
      }

      return response;
    } catch (err: any) {
      console.error('Chat error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentModel, addMessage, sendMessage]);

  // Limpar conversa
  const clear = useCallback(() => {
    setMessages([]);
    setLastResponse(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    currentModel,
    setCurrentModel,
    lastResponse,
    send,
    clear,
    addMessage,
  };
}

/**
 * Hook para seleção e filtro de modelos
 */
export function useBackendModels() {
  const { models, loadModels, getRecommendedModels, isLoading } = useBackendAI();
  const [recommended, setRecommended] = useState<any>({});

  // Carregar modelos recomendados
  useEffect(() => {
    getRecommendedModels().then(setRecommended);
  }, [getRecommendedModels]);

  // Filtrar por categoria
  const filterByCategory = useCallback((category: string) => {
    return models.filter(model => model.category === category);
  }, [models]);

  // Buscar por ID
  const findById = useCallback((id: string) => {
    return models.find(model => model.id === id);
  }, [models]);

  // Modelos por categoria
  const fast = filterByCategory('fast');
  const balanced = filterByCategory('balanced');
  const premium = filterByCategory('premium');
  const reasoning = filterByCategory('reasoning');
  const coding = filterByCategory('coding');

  // Modelos mais usados
  const popular = models.filter(model => 
    ['openai/gpt-4o-mini', 'openai/gpt-4o', 'anthropic/claude-3.5-sonnet'].includes(model.id)
  );

  return {
    models,
    fast,
    balanced,
    premium,
    reasoning,
    coding,
    popular,
    recommended,
    isLoading,
    loadModels,
    filterByCategory,
    findById,
  };
}

/**
 * Hook para monitoramento de status
 */
export function useBackendAIStatus() {
  const { status, checkStatus } = useBackendAI();
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Verificar status
  const refresh = useCallback(async () => {
    await checkStatus();
    setLastCheck(new Date());
  }, [checkStatus]);

  // Verificação automática periódica
  useEffect(() => {
    const interval = setInterval(refresh, 60000); // 1 minuto
    return () => clearInterval(interval);
  }, [refresh]);

  // Status geral
  const isHealthy = status ? (status.openrouter.healthy || status.openai.healthy) : null;

  return {
    status,
    isHealthy,
    lastCheck,
    refresh,
  };
}

export default useBackendAI;