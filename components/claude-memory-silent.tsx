// components/claude-memory-silent.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface ClaudeMemoryContextType {
  saveContext: (context: any) => void;
  isActive: boolean;
}

const ClaudeMemoryContext = createContext<ClaudeMemoryContextType | null>(null);

interface ClaudeMemoryProviderProps {
  children: ReactNode;
}

export function ClaudeMemoryProvider({ children }: ClaudeMemoryProviderProps) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [sessionData, setSessionData] = useState({
    sessionId: `session-${Date.now()}`,
    startTime: new Date(),
    pages: [] as string[],
    events: [] as any[],
    lastSave: null as Date | null
  });

  // Salva dados silenciosamente no localStorage
  const saveToLocal = useCallback((data: any) => {
    try {
      const key = `claude-memory-${new Date().toISOString().split('T')[0]}`;
      const existing = localStorage.getItem(key);
      const sessions = existing ? JSON.parse(existing) : [];
      sessions.push(data);
      localStorage.setItem(key, JSON.stringify(sessions));
    } catch (e) {
      // Falha silenciosamente
    }
  }, []);

  // Salva contexto sem logs ou indicadores
  const saveContext = useCallback((context: any) => {
    const newEvent = {
      timestamp: new Date(),
      type: 'custom',
      data: context
    };
    
    setSessionData(prev => ({
      ...prev,
      events: [...prev.events, newEvent],
      lastSave: new Date()
    }));
  }, []);

  // Auto-save silencioso a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionData.events.length > 0 || sessionData.pages.length > 0) {
        saveToLocal({
          ...sessionData,
          endTime: new Date()
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [sessionData, saveToLocal]);

  // Rastreia mudanças de página silenciosamente
  useEffect(() => {
    setSessionData(prev => ({
      ...prev,
      pages: [...new Set([...prev.pages, pathname])]
    }));
  }, [pathname]);

  // Salva quando a página fecha
  useEffect(() => {
    const handleUnload = () => {
      if (sessionData.events.length > 0 || sessionData.pages.length > 0) {
        saveToLocal({
          ...sessionData,
          endTime: new Date()
        });
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionData, saveToLocal]);

  // Ativa o sistema
  useEffect(() => {
    setIsActive(true);
  }, []);

  // Expõe API global mas sem logs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).claudeMemory = {
        save: (data: any) => saveContext(data),
        isActive: () => isActive
      };
    }
  }, [saveContext, isActive]);

  const value: ClaudeMemoryContextType = {
    saveContext,
    isActive
  };

  // Retorna apenas os children - sem UI adicional
  return (
    <ClaudeMemoryContext.Provider value={value}>
      {children}
    </ClaudeMemoryContext.Provider>
  );
}

export function useClaudeMemory() {
  const context = useContext(ClaudeMemoryContext);
  if (!context) {
    throw new Error('useClaudeMemory must be used within ClaudeMemoryProvider');
  }
  return context;
}
