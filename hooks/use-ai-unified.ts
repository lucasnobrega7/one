/**
 * Hook Unificado para IA - Integração OpenRouter + Sistema Existente
 * Chaves configuradas para custos otimizados
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { SmartAIClient, AIConfig, ChatMessage, ChatParams, AIResponse } from '@/lib/ai/smart-ai-client';
import { ModelInfo } from '@/lib/ai/providers/openrouter';

// Configuração com suas chaves reais
const AI_CONFIG: AIConfig = {
  openrouter: {
    apiKey: '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',
    enabled: true,
  },
  openai: {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    enabled: false, // Usar apenas como fallback se necessário
  },
  fallback: {
    enabled: true,
    retries: 3,
  },
};

export interface UseAIReturn {
  client: SmartAIClient;
  models: ModelInfo[];
  isLoading: boolean;
  error: string | null;
  
  // Chat functions
  sendMessage: (params: ChatParams) => Promise<AIResponse>;
  streamMessage: (params: ChatParams) => AsyncGenerator<any, void, unknown>;
  
  // Model functions
  loadModels: () => Promise<void>;
  getRecommendedModels: () => any;
  
  // Status functions
  getProvidersStatus: () => Promise<any>;
  checkHealth: () => Promise<boolean>;
}

/**
 * Hook principal para integração com IA
 */
export function useAI(): UseAIReturn {
  const [client] = useState(() => new SmartAIClient(AI_CONFIG));
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Carregar modelos disponíveis
  const loadModels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const availableModels = await client.loadAvailableModels();
      setModels(availableModels);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar modelos');
      console.error('Error loading models:', err);
    } finally {
      setIsLoading(false);
    }
  }, [client]);
  
  // Enviar mensagem (não-streaming)
  const sendMessage = useCallback(async (params: ChatParams): Promise<AIResponse> => {
    try {
      setError(null);
      return await client.createChatCompletion(params);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao enviar mensagem';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [client]);
  
  // Enviar mensagem (streaming)
  const streamMessage = useCallback(async function* (params: ChatParams) {
    try {
      setError(null);
      yield* client.streamChatCompletion(params);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro no streaming';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [client]);
  
  // Obter modelos recomendados
  const getRecommendedModels = useCallback(() => {
    return client.getRecommendedModels();
  }, [client]);
  
  // Verificar status dos providers
  const getProvidersStatus = useCallback(async () => {
    try {
      return await client.getProvidersStatus();
    } catch (err: any) {
      console.error('Error checking providers status:', err);
      return {
        openrouter: { enabled: false, healthy: false },
        openai: { enabled: false, healthy: false },
      };
    }
  }, [client]);
  
  // Verificar saúde geral do sistema
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const status = await getProvidersStatus();
      return status.openrouter.healthy || status.openai.healthy;
    } catch {
      return false;
    }
  }, [getProvidersStatus]);
  
  // Carregar modelos na inicialização
  useEffect(() => {
    loadModels();
  }, [loadModels]);
  
  return {
    client,
    models,
    isLoading,
    error,
    sendMessage,
    streamMessage,
    loadModels,
    getRecommendedModels,
    getProvidersStatus,
    checkHealth,
  };
}

/**
 * Hook para chat com estado
 */
export function useChat(initialModel = 'openai/gpt-4o-mini') {
  const { sendMessage, streamMessage, error } = useAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(initialModel);
  
  // Adicionar mensagem ao histórico
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);
  
  // Enviar mensagem simples
  const send = useCallback(async (content: string, systemPrompt?: string) => {
    const userMessage: ChatMessage = { role: 'user', content };
    addMessage(userMessage);
    
    setIsLoading(true);
    
    try {
      const chatMessages: ChatMessage[] = [];
      
      if (systemPrompt) {
        chatMessages.push({ role: 'system', content: systemPrompt });
      }
      
      chatMessages.push(...messages, userMessage);
      
      const response = await sendMessage({
        messages: chatMessages,
        model: currentModel,
        temperature: 0.7,
      });
      
      if (response.success && response.data) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.choices[0]?.message?.content || 'Sem resposta',
        };
        addMessage(assistantMessage);
        return response;
      } else {
        throw new Error(response.error?.message || 'Erro na resposta');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentModel, addMessage, sendMessage]);
  
  // Streaming de mensagem
  const stream = useCallback(async (content: string, systemPrompt?: string) => {
    const userMessage: ChatMessage = { role: 'user', content };
    addMessage(userMessage);
    
    setIsLoading(true);
    
    // Adicionar mensagem vazia do assistente
    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    addMessage(assistantMessage);
    
    try {
      const chatMessages: ChatMessage[] = [];
      
      if (systemPrompt) {
        chatMessages.push({ role: 'system', content: systemPrompt });
      }
      
      chatMessages.push(...messages, userMessage);
      
      let fullContent = '';
      
      for await (const chunk of streamMessage({
        messages: chatMessages,
        model: currentModel,
        temperature: 0.7,
      })) {
        if (chunk.success && chunk.content) {
          fullContent += chunk.content;
          
          // Atualizar última mensagem
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: fullContent,
            };
            return newMessages;
          });
        }
      }
    } catch (err: any) {
      console.error('Stream error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentModel, addMessage, streamMessage]);
  
  // Limpar conversa
  const clear = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    isLoading,
    error,
    currentModel,
    setCurrentModel,
    send,
    stream,
    clear,
    addMessage,
  };
}

/**
 * Hook para seleção de modelos
 */
export function useModels() {
  const { models, loadModels, getRecommendedModels, isLoading } = useAI();
  
  // Filtrar modelos por categoria
  const filterByCategory = useCallback((category: string) => {
    const recommended = getRecommendedModels();
    const categoryModels = recommended[category] || [];
    
    return models.filter(model => 
      categoryModels.includes(model.id)
    );
  }, [models, getRecommendedModels]);
  
  // Buscar modelo por ID
  const findById = useCallback((id: string) => {
    return models.find(model => model.id === id);
  }, [models]);
  
  // Modelos mais econômicos
  const economical = useMemo(() => filterByCategory('fast'), [filterByCategory]);
  
  // Modelos balanceados
  const balanced = useMemo(() => filterByCategory('balanced'), [filterByCategory]);
  
  // Modelos premium
  const premium = useMemo(() => filterByCategory('premium'), [filterByCategory]);
  
  return {
    models,
    economical,
    balanced,
    premium,
    isLoading,
    loadModels,
    filterByCategory,
    findById,
    getRecommendedModels,
  };
}

/**
 * Hook para monitoramento de status
 */
export function useAIStatus() {
  const { getProvidersStatus, checkHealth } = useAI();
  const [status, setStatus] = useState<any>(null);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  
  // Verificar status
  const refresh = useCallback(async () => {
    try {
      const [statusResult, healthResult] = await Promise.all([
        getProvidersStatus(),
        checkHealth(),
      ]);
      
      setStatus(statusResult);
      setIsHealthy(healthResult);
      setLastCheck(new Date());
    } catch (err) {
      console.error('Status check failed:', err);
      setIsHealthy(false);
    }
  }, [getProvidersStatus, checkHealth]);
  
  // Verificar automaticamente na inicialização
  useEffect(() => {
    refresh();
  }, [refresh]);
  
  return {
    status,
    isHealthy,
    lastCheck,
    refresh,
  };
}

export default useAI;