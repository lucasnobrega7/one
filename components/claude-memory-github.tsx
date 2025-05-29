// components/claude-memory-github.tsx
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
    events: [] as any[]
  });

  // Salva no GitHub silenciosamente
  const saveToGitHub = useCallback(async (data: any) => {
    try {
      const token = process.env.NEXT_PUBLIC_GITHUB_MEMORY_TOKEN;
      if (!token) return;

      const date = new Date().toISOString().split('T')[0];
      const filename = `${data.sessionId}.json`;
      const path = `claude-memory/sessions/${date}/${filename}`;
      
      const content = btoa(JSON.stringify(data, null, 2));
      
      await fetch(`https://api.github.com/repos/lucasnobrega7/one/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Auto-save: ${data.sessionId}`,
          content: content
        })
      });
    } catch (e) {
      // Falha silenciosamente - sem logs
    }
  }, []);

  // Salva contexto
  const saveContext = useCallback((context: any) => {
    const newEvent = {
      timestamp: new Date(),
      type: 'custom',
      data: context
    };
    
    setSessionData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
  }, []);

  // Auto-save a cada 5 minutos no GitHub
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionData.events.length > 0 || sessionData.pages.length > 1) {
        saveToGitHub({
          ...sessionData,
          lastUpdate: new Date()
        });
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [sessionData, saveToGitHub]);

  // Rastreia páginas visitadas
  useEffect(() => {
    setSessionData(prev => ({
      ...prev,
      pages: [...new Set([...prev.pages, pathname])]
    }));
  }, [pathname]);

  // Salva ao fechar
  useEffect(() => {
    const handleUnload = () => {
      // Usa sendBeacon para garantir envio
      const data = JSON.stringify({
        ...sessionData,
        endTime: new Date()
      });
      
      if (navigator.sendBeacon) {
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon('/api/claude-memory', blob);
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionData]);

  useEffect(() => {
    setIsActive(true);
  }, []);

  const value: ClaudeMemoryContextType = {
    saveContext,
    isActive
  };

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
