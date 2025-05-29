/**
 * N8N Cache Service (Mock Implementation)
 * Simplified version without Redis for faster build
 */

interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export class N8nCache {
  private prefix: string = 'n8n:';
  private memoryCache: Map<string, { data: any; expires: number }> = new Map();

  constructor(config?: CacheConfig) {
    console.log('N8N Cache initialized (Memory-based)');
  }

  async cacheWorkflows(workflows: any[], ttl: number = 300): Promise<void> {
    const key = `${this.prefix}workflows`;
    this.memoryCache.set(key, {
      data: workflows,
      expires: Date.now() + (ttl * 1000)
    });
  }

  async getCachedWorkflows(): Promise<any[] | null> {
    const key = `${this.prefix}workflows`;
    const cached = this.memoryCache.get(key);
    
    if (!cached || cached.expires < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  async cacheExecution(executionId: string, result: any, ttl: number = 3600): Promise<void> {
    const key = `${this.prefix}execution:${executionId}`;
    this.memoryCache.set(key, {
      data: result,
      expires: Date.now() + (ttl * 1000)
    });
  }

  async getCachedExecution(executionId: string): Promise<any | null> {
    const key = `${this.prefix}execution:${executionId}`;
    const cached = this.memoryCache.get(key);
    
    if (!cached || cached.expires < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  async cacheWorkflowStatus(workflowId: string, status: any, ttl: number = 60): Promise<void> {
    const key = `${this.prefix}workflow:${workflowId}:status`;
    this.memoryCache.set(key, {
      data: status,
      expires: Date.now() + (ttl * 1000)
    });
  }

  async getCachedWorkflowStatus(workflowId: string): Promise<any | null> {
    const key = `${this.prefix}workflow:${workflowId}:status`;
    const cached = this.memoryCache.get(key);
    
    if (!cached || cached.expires < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  async invalidateWorkflowsCache(): Promise<void> {
    this.memoryCache.delete(`${this.prefix}workflows`);
  }

  async invalidateExecutionCache(executionId: string): Promise<void> {
    this.memoryCache.delete(`${this.prefix}execution:${executionId}`);
  }

  async checkRateLimit(key: string, limit: number = 100, window: number = 3600): Promise<boolean> {
    // Simple in-memory rate limiting
    return true; // Allow for now
  }

  async cacheStats(stats: any, ttl: number = 300): Promise<void> {
    const key = `${this.prefix}stats`;
    this.memoryCache.set(key, {
      data: stats,
      expires: Date.now() + (ttl * 1000)
    });
  }

  async getCachedStats(): Promise<any | null> {
    const key = `${this.prefix}stats`;
    const cached = this.memoryCache.get(key);
    
    if (!cached || cached.expires < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  async clearAllCache(): Promise<void> {
    this.memoryCache.clear();
  }

  async isConnected(): Promise<boolean> {
    return true;
  }

  async disconnect(): Promise<void> {
    this.memoryCache.clear();
  }
}

// Singleton instance
let n8nCache: N8nCache | null = null;

export const getN8nCache = (): N8nCache => {
  if (!n8nCache) {
    n8nCache = new N8nCache();
  }
  return n8nCache;
};

export default N8nCache;