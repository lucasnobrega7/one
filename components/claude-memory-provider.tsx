// components/claude-memory-provider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ClaudeAutoSave } from '@/lib/claude-memory/auto-save';
import { ContextAggregator } from '@/lib/claude-memory/context-aggregator';
import { SmartRecall } from '@/lib/claude-memory/smart-recall';
import { usePathname } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface ClaudeMemoryContextType {
  // Auto Save
  saveContext: (context: any) => void;
  forceSave: () => Promise<void>;
  
  // Context Aggregator
  projectContext: any;
  refreshContext: () => Promise<void>;
  
  // Smart Recall
  recallContext: any;
  loadRelevantContext: (query: string) => Promise<void>;
  
  // Estado
  isInitialized: boolean;
  isSaving: boolean;
  lastSave: Date | null;
}

const ClaudeMemoryContext = createContext<ClaudeMemoryContextType | null>(null);

interface ClaudeMemoryProviderProps {
  children: ReactNode;
  config?: {
    autoSaveInterval?: number;
    enableAutoSave?: boolean;
    enableContextAggregation?: boolean;
    enableSmartRecall?: boolean;
  };
}

export function ClaudeMemoryProvider({ 
  children, 
  config = {
    autoSaveInterval: 5000,
    enableAutoSave: true,
    enableContextAggregation: true,
    enableSmartRecall: true
  }
}: ClaudeMemoryProviderProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  
  // Estado do sistema
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSave, setLastSave] = useState<Date | null>(null);
  
  // Instâncias dos sistemas
  const [autoSave, setAutoSave] = useState<ClaudeAutoSave | null>(null);
  const [aggregator, setAggregator] = useState<ContextAggregator | null>(null);
  const [recall, setRecall] = useState<SmartRecall | null>(null);
  
  // Estados de contexto
  const [projectContext, setProjectContext] = useState<any>(null);
  const [recallContext, setRecallContext] = useState<any>(null);
  
  // Rastreamento de atividade
  const [currentSession, setCurrentSession] = useState({
    startTime: new Date(),
    filesModified: new Set<string>(),
    commands: [] as string[],
    decisions: [] as string[],
    insights: [] as string[]
  });

  // Inicialização do sistema
  useEffect(() => {
    const initializeMemorySystem = async () => {
      const githubToken = process.env.NEXT_PUBLIC_GITHUB_MEMORY_TOKEN;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!githubToken) {
        console.warn('Claude Memory System: GitHub token not found');
        return;
      }

      try {
        // Inicializa Auto Save
        if (config.enableAutoSave) {
          const autoSaveInstance = new ClaudeAutoSave(githubToken);
          setAutoSave(autoSaveInstance);
        }

        // Inicializa Context Aggregator
        if (config.enableContextAggregation && supabaseUrl && supabaseKey) {
          const aggregatorInstance = new ContextAggregator(githubToken, supabaseUrl, supabaseKey);
          setAggregator(aggregatorInstance);
          
          // Carrega contexto inicial
          const context = await aggregatorInstance.aggregateFullContext();
          setProjectContext(context);
        }

        // Inicializa Smart Recall
        if (config.enableSmartRecall && supabaseUrl && supabaseKey) {
          const recallInstance = new SmartRecall(githubToken, supabaseUrl, supabaseKey);
          setRecall(recallInstance);
        }

        setIsInitialized(true);
        
        toast({
          title: 'Claude Memory System',
          description: 'Sistema de memória contextual ativado',
          duration: 3000
        });
      } catch (error) {
        console.error('Error initializing Claude Memory System:', error);
        toast({
          title: 'Erro ao inicializar',
          description: 'Sistema de memória não pôde ser iniciado',
          variant: 'destructive'
        });
      }
    };

    initializeMemorySystem();

    // Cleanup
    return () => {
      aggregator?.destroy();
    };
  }, []);

  // Monitora mudanças de rota
  useEffect(() => {
    if (!autoSave) return;

    // Salva contexto de navegação
    autoSave.addContext({
      commands: [`Navegou para: ${pathname}`],
      timestamp: new Date()
    });
  }, [pathname, autoSave]);

  // Monitora atividade do usuário
  useEffect(() => {
    if (!autoSave) return;

    const handleActivity = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Rastreia cliques em botões importantes
      if (target.tagName === 'BUTTON' || target.role === 'button') {
        const action = target.textContent || target.getAttribute('aria-label') || 'Botão clicado';
        currentSession.commands.push(action);
      }
      
      // Rastreia mudanças em inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const fieldName = target.getAttribute('name') || target.getAttribute('id') || 'campo';
        currentSession.insights.push(`Modificou: ${fieldName}`);
      }
    };

    // Adiciona listeners
    document.addEventListener('click', handleActivity);
    document.addEventListener('change', handleActivity);

    return () => {
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('change', handleActivity);
    };
  }, [autoSave, currentSession]);

  // Auto-save periódico da sessão
  useEffect(() => {
    if (!autoSave || !config.enableAutoSave) return;

    const interval = setInterval(() => {
      if (currentSession.commands.length > 0 || 
          currentSession.filesModified.size > 0 ||
          currentSession.decisions.length > 0) {
        
        saveContext({
          ...currentSession,
          filesModified: Array.from(currentSession.filesModified),
          duration: Date.now() - currentSession.startTime.getTime()
        });
        
        // Limpa sessão após salvar
        setCurrentSession({
          startTime: new Date(),
          filesModified: new Set<string>(),
          commands: [],
          decisions: [],
          insights: []
        });
      }
    }, config.autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, currentSession, config]);

  // Funções expostas
  const saveContext = useCallback((context: any) => {
    if (!autoSave) return;
    
    setIsSaving(true);
    autoSave.addContext(context);
    setLastSave(new Date());
    
    setTimeout(() => setIsSaving(false), 1000);
  }, [autoSave]);

  const forceSave = useCallback(async () => {
    if (!autoSave) return;
    
    setIsSaving(true);
    await autoSave.forceSave();
    setLastSave(new Date());
    setIsSaving(false);
    
    toast({
      title: 'Contexto salvo',
      description: 'Todas as mudanças foram salvas no GitHub',
      duration: 2000
    });
  }, [autoSave, toast]);

  const refreshContext = useCallback(async () => {
    if (!aggregator) return;
    
    const context = await aggregator.aggregateFullContext();
    setProjectContext(context);
    
    toast({
      title: 'Contexto atualizado',
      description: 'Informações do projeto foram atualizadas',
      duration: 2000
    });
  }, [aggregator, toast]);

  const loadRelevantContext = useCallback(async (query: string) => {
    if (!recall) return;
    
    const context = await recall.loadRelevantContext(query);
    setRecallContext(context);
    
    // Adiciona query ao histórico
    currentSession.commands.push(`Pesquisou: ${query}`);
  }, [recall, currentSession]);

  // Adiciona métodos auxiliares ao contexto da sessão
  const addFileModified = useCallback((filename: string) => {
    currentSession.filesModified.add(filename);
  }, [currentSession]);

  const addDecision = useCallback((decision: string) => {
    currentSession.decisions.push(decision);
    saveContext({ decisions: [decision] });
  }, [currentSession, saveContext]);

  const addInsight = useCallback((insight: string) => {
    currentSession.insights.push(insight);
  }, [currentSession]);

  // Expõe métodos globalmente para integração
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).claudeMemory = {
        saveContext,
        forceSave,
        refreshContext,
        loadRelevantContext,
        addFileModified,
        addDecision,
        addInsight
      };
    }
  }, [saveContext, forceSave, refreshContext, loadRelevantContext, 
      addFileModified, addDecision, addInsight]);

  const value: ClaudeMemoryContextType = {
    saveContext,
    forceSave,
    projectContext,
    refreshContext,
    recallContext,
    loadRelevantContext,
    isInitialized,
    isSaving,
    lastSave
  };

  return (
    <ClaudeMemoryContext.Provider value={value}>
      {children}
      
      {/* Indicador visual de status */}
      {isInitialized && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full px-3 py-1.5 text-xs">
          <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="text-muted-foreground">
            Claude Memory {isSaving ? 'Salvando...' : 'Ativo'}
          </span>
          {lastSave && (
            <span className="text-muted-foreground">
              • Último save: {lastSave.toLocaleTimeString('pt-BR')}
            </span>
          )}
        </div>
      )}
    </ClaudeMemoryContext.Provider>
  );
}

// Hook para usar o sistema
export function useClaudeMemory() {
  const context = useContext(ClaudeMemoryContext);
  
  if (!context) {
    throw new Error('useClaudeMemory must be used within ClaudeMemoryProvider');
  }
  
  return context;
}

// HOC para adicionar memória a componentes
export function withClaudeMemory<P extends object>(
  Component: React.ComponentType<P & { memory: ClaudeMemoryContextType }>
) {
  return function WithClaudeMemoryComponent(props: P) {
    const memory = useClaudeMemory();
    return <Component {...props} memory={memory} />;
  };
}
