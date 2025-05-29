// lib/claude-memory/smart-recall.ts
import { Octokit } from '@octokit/rest';
import { createClient } from '@supabase/supabase-js';

interface RecallContext {
  relevantSessions: any[];
  workPatterns: WorkPattern[];
  suggestedActions: string[];
  relatedFiles: string[];
  activeContext: any;
  historicalInsights: string[];
}

interface WorkPattern {
  type: string;
  frequency: number;
  timeOfDay?: string;
  relatedFiles: string[];
  avgDuration?: number;
}

export class SmartRecall {
  private octokit: Octokit;
  private supabase: any;
  private patternCache: Map<string, WorkPattern[]> = new Map();
  private sessionCache: Map<string, any> = new Map();

  constructor(githubToken: string, supabaseUrl: string, supabaseKey: string) {
    this.octokit = new Octokit({ auth: githubToken });
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.preloadCache();
  }

  // Carrega contexto relevante baseado em query
  public async loadRelevantContext(query: string): Promise<RecallContext> {
    // Analisa a query para entender intenção
    const intent = this.analyzeIntent(query);
    
    // Carrega sessões relevantes
    const relevantSessions = await this.findRelevantSessions(intent);
    
    // Identifica padrões de trabalho
    const workPatterns = await this.identifyWorkPatterns(relevantSessions);
    
    // Sugere ações baseadas em histórico
    const suggestedActions = this.generateSuggestions(workPatterns, intent);
    
    // Encontra arquivos relacionados
    const relatedFiles = await this.findRelatedFiles(intent, relevantSessions);
    
    // Carrega contexto ativo
    const activeContext = await this.loadActiveContext();
    
    // Gera insights históricos
    const historicalInsights = this.generateHistoricalInsights(relevantSessions, workPatterns);

    return {
      relevantSessions,
      workPatterns,
      suggestedActions,
      relatedFiles,
      activeContext,
      historicalInsights
    };
  }

  // Analisa intenção da query
  private analyzeIntent(query: string): any {
    const keywords = {
      implementation: ['implementar', 'criar', 'desenvolver', 'build', 'fazer'],
      debugging: ['erro', 'bug', 'problema', 'fix', 'corrigir', 'não funciona'],
      optimization: ['otimizar', 'melhorar', 'performance', 'velocidade', 'economia'],
      documentation: ['documentar', 'explicar', 'como funciona', 'entender'],
      deployment: ['deploy', 'publicar', 'produção', 'vercel', 'railway'],
      configuration: ['configurar', 'setup', 'env', 'variável', 'ambiente']
    };

    const intent = {
      type: 'general',
      keywords: [],
      priority: 'normal',
      relatedComponents: []
    };

    // Identifica tipo de intenção
    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => query.toLowerCase().includes(word))) {
        intent.type = type;
        intent.keywords = words.filter(word => query.toLowerCase().includes(word));
        break;
      }
    }

    // Identifica componentes mencionados
    const components = [
      'openrouter', 'agentStudio', 'supabase', 'nextauth', 
      'claude', 'ai', 'dashboard', 'onboarding', 'webhook'
    ];
    
    intent.relatedComponents = components.filter(comp => 
      query.toLowerCase().includes(comp.toLowerCase())
    );

    // Define prioridade
    if (query.includes('urgente') || query.includes('crítico') || query.includes('!')) {
      intent.priority = 'high';
    }

    return intent;
  }

  // Encontra sessões relevantes
  private async findRelevantSessions(intent: any): Promise<any[]> {
    try {
      // Busca sessões recentes
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30); // Últimos 30 dias
      
      const { data: sessionFiles } = await this.octokit.repos.getContent({
        owner: 'lucasnobrega7',
        repo: 'one',
        path: 'claude-memory/sessions'
      }).catch(() => ({ data: [] }));

      const relevantSessions = [];
      
      // Processa cada diretório de data
      for (const dateDir of (sessionFiles as any[]) || []) {
        if (dateDir.type === 'dir') {
          const { data: dayFiles } = await this.octokit.repos.getContent({
            owner: 'lucasnobrega7',
            repo: 'one',
            path: dateDir.path
          });

          // Processa cada sessão do dia
          for (const sessionFile of (dayFiles as any[]) || []) {
            if (sessionFile.name.endsWith('.json')) {
              const session = await this.loadSession(sessionFile.path);
              
              // Calcula relevância
              const relevanceScore = this.calculateRelevance(session, intent);
              
              if (relevanceScore > 0.5) {
                relevantSessions.push({
                  ...session,
                  relevanceScore,
                  path: sessionFile.path
                });
              }
            }
          }
        }
      }

      // Ordena por relevância
      return relevantSessions
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 10);
        
    } catch (error) {
      console.error('Error finding relevant sessions:', error);
      return [];
    }
  }

  // Carrega uma sessão específica
  private async loadSession(path: string): Promise<any> {
    // Verifica cache primeiro
    if (this.sessionCache.has(path)) {
      return this.sessionCache.get(path);
    }

    try {
      const { data: file } = await this.octokit.repos.getContent({
        owner: 'lucasnobrega7',
        repo: 'one',
        path
      });

      if (file.content) {
        const session = JSON.parse(
          Buffer.from(file.content, 'base64').toString()
        );
        
        // Adiciona ao cache
        this.sessionCache.set(path, session);
        
        return session;
      }
    } catch (error) {
      console.error(`Error loading session ${path}:`, error);
    }

    return null;
  }

  // Calcula relevância de uma sessão
  private calculateRelevance(session: any, intent: any): number {
    if (!session) return 0;
    
    let score = 0;
    
    // Verifica keywords nos comandos
    if (session.commands) {
      for (const command of session.commands) {
        for (const keyword of intent.keywords) {
          if (command.toLowerCase().includes(keyword)) {
            score += 0.2;
          }
        }
      }
    }
    
    // Verifica componentes relacionados
    if (session.filesModified) {
      for (const file of session.filesModified) {
        for (const component of intent.relatedComponents) {
          if (file.toLowerCase().includes(component)) {
            score += 0.3;
          }
        }
      }
    }
    
    // Boost para sessões recentes
    const sessionDate = new Date(session.timestamp);
    const daysSince = (Date.now() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, (30 - daysSince) / 30) * 0.2;
    
    // Boost para sessões com decisões
    if (session.decisions && session.decisions.length > 0) {
      score += 0.1;
    }
    
    // Boost para sessões com insights
    if (session.insights && session.insights.length > 0) {
      score += 0.1;
    }
    
    return Math.min(score, 1);
  }

  // Identifica padrões de trabalho
  private async identifyWorkPatterns(sessions: any[]): Promise<WorkPattern[]> {
    const patterns: Map<string, WorkPattern> = new Map();
    
    // Analisa horários de trabalho
    const timePatterns = this.analyzeTimePatterns(sessions);
    
    // Analisa sequências de comandos
    const commandPatterns = this.analyzeCommandPatterns(sessions);
    
    // Analisa modificações de arquivos
    const filePatterns = this.analyzeFilePatterns(sessions);
    
    // Combina padrões
    return [
      ...timePatterns,
      ...commandPatterns,
      ...filePatterns
    ].filter(p => p.frequency > 2); // Apenas padrões que ocorreram mais de 2 vezes
  }

  // Analisa padrões de horário
  private analyzeTimePatterns(sessions: any[]): WorkPattern[] {
    const hourCounts: Map<number, number> = new Map();
    
    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
    
    const patterns: WorkPattern[] = [];
    
    // Identifica horários mais produtivos
    const sortedHours = Array.from(hourCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (sortedHours.length > 0) {
      patterns.push({
        type: 'productive-hours',
        frequency: sortedHours[0][1],
        timeOfDay: `${sortedHours[0][0]}:00 - ${sortedHours[0][0] + 1}:00`,
        relatedFiles: []
      });
    }
    
    return patterns;
  }

  // Analisa padrões de comandos
  private analyzeCommandPatterns(sessions: any[]): WorkPattern[] {
    const commandSequences: Map<string, number> = new Map();
    
    sessions.forEach(session => {
      if (session.commands && session.commands.length > 1) {
        // Cria sequências de 2 comandos
        for (let i = 0; i < session.commands.length - 1; i++) {
          const sequence = `${session.commands[i]} → ${session.commands[i + 1]}`;
          commandSequences.set(sequence, (commandSequences.get(sequence) || 0) + 1);
        }
      }
    });
    
    return Array.from(commandSequences.entries())
      .filter(([_, count]) => count > 2)
      .map(([sequence, count]) => ({
        type: 'command-sequence',
        frequency: count,
        relatedFiles: [],
        sequence
      }));
  }

  // Analisa padrões de arquivos
  private analyzeFilePatterns(sessions: any[]): WorkPattern[] {
    const fileGroups: Map<string, Set<string>> = new Map();
    
    sessions.forEach(session => {
      if (session.filesModified && session.filesModified.length > 1) {
        // Agrupa arquivos modificados juntos
        const key = session.filesModified.sort().join('|');
        if (!fileGroups.has(key)) {
          fileGroups.set(key, new Set(session.filesModified));
        }
      }
    });
    
    return Array.from(fileGroups.entries())
      .filter(([_, files]) => files.size > 1)
      .map(([key, files]) => ({
        type: 'file-group',
        frequency: sessions.filter(s => 
          s.filesModified && 
          s.filesModified.some((f: string) => files.has(f))
        ).length,
        relatedFiles: Array.from(files)
      }));
  }

  // Gera sugestões baseadas em padrões
  private generateSuggestions(patterns: WorkPattern[], intent: any): string[] {
    const suggestions: string[] = [];
    
    // Sugestões baseadas em horário
    const productiveHours = patterns.find(p => p.type === 'productive-hours');
    if (productiveHours) {
      const currentHour = new Date().getHours();
      const productiveHour = parseInt(productiveHours.timeOfDay?.split(':')[0] || '0');
      
      if (Math.abs(currentHour - productiveHour) > 3) {
        suggestions.push(
          `Você costuma ser mais produtivo entre ${productiveHours.timeOfDay}. ` +
          `Considere trabalhar em tarefas complexas nesse horário.`
        );
      }
    }
    
    // Sugestões baseadas em sequências de comandos
    const commandPatterns = patterns.filter(p => p.type === 'command-sequence');
    if (commandPatterns.length > 0 && intent.type === 'implementation') {
      suggestions.push(
        `Baseado no seu histórico, após implementações você geralmente executa: ` +
        commandPatterns[0].sequence
      );
    }
    
    // Sugestões baseadas em grupos de arquivos
    const fileGroups = patterns.filter(p => p.type === 'file-group');
    if (fileGroups.length > 0 && intent.relatedComponents.length > 0) {
      const relevantGroup = fileGroups.find(g => 
        g.relatedFiles.some(f => 
          intent.relatedComponents.some((c: string) => f.includes(c))
        )
      );
      
      if (relevantGroup) {
        suggestions.push(
          `Ao trabalhar com ${intent.relatedComponents[0]}, você geralmente modifica também: ` +
          relevantGroup.relatedFiles.filter(f => !f.includes(intent.relatedComponents[0])).join(', ')
        );
      }
    }
    
    // Sugestões específicas por tipo de intenção
    switch (intent.type) {
      case 'implementation':
        suggestions.push('Lembre-se de atualizar os testes após a implementação');
        suggestions.push('Considere atualizar a documentação em CLAUDE.md');
        break;
        
      case 'debugging':
        suggestions.push('Verifique os logs em Vercel e Railway');
        suggestions.push('Use o dashboard de AI test para validar integrações');
        break;
        
      case 'optimization':
        suggestions.push('A margem atual é de 87% - foque em manter essa eficiência');
        suggestions.push('Considere usar modelos mais rápidos do OpenRouter para tarefas simples');
        break;
        
      case 'deployment':
        suggestions.push('Execute npm run build && npm run lint antes do deploy');
        suggestions.push('Verifique as variáveis de ambiente no Vercel');
        break;
    }
    
    return suggestions;
  }

  // Encontra arquivos relacionados
  private async findRelatedFiles(intent: any, sessions: any[]): Promise<string[]> {
    const relatedFiles = new Set<string>();
    
    // Arquivos dos componentes mencionados
    const componentFileMap: { [key: string]: string[] } = {
      openrouter: [
        'lib/ai/smart-ai-client.ts',
        'lib/ai/providers/openrouter.ts',
        'hooks/use-ai-unified.ts'
      ],
      agentStudio: [
        'components/agents/flow-builder-enhanced.tsx',
        'app/dashboard/flow/page.tsx',
        'hooks/use-flow-builder.ts'
      ],
      supabase: [
        'lib/supabase/client.ts',
        'lib/supabase/server.ts',
        'supabase/migrations/'
      ],
      dashboard: [
        'app/dashboard/page.tsx',
        'app/dashboard/layout.tsx',
        'components/dashboard/'
      ]
    };
    
    // Adiciona arquivos dos componentes
    intent.relatedComponents.forEach((component: string) => {
      const files = componentFileMap[component.toLowerCase()];
      if (files) {
        files.forEach(f => relatedFiles.add(f));
      }
    });
    
    // Adiciona arquivos das sessões relevantes
    sessions.forEach(session => {
      if (session.filesModified) {
        session.filesModified.forEach((file: string) => {
          if (session.relevanceScore > 0.7) {
            relatedFiles.add(file);
          }
        });
      }
    });
    
    // Adiciona arquivos core sempre relevantes
    const coreFiles = [
      'CLAUDE.md',
      'package.json',
      '.env.local',
      'next.config.js'
    ];
    
    coreFiles.forEach(f => relatedFiles.add(f));
    
    return Array.from(relatedFiles).slice(0, 20);
  }

  // Carrega contexto ativo
  private async loadActiveContext(): Promise<any> {
    try {
      // Carrega estado do projeto
      const { data: projectState } = await this.octokit.repos.getContent({
        owner: 'lucasnobrega7',
        repo: 'one',
        path: 'claude-memory/knowledge/project-state.json'
      }).catch(() => ({ data: null }));

      if (projectState?.content) {
        return JSON.parse(
          Buffer.from(projectState.content, 'base64').toString()
        );
      }
    } catch (error) {
      console.error('Error loading active context:', error);
    }

    return {
      lastUpdate: new Date(),
      recentSessions: [],
      filesModified: [],
      metrics: {}
    };
  }

  // Gera insights históricos
  private generateHistoricalInsights(sessions: any[], patterns: WorkPattern[]): string[] {
    const insights: string[] = [];
    
    // Análise de produtividade
    if (sessions.length > 5) {
      const avgCommandsPerSession = sessions.reduce((sum, s) => 
        sum + (s.commands?.length || 0), 0
      ) / sessions.length;
      
      insights.push(
        `Média de ${Math.round(avgCommandsPerSession)} comandos por sessão nos últimos ${sessions.length} trabalhos`
      );
    }
    
    // Análise de foco
    const fileModificationCounts = new Map<string, number>();
    sessions.forEach(s => {
      s.filesModified?.forEach((file: string) => {
        fileModificationCounts.set(file, (fileModificationCounts.get(file) || 0) + 1);
      });
    });
    
    const mostModifiedFiles = Array.from(fileModificationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (mostModifiedFiles.length > 0) {
      insights.push(
        `Arquivos mais modificados: ${mostModifiedFiles.map(([f, c]) => `${f} (${c}x)`).join(', ')}`
      );
    }
    
    // Análise de decisões
    const totalDecisions = sessions.reduce((sum, s) => 
      sum + (s.decisions?.length || 0), 0
    );
    
    if (totalDecisions > 0) {
      insights.push(
        `${totalDecisions} decisões arquiteturais tomadas nas últimas ${sessions.length} sessões`
      );
    }
    
    // Análise de padrões
    if (patterns.length > 0) {
      insights.push(
        `${patterns.length} padrões de trabalho identificados no seu histórico`
      );
    }
    
    return insights;
  }

  // Pré-carrega cache
  private async preloadCache() {
    try {
      // Carrega sessões dos últimos 7 dias para cache
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 7);
      
      const { data: sessionDirs } = await this.octokit.repos.getContent({
        owner: 'lucasnobrega7',
        repo: 'one',
        path: 'claude-memory/sessions'
      }).catch(() => ({ data: [] }));

      for (const dir of (sessionDirs as any[]) || []) {
        if (dir.type === 'dir') {
          const dirDate = new Date(dir.name);
          if (dirDate >= recentDate) {
            const { data: files } = await this.octokit.repos.getContent({
              owner: 'lucasnobrega7',
              repo: 'one',
              path: dir.path
            });

            for (const file of (files as any[]) || []) {
              if (file.name.endsWith('.json')) {
                this.loadSession(file.path); // Carrega para cache
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error preloading cache:', error);
    }
  }

  // Limpa cache antigo
  public clearOldCache() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const [path, session] of this.sessionCache.entries()) {
      if (new Date(session.timestamp).getTime() < oneWeekAgo) {
        this.sessionCache.delete(path);
      }
    }
  }
}

// Hook React
export function useSmartRecall() {
  const [recall, setRecall] = useState<SmartRecall | null>(null);
  const [context, setContext] = useState<RecallContext | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const githubToken = process.env.NEXT_PUBLIC_GITHUB_MEMORY_TOKEN;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (githubToken && supabaseUrl && supabaseKey) {
      setRecall(new SmartRecall(githubToken, supabaseUrl, supabaseKey));
    }
  }, []);

  const loadContext = useCallback(async (query: string) => {
    if (!recall) return;

    setLoading(true);
    try {
      const ctx = await recall.loadRelevantContext(query);
      setContext(ctx);
    } catch (error) {
      console.error('Error loading context:', error);
    } finally {
      setLoading(false);
    }
  }, [recall]);

  return { context, loading, loadContext };
}
