import { apiClient } from './api-client'
import { cacheService } from './cache-service'
import { unifiedConfig, isExternalApiAvailable } from './config'
import { createClient } from '@/utils/supabase/server'
import { AgentDataAdapter, ConversationDataAdapter } from './dto/agent.dto'
import type { UnifiedAgent, UnifiedConversation, UnifiedMessage } from './dto/agent.dto'

export class FallbackService {
  private supabase = createClient()
  private apiHealthy = true
  private lastHealthCheck = 0
  private healthCheckInterval = 30000 // 30 seconds
  
  // Check API health periodically
  private async checkApiHealth(): Promise<boolean> {
    if (Date.now() - this.lastHealthCheck < this.healthCheckInterval) {
      return this.apiHealthy
    }
    
    this.lastHealthCheck = Date.now()
    this.apiHealthy = await isExternalApiAvailable()
    return this.apiHealthy
  }
  
  // Agent operations with fallback
  async getAgent(id: string): Promise<UnifiedAgent | null> {
    // Check cache first
    if (unifiedConfig.ENABLE_CACHE) {
      const cached = await cacheService.getAgent(id)
      if (cached) return cached
    }
    
    // Try external API if available
    if (unifiedConfig.USE_EXTERNAL_API && await this.checkApiHealth()) {
      try {
        const response = await apiClient.getAgent(id)
        if (response.success && response.data) {
          // Cache the result
          if (unifiedConfig.ENABLE_CACHE) {
            await cacheService.setAgent(response.data)
          }
          return response.data
        }
      } catch (error) {
        console.error('API error, falling back to local:', error)
      }
    }
    
    // Fall back to local database
    if (unifiedConfig.USE_LOCAL_DB) {
      const { data, error } = await this.supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single()
        
      if (!error && data) {
        const agent = AgentDataAdapter.fromSupabase(data)
        // Cache the result
        if (unifiedConfig.ENABLE_CACHE) {
          await cacheService.setAgent(agent)
        }
        return agent
      }
    }
    
    return null
  }
  
  async listAgents(filters?: { userId?: string; isPublic?: boolean }): Promise<UnifiedAgent[]> {
    const cacheKey = `agents:${filters?.userId || 'all'}:${filters?.isPublic || 'all'}`
    
    // Check cache first
    if (unifiedConfig.ENABLE_CACHE) {
      const cached = await cacheService.getList<UnifiedAgent>(cacheKey)
      if (cached) return cached
    }
    
    // Try external API if available
    if (unifiedConfig.USE_EXTERNAL_API && await this.checkApiHealth()) {
      try {
        const response = await apiClient.listAgents(filters)
        if (response.success && response.data) {
          // Cache the result
          if (unifiedConfig.ENABLE_CACHE) {
            await cacheService.setList(cacheKey, response.data)
          }
          return response.data
        }
      } catch (error) {
        console.error('API error, falling back to local:', error)
      }
    }
    
    // Fall back to local database
    if (unifiedConfig.USE_LOCAL_DB) {
      let query = this.supabase.from('agents').select('*')
      
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters?.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (!error && data) {
        const agents = data.map(AgentDataAdapter.fromSupabase)
        // Cache the result
        if (unifiedConfig.ENABLE_CACHE) {
          await cacheService.setList(cacheKey, agents)
        }
        return agents
      }
    }
    
    return []
  }
  
  async createAgent(agent: UnifiedAgent): Promise<UnifiedAgent | null> {
    // Always try external API first for write operations
    if (unifiedConfig.USE_EXTERNAL_API && await this.checkApiHealth()) {
      const response = await apiClient.createAgent(agent)
      if (response.success && response.data) {
        // Also save locally for redundancy
        if (unifiedConfig.USE_LOCAL_DB) {
          await this.supabase
            .from('agents')
            .upsert(AgentDataAdapter.toSupabase(response.data))
        }
        
        // Invalidate cache
        cacheService.invalidateAgent(response.data.id)
        
        return response.data
      }
    }
    
    // Fall back to local only if API is disabled or unavailable
    if (unifiedConfig.USE_LOCAL_DB) {
      const { data, error } = await this.supabase
        .from('agents')
        .insert(AgentDataAdapter.toSupabase(agent))
        .select()
        .single()
        
      if (!error && data) {
        const createdAgent = AgentDataAdapter.fromSupabase(data)
        // Mark for sync later
        createdAgent.syncStatus = 'pending'
        
        // Invalidate cache
        cacheService.invalidateAgent(createdAgent.id)
        
        return createdAgent
      }
    }
    
    return null
  }
  
  // Chat operations with fallback
  async invokeAgent(
    agentId: string, 
    message: string, 
    conversationId?: string
  ): Promise<UnifiedMessage | null> {
    // For real-time operations, prefer external API
    if (unifiedConfig.USE_EXTERNAL_API && await this.checkApiHealth()) {
      const response = await apiClient.invokeAgent(agentId, message, conversationId)
      if (response.success && response.data) {
        // Save message locally for history
        if (unifiedConfig.USE_LOCAL_DB && conversationId) {
          await this.supabase
            .from('messages')
            .insert({
              conversation_id: conversationId,
              role: response.data.role,
              content: response.data.content,
              metadata: response.data.metadata
            })
        }
        return response.data
      }
    }
    
    // Fall back to local AI if available
    if (unifiedConfig.USE_LOCAL_AI) {
      // Import dynamically to avoid circular dependencies
      const { generateResponse } = await import('../ai-client')
      
      // Get agent configuration
      const agent = await this.getAgent(agentId)
      if (!agent) return null
      
      try {
        const aiResponse = await generateResponse(
          `${agent.instructions}\n\nUser: ${message}`,
          agent.modelId,
          { temperature: agent.temperature }
        )
        
        const responseMessage: UnifiedMessage = {
          id: crypto.randomUUID(),
          conversationId: conversationId || '',
          role: 'assistant',
          content: aiResponse.choices[0].message.content || '',
          createdAt: new Date(),
          metadata: { model: agent.modelId }
        }
        
        // Save to database
        if (unifiedConfig.USE_LOCAL_DB && conversationId) {
          await this.supabase
            .from('messages')
            .insert({
              conversation_id: conversationId,
              role: responseMessage.role,
              content: responseMessage.content,
              metadata: responseMessage.metadata
            })
        }
        
        return responseMessage
      } catch (error) {
        console.error('Local AI error:', error)
      }
    }
    
    return null
  }
  
  // Streaming with fallback
  async *invokeAgentStream(
    agentId: string,
    message: string,
    conversationId?: string
  ) {
    // Try external API first
    if (unifiedConfig.USE_EXTERNAL_API && await this.checkApiHealth()) {
      try {
        yield* apiClient.invokeAgentStream(agentId, message, conversationId)
        return
      } catch (error) {
        console.error('Streaming API error:', error)
      }
    }
    
    // Fall back to non-streaming response
    const response = await this.invokeAgent(agentId, message, conversationId)
    if (response) {
      yield { content: response.content, done: true }
    } else {
      yield { error: 'No available service for streaming' }
    }
  }
  
  // Retry logic for critical operations
  async withRetry<T>(
    operation: () => Promise<T>,
    retries = unifiedConfig.RETRY_ATTEMPTS
  ): Promise<T | null> {
    let lastError: Error | null = null
    
    for (let i = 0; i < retries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        console.error(`Attempt ${i + 1} failed:`, error)
        
        if (i < retries - 1) {
          // Exponential backoff
          const delay = unifiedConfig.RETRY_DELAY_MS * Math.pow(2, i)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    console.error('All retry attempts failed:', lastError)
    return null
  }
}

// Singleton instance
export const fallbackService = new FallbackService()