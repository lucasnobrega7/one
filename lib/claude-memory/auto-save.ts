// lib/claude-memory/auto-save.ts
import { Octokit } from '@octokit/rest';
import { debounce } from 'lodash';

interface MemoryContext {
  timestamp: Date;
  sessionId: string;
  projectState: any;
  filesModified: string[];
  commands: string[];
  decisions: string[];
  insights: string[];
}

export class ClaudeAutoSave {
  private octokit: Octokit;
  private saveQueue: MemoryContext[] = [];
  private isProcessing = false;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
    this.startAutoSave();
  }

  // Adiciona contexto à fila de salvamento
  public addContext(context: Partial<MemoryContext>) {
    const fullContext: MemoryContext = {
      timestamp: new Date(),
      sessionId: `session-${Date.now()}`,
      projectState: {},
      filesModified: [],
      commands: [],
      decisions: [],
      insights: [],
      ...context
    };

    this.saveQueue.push(fullContext);
    this.processSaveQueue();
  }

  // Processa fila de salvamento com debounce
  private processSaveQueue = debounce(async () => {
    if (this.isProcessing || this.saveQueue.length === 0) return;

    this.isProcessing = true;
    const contexts = [...this.saveQueue];
    this.saveQueue = [];

    try {
      for (const context of contexts) {
        await this.saveToGitHub(context);
        await this.updateProjectState(context);
        await this.generateSummary(context);
      }
    } catch (error) {
      console.error('Error saving context:', error);
      // Re-adiciona à fila em caso de erro
      this.saveQueue.unshift(...contexts);
    } finally {
      this.isProcessing = false;
    }
  }, 5000);

  // Salva contexto no GitHub
  private async saveToGitHub(context: MemoryContext) {
    const date = context.timestamp.toISOString().split('T')[0];
    const path = `claude-memory/sessions/${date}/${context.sessionId}.json`;

    try {
      // Tenta obter arquivo existente
      const { data: existingFile } = await this.octokit.repos.getContent({
        owner: 'lucasnobrega7',
        repo: 'one',
        path
      }).catch(() => ({ data: null }));

      const content = Buffer.from(JSON.stringify(context, null, 2)).toString('base64');
      
      await this.octokit.repos.createOrUpdateFileContents({
        owner: 'lucasnobrega7',
        repo: 'one',
        path,
        message: `Auto-save: ${context.sessionId}`,
        content,
        sha: existingFile?.sha
      });
    } catch (error) {
      console.error('Error saving to GitHub:', error);
    }
  }

  // Atualiza estado do projeto
  private async updateProjectState(context: MemoryContext) {
    const statePath = 'claude-memory/knowledge/project-state.json';
    
    try {
      // Obtém estado atual
      const { data: currentStateFile } = await this.octokit.repos.getContent({
        owner: 'lucasnobrega7',
        repo: 'one',
        path: statePath
      }).catch(() => ({ data: null }));

      let currentState = {};
      if (currentStateFile?.content) {
        currentState = JSON.parse(
          Buffer.from(currentStateFile.content, 'base64').toString()
        );
      }

      // Merge com novo estado
      const updatedState = {
        ...currentState,
        lastUpdate: context.timestamp,
        recentSessions: [
          context.sessionId,
          ...(currentState.recentSessions || []).slice(0, 9)
        ],
        filesModified: [
          ...new Set([
            ...context.filesModified,
            ...(currentState.filesModified || [])
          ])
        ].slice(0, 100),
        metrics: {
          totalSessions: (currentState.metrics?.totalSessions || 0) + 1,
          totalCommands: (currentState.metrics?.totalCommands || 0) + context.commands.length,
          totalDecisions: (currentState.metrics?.totalDecisions || 0) + context.decisions.length
        }
      };

      const content = Buffer.from(JSON.stringify(updatedState, null, 2)).toString('base64');
      
      await this.octokit.repos.createOrUpdateFileContents({
        owner: 'lucasnobrega7',
        repo: 'one',
        path: statePath,
        message: 'Auto-update: Project state',
        content,
        sha: currentStateFile?.sha
      });
    } catch (error) {
      console.error('Error updating project state:', error);
    }
  }

  // Gera resumo automático
  private async generateSummary(context: MemoryContext) {
    const date = context.timestamp.toISOString().split('T')[0];
    const summaryPath = `claude-memory/sessions/${date}/summary.md`;

    try {
      // Obtém resumo existente
      const { data: existingSummary } = await this.octokit.repos.getContent({
        owner: 'lucasnobrega7',
        repo: 'one',
        path: summaryPath
      }).catch(() => ({ data: null }));

      let summaryContent = `# Resumo do dia ${date}\n\n`;
      
      if (existingSummary?.content) {
        summaryContent = Buffer.from(existingSummary.content, 'base64').toString();
      }

      // Adiciona nova sessão ao resumo
      summaryContent += `
## ${context.sessionId} - ${context.timestamp.toLocaleTimeString('pt-BR')}

### Arquivos Modificados
${context.filesModified.map(f => `- ${f}`).join('\n') || '- Nenhum arquivo modificado'}

### Comandos Executados
${context.commands.map(c => `- ${c}`).join('\n') || '- Nenhum comando executado'}

### Decisões Tomadas
${context.decisions.map(d => `- ${d}`).join('\n') || '- Nenhuma decisão registrada'}

### Insights
${context.insights.map(i => `- ${i}`).join('\n') || '- Nenhum insight registrado'}

---
`;

      const content = Buffer.from(summaryContent).toString('base64');
      
      await this.octokit.repos.createOrUpdateFileContents({
        owner: 'lucasnobrega7',
        repo: 'one',
        path: summaryPath,
        message: `Auto-summary: ${date}`,
        content,
        sha: existingSummary?.sha
      });
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  }

  // Inicia salvamento automático periódico
  private startAutoSave() {
    // Salva contexto a cada 5 minutos mesmo sem mudanças
    setInterval(() => {
      if (this.saveQueue.length > 0) {
        this.processSaveQueue();
      }
    }, 5 * 60 * 1000);
  }

  // Método para forçar salvamento imediato
  public async forceSave() {
    await this.processSaveQueue.flush();
  }
}

// Hook React para usar o sistema
export function useAutoSave() {
  const [autoSave, setAutoSave] = useState<ClaudeAutoSave | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_GITHUB_MEMORY_TOKEN;
    if (token) {
      setAutoSave(new ClaudeAutoSave(token));
    }
  }, []);

  const saveContext = useCallback((context: Partial<MemoryContext>) => {
    autoSave?.addContext(context);
  }, [autoSave]);

  const forceSave = useCallback(async () => {
    await autoSave?.forceSave();
  }, [autoSave]);

  return { saveContext, forceSave };
}
