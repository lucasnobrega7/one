// Exemplo de uso do Claude Memory System

import { useClaudeMemory } from '@/components/claude-memory-provider';

export function ExampleComponent() {
  const { 
    saveContext, 
    projectContext, 
    loadRelevantContext,
    isInitialized 
  } = useClaudeMemory();

  const handleAction = async () => {
    // Carrega contexto relevante
    await loadRelevantContext('implementar nova feature');
    
    // Sua lógica aqui...
    
    // Salva contexto automaticamente
    saveContext({
      filesModified: ['components/example.tsx'],
      commands: ['npm test', 'git commit'],
      decisions: ['Usar React Hook Form para formulários'],
      insights: ['Performance melhorada com lazy loading']
    });
  };

  if (!isInitialized) {
    return <div>Carregando sistema de memória...</div>;
  }

  return (
    <div>
      <h2>Claude Memory System</h2>
      <pre>{JSON.stringify(projectContext, null, 2)}</pre>
      <button onClick={handleAction}>Executar Ação</button>
    </div>
  );
}
