'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { apiClientV2, type AgentTool } from '@/lib/api-client-v2';

interface OnboardingAnalytics {
  steps_completed: number;
  time_spent: number;
  actions_performed: string[];
  completion_rate: number;
  started_at: string;
  current_step_start: string;
}

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  analytics: OnboardingAnalytics;
  data: {
    profileSetup?: {
      name?: string;
      company?: string;
      role?: string;
      goals?: string[];
    };
    firstAgent?: {
      agent: any;
      test_conversation_id?: string;
      tools_configured?: AgentTool[];
      test_results?: any;
    };
    knowledgeBase?: {
      datastore_id?: string;
      documents_uploaded?: number;
      processing_status?: 'pending' | 'processing' | 'completed';
      test_query_results?: any;
    };
    integrations?: {
      whatsapp_enabled?: boolean;
      webhook_configured?: boolean;
      test_message_sent?: boolean;
      webhook_url?: string;
    };
    final_setup?: {
      dashboard_configured?: boolean;
      first_conversation?: boolean;
      onboarding_feedback?: string;
    };
  };
  isComplete: boolean;
  realTimeData: {
    conversations: any[];
    recent_messages: any[];
    agent_performance: any;
    system_status: any;
  };
  streaming: {
    isStreaming: boolean;
    currentResponse: string;
    sources: any[];
    metadata: any;
  };
}

interface OnboardingActions {
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (step: number, data?: any) => void;
  updateStepData: (step: number, data: any) => void;
  testAgentWithStreaming: (agentId: string, message: string) => Promise<any>;
  configureAgentTools: (agentId: string, tools: AgentTool[]) => Promise<void>;
  uploadKnowledgeBase: (files: FileList) => Promise<void>;
  testKnowledgeBase: (knowledgeBaseId: string, query: string) => Promise<any>;
  configureWebhook: (config: any) => Promise<void>;
  finishOnboarding: () => Promise<void>;
  trackAction: (action: string) => void;
  resetOnboarding: () => void;
}

const AdvancedOnboardingContext = createContext<{
  state: OnboardingState;
  actions: OnboardingActions;
} | null>(null);

const TOTAL_STEPS = 6;
const STEP_NAMES = [
  'Bem-vindo',
  'Perfil e Objetivos', 
  'Primeiro Agente',
  'Base de Conhecimento',
  'Integrações',
  'Finalização'
];

export function AdvancedOnboardingProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    totalSteps: TOTAL_STEPS,
    completedSteps: new Set(),
    analytics: {
      steps_completed: 0,
      time_spent: 0,
      actions_performed: [],
      completion_rate: 0,
      started_at: new Date().toISOString(),
      current_step_start: new Date().toISOString(),
    },
    data: {},
    isComplete: false,
    realTimeData: {
      conversations: [],
      recent_messages: [],
      agent_performance: {},
      system_status: {},
    },
    streaming: {
      isStreaming: false,
      currentResponse: '',
      sources: [],
      metadata: {},
    },
  });

  // Configurar token da API quando sessão estiver disponível
  useEffect(() => {
    if (session?.user?.email) {
      apiClientV2.setToken(session.accessToken || 'mock-token');
    }
  }, [session]);

  // Real-time updates via SSE
  useEffect(() => {
    if (!session?.user?.id) return;

    const eventSource = apiClientV2.createEventSource(
      '/api/events/dashboard',
      (data) => {
        setState(prev => ({
          ...prev,
          realTimeData: { ...prev.realTimeData, ...data },
        }));
      }
    );

    return () => eventSource.close();
  }, [session?.user?.id]);

  // Analytics tracking
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          time_spent: Math.floor((Date.now() - startTime) / 1000),
          completion_rate: (prev.completedSteps.size / prev.totalSteps) * 100,
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Salvar progresso no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('onboarding_progress', JSON.stringify({
        currentStep: state.currentStep,
        completedSteps: Array.from(state.completedSteps),
        data: state.data,
        analytics: state.analytics,
      }));
    } catch (error) {
      console.warn('Erro ao salvar progresso do onboarding:', error);
    }
  }, [state.currentStep, state.completedSteps, state.data, state.analytics]);

  // Carregar progresso do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('onboarding_progress');
      if (saved) {
        const progress = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          currentStep: progress.currentStep || 1,
          completedSteps: new Set(progress.completedSteps || []),
          data: progress.data || {},
          analytics: {
            ...prev.analytics,
            ...progress.analytics,
          },
        }));
      }
    } catch (error) {
      console.warn('Erro ao carregar progresso do onboarding:', error);
    }
  }, []);

  const testAgentWithStreaming = async (agentId: string, message: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      setState(prev => ({
        ...prev,
        streaming: {
          isStreaming: true,
          currentResponse: '',
          sources: [],
          metadata: {},
        },
      }));

      let fullResponse = '';
      let sources: any[] = [];
      let conversationId = '';
      let metadata: any = {};

      apiClientV2.chatWithStreaming(
        {
          messages: [{ role: 'user', content: message }],
          agent_id: agentId,
          streaming: true,
          context_data: {
            onboarding_test: true,
            step: state.currentStep,
            user_id: session?.user?.id,
          },
        },
        (chunk) => {
          if (chunk.event === 'answer') {
            fullResponse += chunk.data;
            setState(prev => ({
              ...prev,
              streaming: {
                ...prev.streaming,
                currentResponse: fullResponse,
              },
            }));
          } else if (chunk.event === 'source') {
            sources.push(chunk.data);
            setState(prev => ({
              ...prev,
              streaming: {
                ...prev.streaming,
                sources: sources,
              },
            }));
          } else if (chunk.event === 'metadata') {
            metadata = chunk.data;
            setState(prev => ({
              ...prev,
              streaming: {
                ...prev.streaming,
                metadata: metadata,
              },
            }));
          }
          conversationId = chunk.conversation_id || conversationId;
        },
        (data) => {
          setState(prev => ({
            ...prev,
            streaming: {
              ...prev.streaming,
              isStreaming: false,
            },
          }));

          resolve({
            response: fullResponse,
            sources,
            metadata,
            conversation_id: conversationId,
          });
        },
        (error) => {
          setState(prev => ({
            ...prev,
            streaming: {
              ...prev.streaming,
              isStreaming: false,
            },
          }));
          reject(error);
        }
      );
    });
  };

  const configureAgentTools = async (agentId: string, tools: AgentTool[]): Promise<void> => {
    try {
      // Criar cada ferramenta individualmente
      for (const tool of tools) {
        const response = await apiClientV2.request(`/api/agents/${agentId}/tools`, {
          method: 'POST',
          body: JSON.stringify(tool),
        });

        if (!response.success) {
          throw new Error(`Erro ao configurar ferramenta ${tool.name}: ${response.error}`);
        }
      }
      
      // Track action
      trackAction('tools_configured');
    } catch (error) {
      throw error;
    }
  };

  const uploadKnowledgeBase = async (files: FileList): Promise<void> => {
    try {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          knowledgeBase: {
            ...prev.data.knowledgeBase,
            processing_status: 'pending',
            documents_uploaded: files.length,
          },
        },
      }));

      // Criar base de conhecimento se não existir
      let knowledgeBaseId = state.data.knowledgeBase?.datastore_id;
      
      if (!knowledgeBaseId) {
        const kbResponse = await apiClientV2.request('/api/knowledge', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Base de Conhecimento Onboarding',
            description: 'Base de conhecimento criada durante o onboarding',
          }),
        });

        if (!kbResponse.success) {
          throw new Error('Erro ao criar base de conhecimento');
        }

        knowledgeBaseId = kbResponse.data.id;
      }

      // Upload dos documentos com progress tracking
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        await apiClientV2.uploadDocument(
          knowledgeBaseId,
          file,
          (progress) => {
            // Atualizar progresso do upload
            console.log(`Upload ${file.name}: ${progress}%`);
          }
        );
      }

      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          knowledgeBase: {
            ...prev.data.knowledgeBase,
            datastore_id: knowledgeBaseId,
            processing_status: 'completed',
          },
        },
      }));

      trackAction('knowledge_base_uploaded');

    } catch (error) {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          knowledgeBase: {
            ...prev.data.knowledgeBase,
            processing_status: 'pending', // Reset status em caso de erro
          },
        },
      }));
      throw error;
    }
  };

  const testKnowledgeBase = async (knowledgeBaseId: string, query: string): Promise<any> => {
    try {
      const response = await apiClientV2.searchKnowledgeBase(
        knowledgeBaseId,
        query,
        { topK: 3, threshold: 0.7 }
      );

      if (!response.success) {
        throw new Error('Erro ao testar base de conhecimento');
      }

      const results = response.data;
      
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          knowledgeBase: {
            ...prev.data.knowledgeBase,
            test_query_results: results,
          },
        },
      }));

      trackAction('knowledge_base_tested');
      return results;

    } catch (error) {
      throw error;
    }
  };

  const configureWebhook = async (config: any): Promise<void> => {
    try {
      const response = await apiClientV2.configureWebhook({
        name: 'Webhook Onboarding',
        url: config.url || `${window.location.origin}/api/webhooks/onboarding`,
        events: ['conversation.created', 'message.received', 'agent.responded'],
        isActive: true,
      });

      if (!response.success) {
        throw new Error('Erro ao configurar webhook');
      }

      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          integrations: {
            ...prev.data.integrations,
            webhook_configured: true,
            webhook_url: config.url,
          },
        },
      }));

      trackAction('webhook_configured');

    } catch (error) {
      throw error;
    }
  };

  const finishOnboarding = async (): Promise<void> => {
    try {
      // Marcar onboarding como concluído
      const response = await apiClientV2.trackEvent({
        eventType: 'onboarding_completed',
        metadata: {
          completed_at: new Date().toISOString(),
          onboarding_data: state.data,
          analytics: state.analytics,
          total_time: state.analytics.time_spent,
          completion_rate: 100,
        },
      });

      if (!response.success) {
        console.warn('Erro ao registrar conclusão do onboarding:', response.error);
      }

      setState(prev => ({ 
        ...prev, 
        isComplete: true,
        analytics: {
          ...prev.analytics,
          completion_rate: 100,
          steps_completed: prev.totalSteps,
        },
      }));

      // Limpar dados do localStorage
      localStorage.removeItem('onboarding_progress');

      trackAction('onboarding_completed');

    } catch (error) {
      throw error;
    }
  };

  const trackAction = (action: string) => {
    setState(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        actions_performed: [...prev.analytics.actions_performed, action],
      },
    }));

    // Enviar para analytics
    apiClientV2.trackEvent({
      eventType: 'onboarding_action',
      metadata: {
        action,
        step: state.currentStep,
        timestamp: new Date().toISOString(),
      },
    }).catch(console.warn);
  };

  const nextStep = () => {
    setState(prev => {
      const newStep = Math.min(prev.currentStep + 1, prev.totalSteps);
      return {
        ...prev,
        currentStep: newStep,
        analytics: {
          ...prev.analytics,
          current_step_start: new Date().toISOString(),
        },
      };
    });
    trackAction(`step_${state.currentStep + 1}_started`);
  };

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
      analytics: {
        ...prev.analytics,
        current_step_start: new Date().toISOString(),
      },
    }));
  };

  const completeStep = (step: number, data?: any) => {
    setState(prev => ({
      ...prev,
      completedSteps: new Set([...prev.completedSteps, step]),
      data: data ? { ...prev.data, [`step${step}`]: data } : prev.data,
      analytics: { 
        ...prev.analytics, 
        steps_completed: prev.completedSteps.size + 1 
      },
    }));
    trackAction(`step_${step}_completed`);
  };

  const updateStepData = (step: number, data: any) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [getStepDataKey(step)]: data },
    }));
  };

  const resetOnboarding = () => {
    setState({
      currentStep: 1,
      totalSteps: TOTAL_STEPS,
      completedSteps: new Set(),
      analytics: {
        steps_completed: 0,
        time_spent: 0,
        actions_performed: [],
        completion_rate: 0,
        started_at: new Date().toISOString(),
        current_step_start: new Date().toISOString(),
      },
      data: {},
      isComplete: false,
      realTimeData: {
        conversations: [],
        recent_messages: [],
        agent_performance: {},
        system_status: {},
      },
      streaming: {
        isStreaming: false,
        currentResponse: '',
        sources: [],
        metadata: {},
      },
    });
    localStorage.removeItem('onboarding_progress');
  };

  const getStepDataKey = (step: number): keyof OnboardingState['data'] => {
    const keys: Record<number, keyof OnboardingState['data']> = {
      2: 'profileSetup',
      3: 'firstAgent',
      4: 'knowledgeBase',
      5: 'integrations',
      6: 'final_setup',
    };
    return keys[step] || 'profileSetup';
  };

  const actions: OnboardingActions = {
    nextStep,
    prevStep,
    completeStep,
    updateStepData,
    testAgentWithStreaming,
    configureAgentTools,
    uploadKnowledgeBase,
    testKnowledgeBase,
    configureWebhook,
    finishOnboarding,
    trackAction,
    resetOnboarding,
  };

  return (
    <AdvancedOnboardingContext.Provider value={{ state, actions }}>
      {children}
    </AdvancedOnboardingContext.Provider>
  );
}

export const useAdvancedOnboarding = () => {
  const context = useContext(AdvancedOnboardingContext);
  if (!context) {
    throw new Error('useAdvancedOnboarding deve ser usado dentro de AdvancedOnboardingProvider');
  }
  return context;
};

export { STEP_NAMES };
export type { OnboardingState, OnboardingActions, OnboardingAnalytics };