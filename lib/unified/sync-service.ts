import { createClient } from '@/utils/supabase/server-safe'
import { apiClient } from './api-client'
import { AgentDataAdapter, ConversationDataAdapter } from './dto/agent.dto'
import type { UnifiedAgent, UnifiedConversation } from './dto/agent.dto'
import { ApiErrorHandler, ApiErrorType } from './error-handler'
import { unifiedConfig } from './config'

export class SyncService {
  private supabase = createClient()
  private syncInterval = unifiedConfig.SYNC_INTERVAL_MS
  private syncInProgress = false
  private maxRetries = unifiedConfig.RETRY_ATTEMPTS
  private retryDelay = unifiedConfig.RETRY_DELAY_MS
  private healthCheckInterval = 300000 // 5 minutes
  private lastHealthCheck = 0
  private isApiHealthy = true
  
  // Check API health before sync operations
  private async checkApiHealth(): Promise<boolean> {
    const now = Date.now()
    
    // Check health every 5 minutes
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return this.isApiHealthy
    }
    
    try {
      this.isApiHealthy = await apiClient.checkHealth()
      this.lastHealthCheck = now
      
      if (!this.isApiHealthy) {
        console.warn('External API is not healthy, sync operations will be skipped')
      }
      
      return this.isApiHealthy
    } catch (error) {
      console.error('Health check failed:', error)
      this.isApiHealthy = false
      this.lastHealthCheck = now
      return false
    }
  }

  // Retry mechanism with exponential backoff
  private async retryOperation<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries: number = this.maxRetries
  ): Promise<T | null> {
    let lastError: any
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        // Don't retry on certain errors
        if (error instanceof Error && error.message.includes('External API is disabled')) {
          throw error
        }
        
        if (attempt < maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1)
          console.warn(`${context} failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms:`, error)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    console.error(`${context} failed after ${maxRetries} attempts:`, lastError)
    throw lastError
  }

  // Sync a single agent with external API
  async syncAgent(agentId: string, direction: 'push' | 'pull' | 'both' = 'both'): Promise<{
    success: boolean;
    error?: string;
    syncDirection?: string;
  }> {
    try {
      // Check if external API is available
      if (!unifiedConfig.USE_EXTERNAL_API) {
        return { success: false, error: 'External API is disabled' }
      }
      
      const isHealthy = await this.checkApiHealth()
      if (!isHealthy) {
        return { success: false, error: 'External API is not healthy' }
      }
      if (direction === 'push' || direction === 'both') {
        await this.retryOperation(async () => {
          // Get local agent data
          const { data: localAgent, error: localError } = await this.supabase
            .from('agents')
            .select('*')
            .eq('id', agentId)
            .single()
            
          if (localError || !localAgent) {
            throw new Error(`Error fetching local agent: ${localError?.message}`)
          }
          
          const unifiedAgent = AgentDataAdapter.fromSupabase(localAgent)
          
          // Push to external API
          if (unifiedAgent.externalId) {
            // Update existing
            const response = await apiClient.updateAgent(unifiedAgent.externalId, unifiedAgent)
            if (!response.success) {
              throw new Error(`Failed to update agent in external API: ${response.error}`)
            }
          } else {
            // Create new
            const response = await apiClient.createAgent(unifiedAgent)
            if (response.success && response.data) {
              // Update local record with external ID
              const { error: updateError } = await this.supabase
                .from('agents')
                .update({
                  external_id: response.data.externalId,
                  sync_status: 'synced',
                  last_sync_at: new Date().toISOString(),
                  sync_error: null
                })
                .eq('id', agentId)
                
              if (updateError) {
                throw new Error(`Failed to update local agent with external ID: ${updateError.message}`)
              }
            } else {
              throw new Error(`Failed to create agent in external API: ${response.error}`)
            }
          }
        }, `Push agent ${agentId}`)
      }
      
      if (direction === 'pull' || direction === 'both') {
        await this.retryOperation(async () => {
          // Get external agent data
          const { data: localAgent } = await this.supabase
            .from('agents')
            .select('external_id')
            .eq('id', agentId)
            .single()
            
          if (localAgent?.external_id) {
            const response = await apiClient.getAgent(localAgent.external_id)
            if (response.success && response.data) {
              // Update local data
              const supabaseData = AgentDataAdapter.toSupabase(response.data)
              const { error: updateError } = await this.supabase
                .from('agents')
                .update({
                  ...supabaseData,
                  sync_status: 'synced',
                  last_sync_at: new Date().toISOString(),
                  sync_error: null
                })
                .eq('id', agentId)
                
              if (updateError) {
                throw new Error(`Failed to update local agent data: ${updateError.message}`)
              }
            } else {
              throw new Error(`Failed to fetch agent from external API: ${response.error}`)
            }
          }
        }, `Pull agent ${agentId}`)
      }
      
      await this.updateSyncStatus(agentId, 'synced')
      return { success: true, syncDirection: direction }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error'
      console.error('Error syncing agent:', error)
      await this.updateSyncStatus(agentId, 'error', errorMessage)
      return { success: false, error: errorMessage, syncDirection: direction }
    }
  }
  
  // Sync all pending agents
  async syncPendingAgents(): Promise<{
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors: string[];
  }> {
    if (this.syncInProgress) {
      return {
        success: false,
        syncedCount: 0,
        failedCount: 0,
        errors: ['Sync already in progress']
      }
    }
    
    try {
      this.syncInProgress = true
      let syncedCount = 0
      let failedCount = 0
      const errors: string[] = []
      
      // Check API health first
      const isHealthy = await this.checkApiHealth()
      if (!isHealthy) {
        return {
          success: false,
          syncedCount: 0,
          failedCount: 0,
          errors: ['External API is not healthy']
        }
      }
      
      // Get all agents that need syncing
      const { data: pendingAgents, error } = await this.supabase
        .from('agents')
        .select('id, sync_status, last_sync_attempt')
        .or('sync_status.eq.pending,sync_status.is.null,sync_status.eq.error')
        
      if (error || !pendingAgents) {
        const errorMsg = `Error fetching pending agents: ${error?.message}`
        console.error(errorMsg)
        return {
          success: false,
          syncedCount: 0,
          failedCount: 0,
          errors: [errorMsg]
        }
      }
      
      console.log(`Found ${pendingAgents.length} agents to sync`)
      
      // Sync each agent with rate limiting
      for (const agent of pendingAgents) {
        try {
          // Add small delay between syncs to avoid rate limiting
          if (syncedCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          
          const result = await this.syncAgent(agent.id)
          if (result.success) {
            syncedCount++
          } else {
            failedCount++
            if (result.error) {
              errors.push(`Agent ${agent.id}: ${result.error}`)
            }
          }
        } catch (error) {
          failedCount++
          const errorMsg = error instanceof Error ? error.message : 'Unknown error'
          errors.push(`Agent ${agent.id}: ${errorMsg}`)
        }
      }
      
      return {
        success: failedCount === 0,
        syncedCount,
        failedCount,
        errors
      }
    } finally {
      this.syncInProgress = false
    }
  }
  
  // Sync conversations
  async syncConversation(conversationId: string): Promise<boolean> {
    try {
      const { data: localConv, error } = await this.supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()
        
      if (error || !localConv) {
        console.error('Error fetching local conversation:', error)
        return false
      }
      
      const unifiedConv = ConversationDataAdapter.fromSupabase(localConv)
      
      if (!unifiedConv.externalId) {
        // Create in external API
        const response = await apiClient.createConversation(unifiedConv.agentId, unifiedConv.title)
        if (response.success && response.data) {
          await this.supabase
            .from('conversations')
            .update({
              external_id: response.data.externalId,
              sync_status: 'synced',
              last_sync_at: new Date().toISOString()
            })
            .eq('id', conversationId)
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error syncing conversation:', error)
      return false
    }
  }
  
  // Update sync status
  private async updateSyncStatus(
    entityId: string, 
    status: 'synced' | 'pending' | 'error',
    errorMessage?: string,
    table: 'agents' | 'conversations' = 'agents'
  ): Promise<void> {
    const updateData: any = {
      sync_status: status,
      last_sync_attempt: new Date().toISOString()
    }
    
    if (status === 'synced') {
      updateData.last_sync_at = new Date().toISOString()
      updateData.sync_error = null
    } else if (status === 'error' && errorMessage) {
      updateData.sync_error = errorMessage
    }
    
    const { error } = await this.supabase
      .from(table)
      .update(updateData)
      .eq('id', entityId)
      
    if (error) {
      console.error(`Failed to update sync status for ${entityId}:`, error)
    }
  }
  
  // Start automatic sync
  startAutoSync(): void {
    if (!unifiedConfig.ENABLE_AUTO_SYNC) {
      console.log('Auto sync is disabled')
      return
    }
    
    console.log(`Starting auto sync with interval: ${this.syncInterval}ms`)
    
    // Initial sync after a short delay
    setTimeout(() => {
      this.syncPendingAgents().then(result => {
        console.log('Initial sync completed:', result)
      })
    }, 5000)
    
    // Schedule periodic sync
    setInterval(async () => {
      try {
        const result = await this.syncPendingAgents()
        if (result.failedCount > 0) {
          console.warn(`Sync completed with ${result.failedCount} failures:`, result.errors)
        } else if (result.syncedCount > 0) {
          console.log(`Sync completed successfully: ${result.syncedCount} agents synced`)
        }
      } catch (error) {
        console.error('Auto sync failed:', error)
      }
    }, this.syncInterval)
  }
  
  // Manual sync all
  async syncAll(): Promise<void> {
    await this.syncPendingAgents()
    
    // Also sync conversations
    const { data: conversations } = await this.supabase
      .from('conversations')
      .select('id')
      .or('sync_status.eq.pending,sync_status.is.null')
      
    if (conversations) {
      for (const conv of conversations) {
        await this.syncConversation(conv.id)
      }
    }
  }
  
  // Check sync health
  async checkSyncHealth(): Promise<{
    healthy: boolean
    pendingAgents: number
    pendingConversations: number
    lastSyncErrors: number
  }> {
    const [agents, conversations, errors] = await Promise.all([
      this.supabase
        .from('agents')
        .select('id', { count: 'exact' })
        .or('sync_status.eq.pending,sync_status.is.null'),
      this.supabase
        .from('conversations')
        .select('id', { count: 'exact' })
        .or('sync_status.eq.pending,sync_status.is.null'),
      this.supabase
        .from('agents')
        .select('id', { count: 'exact' })
        .eq('sync_status', 'error')
    ])
    
    return {
      healthy: (errors.count || 0) === 0,
      pendingAgents: agents.count || 0,
      pendingConversations: conversations.count || 0,
      lastSyncErrors: errors.count || 0
    }
  }
}

// Singleton instance
export const syncService = new SyncService()