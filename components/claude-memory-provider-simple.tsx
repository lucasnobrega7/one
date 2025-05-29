// components/claude-memory-provider-simple.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface ClaudeMemoryContextType {
  saveContext: (context: any) => void;
  forceSave: () => Promise<void>;
  isInitialized: boolean;
  isSaving: boolean;
  lastSave: Date | null;
}

const ClaudeMemoryContext = createContext<ClaudeMemoryContextType | null>(null);

interface ClaudeMemoryProviderProps {
  children: ReactNode;
}

export function ClaudeMemoryProvider({ children }: ClaudeMemoryProviderProps) {
  const pathname = usePathname();
  
  // Estado do sistema
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSave, setLastSave] = useState<Date | null>(null);
  
  // Sessão atual
  const [currentSession, setCurrentSession] = useState({
    startTime: new Date(),
    actions: [] as string[],
    pages: [] as string[]
  });

  // Inicialização
  useEffect(() => {
    const initializeMemorySystem = async () => {
      const githubToken = process.env.NEXT_PUBLIC_GITHUB_MEMORY_TOKEN;
      
      if (!githubToken || githubToken === 'ghp_SEU_TOKEN_AQUI') {
        console.warn('🧠 Claude Memory: Token GitHub não configurado');
        return;
      }

      console.log('🧠 Claude Memory System inicializando...');
      setIsInitialized(true);
      
      // Log do sistema
      console.log('✅ Claude Memory System ativo');
      console.log('📊 Configurações:', {
        token: githubToken ? 'Configurado' : 'Não configurado',
        autoSave: true,
        interval: '5 segundos'
      });
    };

    initializeMemorySystem();
  }, []);

  // Monitora mudanças de rota
  useEffect(() => {
    if (!isInitialized) return;

    console.log(`🧠 Claude Memory: Navegação -> ${pathname}`);
    
    setCurrentSession(prev => ({
      ...prev,
      pages: [...prev.pages, pathname],
      actions: [...prev.actions, `Navegou para: ${pathname}`]
    }));
  }, [pathname, isInitialized]);

  // Auto-save periódico
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      if (currentSession.actions.length > 0) {
        saveContext({
          session: currentSession,
          timestamp: new Date(),
          duration: Date.now() - currentSession.startTime.getTime()
        });
      }
    }, 5000); // 5 segundos

    return () => clearInterval(interval);
  }, [isInitialized, currentSession]);

  // Funções
  const saveContext = useCallback(async (context: any) => {
    if (!isInitialized) return;
    
    setIsSaving(true);
    console.log('🧠 Claude Memory: Salvando contexto...', context);
    
    // Simula salvamento
    setTimeout(() => {
      setLastSave(new Date());
      setIsSaving(false);
      console.log('✅ Claude Memory: Contexto salvo');
    }, 500);
  }, [isInitialized]);

  const forceSave = useCallback(async () => {
    if (!isInitialized) return;
    
    setIsSaving(true);
    console.log('🧠 Claude Memory: Salvamento forçado...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastSave(new Date());
    setIsSaving(false);
    console.log('✅ Claude Memory: Salvamento forçado concluído');
  }, [isInitialized]);

  // Expõe funções globalmente
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      (window as any).claudeMemory = {
        saveContext,
        forceSave,
        getStatus: () => ({
          isInitialized,
          isSaving,
          lastSave,
          sessionActions: currentSession.actions.length
        })
      };
    }
  }, [saveContext, forceSave, isInitialized, isSaving, lastSave, currentSession]);

  const value: ClaudeMemoryContextType = {
    saveContext,
    forceSave,
    isInitialized,
    isSaving,
    lastSave
  };

  return (
    <ClaudeMemoryContext.Provider value={value}>
      {children}
      
      {/* Indicador visual */}
      {isInitialized && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-xs text-white z-50">
          <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
          <span>
            Claude Memory {isSaving ? 'Salvando...' : 'Ativo'}
          </span>
          {lastSave && (
            <span className="text-gray-400">
              • {lastSave.toLocaleTimeString('pt-BR')}
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