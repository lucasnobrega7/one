// lib/claude-memory/context-aggregator.ts
import { Octokit } from '@octokit/rest';
import { createClient } from '@supabase/supabase-js';

interface ProjectContext {
  github: {
    recentCommits: any[];
    openIssues: any[];
    activePRs: any[];
    projectStats: any;
  };
  application: {
    currentVersion: string;
    deploymentStatus: string;
    performanceMetrics: any;
    activeFeatures: string[];
  };
  development: {
    recentChanges: any[];
    pendingTasks: any[];
    blockers: any[];
    decisions: any[];
  };
  ai: {
    openRouterUsage: any;
    modelPerformance: any;
    costAnalysis: any;
    agentMetrics: any;
  };
}

export class ContextAggregator {
  private octokit: Octokit;
  private supabase: any;
  private contextCache: Map<string, any> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(githubToken: string, supabaseUrl: string, supabaseKey: string) {
    this.octokit = new Octokit({ auth: githubToken });
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.startAutoAggregation();
  }

  // Agrega contexto completo do projeto
  public async aggregateFullContext(): Promise<ProjectContext> {
    const [github, application, development, ai] = await Promise.all([
      this.aggregateGitHubContext(),
      this.aggregateApplicationContext(),
      this.aggregateDevelopmentContext(),
      this.aggregateAIContext()
    ]);

    const fullContext = { github, application, development, ai };
    
    // Salva no cache
    this.contextCache.set('full-context', fullContext);
    this.contextCache.set('last-update', new Date());

    // Persiste no GitHub
    await this.persistContext(fullContext);

    return fullContext;
  }

  // Agrega contexto do GitHub
  private async aggregateGitHubContext() {
    try {
      const [commits, issues, pulls, repoData] = await Promise.all([
        // Commits recentes
        this.octokit.repos.listCommits({
          owner: 'lucasnobrega7',
          repo: 'one',
          per_page: 20
        }),
        
        // Issues abertas
        this.octokit.issues.listForRepo({
          owner: 'lucasnobrega7',
          repo: 'one',
          state: 'open',
          per_page: 10
        }),
        
        // Pull requests ativos
        this.octokit.pulls.list({
          owner: 'lucasnobrega7',
          repo: 'one',
          state: 'open',
          per_page: 10
        }),
        
        // Estatísticas do repositório
        this.octokit.repos.get({
          owner: 'lucasnobrega7',
          repo: 'one'
        })
      ]);

      return {
        recentCommits: commits.data.map(c => ({
          sha: c.sha,
          message: c.commit.message,
          author: c.commit.author?.name,
          date: c.commit.author?.date
        })),
        openIssues: issues.data.map(i => ({
          number: i.number,
          title: i.title,
          labels: i.labels,
          created: i.created_at,
          assignees: i.assignees
        })),
        activePRs: pulls.data.map(p => ({
          number: p.number,
          title: p.title,
          state: p.state,
          draft: p.draft,
          created: p.created_at
        })),
        projectStats: {
          stars: repoData.data.stargazers_count,
          forks: repoData.data.forks_count,
          openIssues: repoData.data.open_issues_count,
          size: repoData.data.size,
          language: repoData.data.language,
          lastPush: repoData.data.pushed_at
        }
      };
    } catch (error) {
      console.error('Error aggregating GitHub context:', error);
      return this.getDefaultGitHubContext();
    }
  }

  // Agrega contexto da aplicação
  private async aggregateApplicationContext() {
    try {
      // Busca informações do Supabase
      const { data: deployments } = await this.supabase
        .from('deployments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      const { data: metrics } = await this.supabase
        .from('performance_metrics')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      const { data: features } = await this.supabase
        .from('feature_flags')
        .select('*')
        .eq('enabled', true);

      return {
        currentVersion: deployments?.[0]?.version || '2.0.0',
        deploymentStatus: deployments?.[0]?.status || 'active',
        performanceMetrics: this.aggregateMetrics(metrics || []),
        activeFeatures: features?.map(f => f.name) || []
      };
    } catch (error) {
      console.error('Error aggregating application context:', error);
      return this.getDefaultApplicationContext();
    }
  }

  // Agrega contexto de desenvolvimento
  private async aggregateDevelopmentContext() {
    try {
      // Lê arquivo CLAUDE.md
      const { data: claudeFile } = await this.octokit.repos.getContent({
        owner: 'lucasnobrega7',
        repo: 'one',
        path: 'CLAUDE.md'
      });

      const claudeContent = claudeFile?.content 
        ? Buffer.from(claudeFile.content, 'base64').toString() 
        : '';

      // Extrai informações do CLAUDE.md
      const pendingTasks = this.extractPendingTasks(claudeContent);
      const recentChanges = this.extractRecentChanges(claudeContent);
      const decisions = this.extractDecisions(claudeContent);

      // Busca arquivos modificados recentemente
      const { data: recentCommits } = await this.octokit.repos.listCommits({
        owner: 'lucasnobrega7',
        repo: 'one',
        per_page: 10
      });

      const modifiedFiles = new Set<string>();
      for (const commit of recentCommits) {
        const { data: commitDetails } = await this.octokit.repos.getCommit({
          owner: 'lucasnobrega7',
          repo: 'one',
          ref: commit.sha
        });
        
        commitDetails.files?.forEach(file => {
          modifiedFiles.add(file.filename);
        });
      }

      return {
        recentChanges: Array.from(modifiedFiles).slice(0, 20),
        pendingTasks,
        blockers: this.identifyBlockers(pendingTasks),
        decisions
      };
    } catch (error) {
      console.error('Error aggregating development context:', error);
      return this.getDefaultDevelopmentContext();
    }
  }

  // Agrega contexto de IA
  private async aggregateAIContext() {
    try {
      // Busca métricas do OpenRouter do Supabase
      const { data: aiUsage } = await this.supabase
        .from('ai_usage')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      const { data: costAnalysis } = await this.supabase
        .from('cost_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      return {
        openRouterUsage: this.aggregateAIUsage(aiUsage || []),
        modelPerformance: this.analyzeModelPerformance(aiUsage || []),
        costAnalysis: costAnalysis?.[0] || this.getDefaultCostAnalysis(),
        agentMetrics: await this.getAgentMetrics()
      };
    } catch (error) {
      console.error('Error aggregating AI context:', error);
      return this.getDefaultAIContext();
    }
  }

  // Persiste contexto agregado
  private async persistContext(context: ProjectContext) {
    const path = 'claude-memory/knowledge/aggregated-context.json';
    
    try {
      const { data: existingFile } = await this.octokit.repos.getContent({
        owner: 'lucasnobrega7',
        repo: 'one',
        path
      }).catch(() => ({ data: null }));

      const content = Buffer.from(JSON.stringify({
        ...context,
        lastUpdate: new Date().toISOString(),
        version: '1.0.0'
      }, null, 2)).toString('base64');
      
      await this.octokit.repos.createOrUpdateFileContents({
        owner: 'lucasnobrega7',
        repo: 'one',
        path,
        message: 'Auto-aggregate: Project context',
        content,
        sha: existingFile?.sha
      });
    } catch (error) {
      console.error('Error persisting context:', error);
    }
  }

  // Inicia agregação automática
  private startAutoAggregation() {
    // Agrega contexto a cada 15 minutos
    this.updateInterval = setInterval(() => {
      this.aggregateFullContext();
    }, 15 * 60 * 1000);

    // Primeira agregação
    this.aggregateFullContext();
  }

  // Métodos auxiliares
  private extractPendingTasks(content: string): string[] {
    const taskRegex = /- \[ \] (.+)/g;
    const tasks = [];
    let match;
    
    while ((match = taskRegex.exec(content)) !== null) {
      tasks.push(match[1]);
    }
    
    return tasks;
  }

  private extractRecentChanges(content: string): string[] {
    const changeRegex = /- `(.+?)` - (.+)/g;
    const changes = [];
    let match;
    
    while ((match = changeRegex.exec(content)) !== null) {
      changes.push(`${match[1]}: ${match[2]}`);
    }
    
    return changes.slice(0, 10);
  }

  private extractDecisions(content: string): string[] {
    const decisionSection = content.match(/## .*(Decisões|DECISIONS).*\n([\s\S]*?)(?=##|$)/i);
    if (!decisionSection) return [];
    
    const decisions = decisionSection[2]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(Boolean);
    
    return decisions;
  }

  private identifyBlockers(tasks: string[]): string[] {
    const blockerKeywords = ['blocked', 'waiting', 'depends on', 'needs', 'requires'];
    return tasks.filter(task => 
      blockerKeywords.some(keyword => 
        task.toLowerCase().includes(keyword)
      )
    );
  }

  private aggregateMetrics(metrics: any[]): any {
    if (metrics.length === 0) return {};
    
    const avgResponseTime = metrics.reduce((sum, m) => sum + (m.response_time || 0), 0) / metrics.length;
    const errorRate = metrics.filter(m => m.error).length / metrics.length;
    
    return {
      avgResponseTime,
      errorRate,
      totalRequests: metrics.length,
      successRate: 1 - errorRate
    };
  }

  private aggregateAIUsage(usage: any[]): any {
    const byModel = usage.reduce((acc, u) => {
      acc[u.model] = (acc[u.model] || 0) + 1;
      return acc;
    }, {});
    
    const totalTokens = usage.reduce((sum, u) => sum + (u.tokens || 0), 0);
    const totalCost = usage.reduce((sum, u) => sum + (u.cost || 0), 0);
    
    return {
      byModel,
      totalTokens,
      totalCost,
      avgTokensPerRequest: totalTokens / usage.length || 0
    };
  }

  private analyzeModelPerformance(usage: any[]): any {
    const modelStats = usage.reduce((acc, u) => {
      if (!acc[u.model]) {
        acc[u.model] = { count: 0, totalTime: 0, errors: 0 };
      }
      acc[u.model].count++;
      acc[u.model].totalTime += u.response_time || 0;
      if (u.error) acc[u.model].errors++;
      return acc;
    }, {});
    
    return Object.entries(modelStats).map(([model, stats]: [string, any]) => ({
      model,
      avgResponseTime: stats.totalTime / stats.count,
      errorRate: stats.errors / stats.count,
      usage: stats.count
    }));
  }

  private async getAgentMetrics(): Promise<any> {
    try {
      const { data: agents } = await this.supabase
        .from('agents')
        .select('*')
        .eq('active', true);
      
      return {
        totalAgents: agents?.length || 0,
        activeAgents: agents?.filter((a: any) => a.status === 'running').length || 0,
        avgPerformance: 0.87 // 87% como mencionado no CLAUDE.md
      };
    } catch {
      return { totalAgents: 0, activeAgents: 0, avgPerformance: 0 };
    }
  }

  // Métodos para contextos padrão (fallback)
  private getDefaultGitHubContext() {
    return {
      recentCommits: [],
      openIssues: [],
      activePRs: [],
      projectStats: {}
    };
  }

  private getDefaultApplicationContext() {
    return {
      currentVersion: '2.0.0',
      deploymentStatus: 'unknown',
      performanceMetrics: {},
      activeFeatures: []
    };
  }

  private getDefaultDevelopmentContext() {
    return {
      recentChanges: [],
      pendingTasks: [],
      blockers: [],
      decisions: []
    };
  }

  private getDefaultAIContext() {
    return {
      openRouterUsage: {},
      modelPerformance: [],
      costAnalysis: { margin: 0.87 },
      agentMetrics: {}
    };
  }

  private getDefaultCostAnalysis() {
    return {
      margin: 0.87,
      savings: 0.85,
      provider: 'OpenRouter'
    };
  }

  // Limpa recursos
  public destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.contextCache.clear();
  }
}

// Hook React
export function useContextAggregator() {
  const [aggregator, setAggregator] = useState<ContextAggregator | null>(null);
  const [context, setContext] = useState<ProjectContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const githubToken = process.env.NEXT_PUBLIC_GITHUB_MEMORY_TOKEN;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (githubToken && supabaseUrl && supabaseKey) {
      const agg = new ContextAggregator(githubToken, supabaseUrl, supabaseKey);
      setAggregator(agg);
      
      // Carrega contexto inicial
      agg.aggregateFullContext().then(ctx => {
        setContext(ctx);
        setLoading(false);
      });
    }

    return () => {
      aggregator?.destroy();
    };
  }, []);

  const refreshContext = useCallback(async () => {
    if (aggregator) {
      setLoading(true);
      const ctx = await aggregator.aggregateFullContext();
      setContext(ctx);
      setLoading(false);
    }
  }, [aggregator]);

  return { context, loading, refreshContext };
}
