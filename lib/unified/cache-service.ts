import { createClient } from '@/utils/supabase/server'
import { unifiedConfig } from './config'
import type { UnifiedAgent, UnifiedConversation, UnifiedMessage } from './dto/agent.dto'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class CacheService {
  private supabase = createClient()
  private memoryCache = new Map<string, CacheEntry<any>>()
  private defaultTTL = unifiedConfig.CACHE_TTL_SECONDS * 1000 // Convert to milliseconds
  
  // Memory cache operations
  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.memoryCache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  private setInMemory<T>(key: string, data: T, ttl?: number): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }
  
  // Database cache operations
  async getFromDatabase<T>(table: string, id: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()
        
      if (error || !data) return null
      
      // Check if data is stale
      const updatedAt = new Date(data.updated_at).getTime()
      if (Date.now() - updatedAt > this.defaultTTL) {
        return null
      }
      
      return data as T
    } catch (error) {
      return null
    }
  }
  
  // Agent caching
  async getAgent(id: string): Promise<UnifiedAgent | null> {
    const cacheKey = `agent:${id}`
    
    // Try memory cache first
    const memoryAgent = this.getFromMemory<UnifiedAgent>(cacheKey)
    if (memoryAgent) return memoryAgent
    
    // Try database cache
    const dbAgent = await this.getFromDatabase<any>('agents', id)
    if (dbAgent) {
      // Convert and cache in memory
      const agent: UnifiedAgent = {
        id: dbAgent.id,
        name: dbAgent.name,
        description: dbAgent.description,
        instructions: dbAgent.system_prompt,
        modelId: dbAgent.model_id,
        temperature: dbAgent.temperature,
        isPublic: dbAgent.is_public,
        userId: dbAgent.user_id,
        createdAt: new Date(dbAgent.created_at),
        updatedAt: new Date(dbAgent.updated_at),
        externalId: dbAgent.external_id,
        syncStatus: dbAgent.sync_status
      }
      
      this.setInMemory(cacheKey, agent)
      return agent
    }
    
    return null
  }
  
  async setAgent(agent: UnifiedAgent): Promise<void> {
    const cacheKey = `agent:${agent.id}`
    
    // Cache in memory
    this.setInMemory(cacheKey, agent)
    
    // Cache in database (upsert)
    if (unifiedConfig.USE_LOCAL_DB) {
      await this.supabase
        .from('agents')
        .upsert({
          id: agent.id,
          name: agent.name,
          description: agent.description,
          system_prompt: agent.instructions,
          model_id: agent.modelId,
          temperature: agent.temperature,
          is_public: agent.isPublic,
          user_id: agent.userId,
          external_id: agent.externalId,
          sync_status: agent.syncStatus,
          updated_at: new Date().toISOString()
        })
    }
  }
  
  // Conversation caching
  async getConversation(id: string): Promise<UnifiedConversation | null> {
    const cacheKey = `conversation:${id}`
    
    // Try memory cache first
    const memoryConv = this.getFromMemory<UnifiedConversation>(cacheKey)
    if (memoryConv) return memoryConv
    
    // Try database cache
    const dbConv = await this.getFromDatabase<any>('conversations', id)
    if (dbConv) {
      // Convert and cache in memory
      const conversation: UnifiedConversation = {
        id: dbConv.id,
        agentId: dbConv.agent_id,
        userId: dbConv.user_id,
        title: dbConv.title,
        messages: [], // Messages loaded separately
        createdAt: new Date(dbConv.created_at),
        updatedAt: new Date(dbConv.updated_at),
        externalId: dbConv.external_id,
        syncStatus: dbConv.sync_status
      }
      
      this.setInMemory(cacheKey, conversation)
      return conversation
    }
    
    return null
  }
  
  async setConversation(conversation: UnifiedConversation): Promise<void> {
    const cacheKey = `conversation:${conversation.id}`
    
    // Cache in memory
    this.setInMemory(cacheKey, conversation)
    
    // Cache in database (upsert)
    if (unifiedConfig.USE_LOCAL_DB) {
      await this.supabase
        .from('conversations')
        .upsert({
          id: conversation.id,
          agent_id: conversation.agentId,
          user_id: conversation.userId,
          title: conversation.title,
          external_id: conversation.externalId,
          sync_status: conversation.syncStatus,
          updated_at: new Date().toISOString()
        })
    }
  }
  
  // List caching (for agent lists, etc.)
  async getList<T>(key: string): Promise<T[] | null> {
    const cacheKey = `list:${key}`
    return this.getFromMemory<T[]>(cacheKey)
  }
  
  async setList<T>(key: string, items: T[], ttl?: number): Promise<void> {
    const cacheKey = `list:${key}`
    this.setInMemory(cacheKey, items, ttl)
  }
  
  // Invalidation
  invalidate(pattern: string): void {
    // Invalidate all keys matching pattern
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key)
      }
    }
  }
  
  invalidateAgent(id: string): void {
    this.memoryCache.delete(`agent:${id}`)
    this.invalidate(`list:agents`) // Invalidate all agent lists
  }
  
  invalidateConversation(id: string): void {
    this.memoryCache.delete(`conversation:${id}`)
    this.invalidate(`list:conversations`) // Invalidate all conversation lists
  }
  
  // Clear all cache
  clearAll(): void {
    this.memoryCache.clear()
  }
  
  // Get cache statistics
  getStats(): {
    size: number
    entries: number
    hitRate: number
  } {
    let totalSize = 0
    let validEntries = 0
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (Date.now() - entry.timestamp <= entry.ttl) {
        validEntries++
        totalSize += JSON.stringify(entry.data).length
      }
    }
    
    return {
      size: totalSize,
      entries: validEntries,
      hitRate: 0 // Would need to track hits/misses for accurate rate
    }
  }
}

// Singleton instance
export const cacheService = new CacheService()