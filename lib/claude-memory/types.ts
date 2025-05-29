// types/claude-memory.ts

export interface ClaudeSession {
  id: string;
  sessionId: string;
  timestamp: Date;
  duration?: number;
  summary?: string;
  context: SessionContext;
  metadata: SessionMetadata;
}

export interface SessionContext {
  projectState: ProjectState;
  filesModified: string[];
  commands: string[];
  decisions: string[];
  insights: string[];
  errors?: ErrorEntry[];
}

export interface ProjectState {
  version: string;
  branch: string;
  lastCommit?: string;
  environment: 'development' | 'staging' | 'production';
  activeFeatures: string[];
  performance: PerformanceMetrics;
}

export interface SessionMetadata {
  duration: number;
  impactScore: number;
  tags: string[];
  relatedIssues?: number[];
  relatedPRs?: number[];
}

export interface WorkPattern {
  type: 'productive-hours' | 'command-sequence' | 'file-group' | 'feature-pattern';
  frequency: number;
  confidence: number;
  timeOfDay?: string;
  relatedFiles: string[];
  avgDuration?: number;
  sequence?: string;
  description?: string;
}

export interface MemoryContext {
  timestamp: Date;
  sessionId: string;
  projectState: ProjectState;
  filesModified: string[];
  commands: string[];
  decisions: string[];
  insights: string[];
}

export interface ProjectContext {
  github: GitHubContext;
  application: ApplicationContext;
  development: DevelopmentContext;
  ai: AIContext;
}

export interface GitHubContext {
  recentCommits: CommitInfo[];
  openIssues: IssueInfo[];
  activePRs: PRInfo[];
  projectStats: ProjectStats;
}

export interface ApplicationContext {
  currentVersion: string;
  deploymentStatus: string;
  performanceMetrics: PerformanceMetrics;
  activeFeatures: string[];
}

export interface DevelopmentContext {
  recentChanges: string[];
  pendingTasks: string[];
  blockers: string[];
  decisions: string[];
}

export interface AIContext {
  openRouterUsage: OpenRouterUsage;
  modelPerformance: ModelPerformance[];
  costAnalysis: CostAnalysis;
  agentMetrics: AgentMetrics;
}

export interface RecallContext {
  relevantSessions: ClaudeSession[];
  workPatterns: WorkPattern[];
  suggestedActions: string[];
  relatedFiles: string[];
  activeContext: ProjectState;
  historicalInsights: string[];
}

export interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  date: string;
  filesChanged?: number;
}

export interface IssueInfo {
  number: number;
  title: string;
  labels: string[];
  created: string;
  assignees: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface PRInfo {
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  draft: boolean;
  created: string;
  author: string;
  reviewers?: string[];
}

export interface ProjectStats {
  stars: number;
  forks: number;
  openIssues: number;
  size: number;
  language: string;
  lastPush: string;
}

export interface PerformanceMetrics {
  avgResponseTime: number;
  errorRate: number;
  totalRequests: number;
  successRate: number;
  p95ResponseTime?: number;
  p99ResponseTime?: number;
}

export interface OpenRouterUsage {
  byModel: Record<string, number>;
  totalTokens: number;
  totalCost: number;
  avgTokensPerRequest: number;
  costSavings?: number;
}

export interface ModelPerformance {
  model: string;
  avgResponseTime: number;
  errorRate: number;
  usage: number;
  satisfaction?: number;
}

export interface CostAnalysis {
  margin: number;
  savings: number;
  provider: string;
  projectedMonthlyCost?: number;
  actualMonthlyCost?: number;
}

export interface AgentMetrics {
  totalAgents: number;
  activeAgents: number;
  avgPerformance: number;
  successRate?: number;
}

export interface ErrorEntry {
  timestamp: Date;
  message: string;
  stack?: string;
  severity: 'warning' | 'error' | 'critical';
  resolved?: boolean;
}

export interface ClaudeMemoryConfig {
  autoSaveInterval: number;
  enableAutoSave: boolean;
  enableContextAggregation: boolean;
  enableSmartRecall: boolean;
  enableVisualIndicator: boolean;
  maxSessionsInCache: number;
  githubToken: string;
  supabaseUrl?: string;
  supabaseKey?: string;
}

export interface ClaudeMemoryHook {
  // Auto Save
  saveContext: (context: Partial<MemoryContext>) => void;
  forceSave: () => Promise<void>;
  
  // Context Aggregator
  projectContext: ProjectContext | null;
  refreshContext: () => Promise<void>;
  
  // Smart Recall
  recallContext: RecallContext | null;
  loadRelevantContext: (query: string) => Promise<void>;
  
  // Utilities
  addFileModified: (filename: string) => void;
  addDecision: (decision: string) => void;
  addInsight: (insight: string) => void;
  
  // State
  isInitialized: boolean;
  isSaving: boolean;
  lastSave: Date | null;
  
  // Stats
  getSessionStats: () => SessionStats;
  clearCache: () => void;
}

export interface SessionStats {
  totalSessions: number;
  totalCommands: number;
  totalDecisions: number;
  totalInsights: number;
  avgSessionDuration: number;
  mostActiveHour: number;
  mostModifiedFiles: Array<{ file: string; count: number }>;
}

// Enums para constantes
export enum MemoryEventType {
  SESSION_START = 'session_start',
  SESSION_END = 'session_end',
  FILE_MODIFIED = 'file_modified',
  COMMAND_EXECUTED = 'command_executed',
  DECISION_MADE = 'decision_made',
  INSIGHT_ADDED = 'insight_added',
  ERROR_OCCURRED = 'error_occurred',
  CONTEXT_SAVED = 'context_saved',
  CONTEXT_LOADED = 'context_loaded'
}

export enum PatternType {
  TIME_BASED = 'time_based',
  SEQUENCE_BASED = 'sequence_based',
  FILE_BASED = 'file_based',
  FEATURE_BASED = 'feature_based'
}

// Tipos de utilidade
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type SessionFilter = {
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  minImpactScore?: number;
  includeErrors?: boolean;
  filePattern?: string;
  commandPattern?: string;
};

// Declaração global para window
declare global {
  interface Window {
    claudeMemory: {
      saveContext: (context: Partial<MemoryContext>) => void;
      forceSave: () => Promise<void>;
      refreshContext: () => Promise<void>;
      loadRelevantContext: (query: string) => Promise<void>;
      addFileModified: (filename: string) => void;
      addDecision: (decision: string) => void;
      addInsight: (insight: string) => void;
    };
  }
}
