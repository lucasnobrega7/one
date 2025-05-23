import { SyncService } from '../sync-service'
import { apiClient } from '../api-client'
import { createClient } from '@/utils/supabase/server'

// Mock dependencies
jest.mock('../api-client')
jest.mock('@/utils/supabase/server')
jest.mock('../config', () => ({
  unifiedConfig: {
    USE_EXTERNAL_API: true,
    ENABLE_AUTO_SYNC: true,
    SYNC_INTERVAL_MS: 5000,
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY_MS: 500
  }
}))

// Mock the data adapters
jest.mock('../dto/agent.dto', () => ({
  AgentDataAdapter: {
    fromSupabase: jest.fn().mockReturnValue({
      id: 'local-123',
      externalId: 'ext-123',
      name: 'Test Agent'
    }),
    toSupabase: jest.fn().mockReturnValue({
      id: 'local-123',
      external_id: 'ext-123',
      name: 'Test Agent'
    }),
    fromApiResponse: jest.fn().mockReturnValue({
      id: 'local-123',
      externalId: 'ext-123',
      name: 'Test Agent'
    }),
    toApiRequest: jest.fn().mockReturnValue({
      name: 'Test Agent'
    })
  },
  ConversationDataAdapter: {
    fromSupabase: jest.fn().mockReturnValue({
      id: 'conv-123',
      agentId: 'agent-123',
      title: 'Test Conversation'
    })
  }
}))

describe('SyncService', () => {
  let syncService: SyncService
  let mockSupabase: any
  let mockApiClient: any
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Mock Supabase client
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      execute: jest.fn()
    }
    
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
    
    // Mock API client
    mockApiClient = {
      checkHealth: jest.fn().mockResolvedValue(true),
      createAgent: jest.fn(),
      updateAgent: jest.fn(),
      getAgent: jest.fn(),
      createConversation: jest.fn()
    }
    
    ;(apiClient as any).checkHealth = mockApiClient.checkHealth
    ;(apiClient as any).createAgent = mockApiClient.createAgent
    ;(apiClient as any).updateAgent = mockApiClient.updateAgent
    ;(apiClient as any).getAgent = mockApiClient.getAgent
    ;(apiClient as any).createConversation = mockApiClient.createConversation
    
    syncService = new SyncService()
  })

  describe('API Health Check', () => {
    it('should check API health successfully', async () => {
      mockApiClient.checkHealth.mockResolvedValueOnce(true)
      
      // Access private method through any cast for testing
      const isHealthy = await (syncService as any).checkApiHealth()
      
      expect(isHealthy).toBe(true)
      expect(mockApiClient.checkHealth).toHaveBeenCalled()
    })

    it('should handle API health check failure', async () => {
      mockApiClient.checkHealth.mockResolvedValueOnce(false)
      
      const isHealthy = await (syncService as any).checkApiHealth()
      
      expect(isHealthy).toBe(false)
    })

    it('should cache health check results', async () => {
      mockApiClient.checkHealth.mockResolvedValueOnce(true)
      
      // First call
      await (syncService as any).checkApiHealth()
      // Second call within cache period
      await (syncService as any).checkApiHealth()
      
      // Should only call the API once due to caching
      expect(mockApiClient.checkHealth).toHaveBeenCalledTimes(1)
    })
  })

  describe('Agent Sync', () => {
    beforeEach(() => {
      mockSupabase.execute.mockResolvedValue({
        data: [{
          id: 'local-123',
          external_id: null,
          name: 'Test Agent',
          sync_status: 'pending'
        }],
        error: null
      })
    })

    it('should sync new agent (push)', async () => {
      mockApiClient.createAgent.mockResolvedValueOnce({
        success: true,
        data: { externalId: 'ext-123', id: 'local-123' }
      })

      const result = await syncService.syncAgent('local-123', 'push')
      
      expect(result.success).toBe(true)
      expect(result.syncDirection).toBe('push')
      expect(mockApiClient.createAgent).toHaveBeenCalled()
      expect(mockSupabase.update).toHaveBeenCalledWith({
        external_id: 'ext-123',
        sync_status: 'synced',
        last_sync_at: expect.any(String),
        sync_error: null
      })
    })

    it('should sync existing agent (push)', async () => {
      mockSupabase.execute.mockResolvedValueOnce({
        data: [{
          id: 'local-123',
          external_id: 'ext-123',
          name: 'Test Agent'
        }],
        error: null
      })

      mockApiClient.updateAgent.mockResolvedValueOnce({
        success: true,
        data: { externalId: 'ext-123' }
      })

      const result = await syncService.syncAgent('local-123', 'push')
      
      expect(result.success).toBe(true)
      expect(mockApiClient.updateAgent).toHaveBeenCalledWith('ext-123', expect.any(Object))
    })

    it('should sync agent from external API (pull)', async () => {
      mockSupabase.execute.mockResolvedValueOnce({
        data: { external_id: 'ext-123' },
        error: null
      })

      mockApiClient.getAgent.mockResolvedValueOnce({
        success: true,
        data: { id: 'local-123', name: 'Updated Agent' }
      })

      mockSupabase.update.mockResolvedValueOnce({ error: null })

      const result = await syncService.syncAgent('local-123', 'pull')
      
      expect(result.success).toBe(true)
      expect(mockApiClient.getAgent).toHaveBeenCalledWith('ext-123')
      expect(mockSupabase.update).toHaveBeenCalled()
    })

    it('should handle sync failure', async () => {
      mockSupabase.execute.mockResolvedValueOnce({
        data: null,
        error: { message: 'Agent not found' }
      })

      const result = await syncService.syncAgent('non-existent', 'push')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Agent not found')
    })

    it('should handle API disabled', async () => {
      // Mock config to disable external API
      jest.doMock('../config', () => ({
        unifiedConfig: { USE_EXTERNAL_API: false }
      }))

      const result = await syncService.syncAgent('local-123')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('External API is disabled')
    })

    it('should handle unhealthy API', async () => {
      mockApiClient.checkHealth.mockResolvedValueOnce(false)

      const result = await syncService.syncAgent('local-123')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('External API is not healthy')
    })
  })

  describe('Batch Sync Operations', () => {
    it('should sync multiple pending agents', async () => {
      const pendingAgents = [
        { id: 'agent-1', sync_status: 'pending' },
        { id: 'agent-2', sync_status: 'pending' },
        { id: 'agent-3', sync_status: null }
      ]

      mockSupabase.execute.mockResolvedValueOnce({
        data: pendingAgents,
        error: null
      })

      // Mock individual sync results
      jest.spyOn(syncService, 'syncAgent')
        .mockResolvedValueOnce({ success: true, syncDirection: 'both' })
        .mockResolvedValueOnce({ success: true, syncDirection: 'both' })
        .mockResolvedValueOnce({ success: false, error: 'Sync failed', syncDirection: 'both' })

      const result = await syncService.syncPendingAgents()
      
      expect(result.success).toBe(false) // Because one failed
      expect(result.syncedCount).toBe(2)
      expect(result.failedCount).toBe(1)
      expect(result.errors).toHaveLength(1)
      expect(syncService.syncAgent).toHaveBeenCalledTimes(3)
    })

    it('should handle no pending agents', async () => {
      mockSupabase.execute.mockResolvedValueOnce({
        data: [],
        error: null
      })

      const result = await syncService.syncPendingAgents()
      
      expect(result.success).toBe(true)
      expect(result.syncedCount).toBe(0)
      expect(result.failedCount).toBe(0)
    })

    it('should handle database error when fetching pending agents', async () => {
      mockSupabase.execute.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database connection failed' }
      })

      const result = await syncService.syncPendingAgents()
      
      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('Database connection failed')
    })

    it('should prevent concurrent sync operations', async () => {
      mockSupabase.execute.mockResolvedValueOnce({
        data: [{ id: 'agent-1' }],
        error: null
      })

      // Start first sync
      const firstSync = syncService.syncPendingAgents()
      
      // Try to start second sync while first is running
      const secondSync = syncService.syncPendingAgents()
      
      const [firstResult, secondResult] = await Promise.all([firstSync, secondSync])
      
      expect(firstResult.success).toBeDefined()
      expect(secondResult.success).toBe(false)
      expect(secondResult.errors[0]).toBe('Sync already in progress')
    })
  })

  describe('Conversation Sync', () => {
    it('should sync conversation successfully', async () => {
      mockSupabase.execute.mockResolvedValueOnce({
        data: {
          id: 'conv-123',
          agent_id: 'agent-123',
          external_id: null,
          title: 'Test Conversation'
        },
        error: null
      })

      mockApiClient.createConversation.mockResolvedValueOnce({
        success: true,
        data: { externalId: 'ext-conv-123' }
      })

      mockSupabase.update.mockResolvedValueOnce({ error: null })

      const result = await syncService.syncConversation('conv-123')
      
      expect(result).toBe(true)
      expect(mockApiClient.createConversation).toHaveBeenCalled()
      expect(mockSupabase.update).toHaveBeenCalledWith({
        external_id: 'ext-conv-123',
        sync_status: 'synced',
        last_sync_at: expect.any(String)
      })
    })

    it('should handle conversation sync failure', async () => {
      mockSupabase.execute.mockResolvedValueOnce({
        data: null,
        error: { message: 'Conversation not found' }
      })

      const result = await syncService.syncConversation('non-existent')
      
      expect(result).toBe(false)
    })
  })

  describe('Sync Health Check', () => {
    it('should return sync health status', async () => {
      mockSupabase.execute
        .mockResolvedValueOnce({ count: 5, error: null }) // pending agents
        .mockResolvedValueOnce({ count: 2, error: null }) // pending conversations
        .mockResolvedValueOnce({ count: 0, error: null }) // sync errors

      const health = await syncService.checkSyncHealth()
      
      expect(health.healthy).toBe(true)
      expect(health.pendingAgents).toBe(5)
      expect(health.pendingConversations).toBe(2)
      expect(health.lastSyncErrors).toBe(0)
    })

    it('should report unhealthy status when there are errors', async () => {
      mockSupabase.execute
        .mockResolvedValueOnce({ count: 5, error: null })
        .mockResolvedValueOnce({ count: 2, error: null })
        .mockResolvedValueOnce({ count: 3, error: null }) // sync errors

      const health = await syncService.checkSyncHealth()
      
      expect(health.healthy).toBe(false)
      expect(health.lastSyncErrors).toBe(3)
    })
  })

  describe('Auto Sync', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should start auto sync when enabled', () => {
      const syncSpy = jest.spyOn(syncService, 'syncPendingAgents')
        .mockResolvedValue({
          success: true,
          syncedCount: 0,
          failedCount: 0,
          errors: []
        })

      syncService.startAutoSync()
      
      // Fast-forward initial delay
      jest.advanceTimersByTime(5000)
      
      expect(syncSpy).toHaveBeenCalledTimes(1)
      
      // Fast-forward to next sync interval
      jest.advanceTimersByTime(5000)
      
      expect(syncSpy).toHaveBeenCalledTimes(2)
    })

    it('should not start auto sync when disabled', () => {
      // Mock config to disable auto sync
      jest.doMock('../config', () => ({
        unifiedConfig: { ENABLE_AUTO_SYNC: false }
      }))

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      syncService.startAutoSync()
      
      expect(consoleSpy).toHaveBeenCalledWith('Auto sync is disabled')
    })
  })

  describe('Error Handling and Retry Logic', () => {
    it('should retry failed operations', async () => {
      const retryOperation = (syncService as any).retryOperation
      
      let attempts = 0
      const failingOperation = jest.fn().mockImplementation(() => {
        attempts++
        if (attempts < 3) {
          throw new Error(`Attempt ${attempts} failed`)
        }
        return 'success'
      })

      const result = await retryOperation(failingOperation, 'test operation', 3)
      
      expect(result).toBe('success')
      expect(failingOperation).toHaveBeenCalledTimes(3)
    })

    it('should not retry when external API is disabled', async () => {
      const retryOperation = (syncService as any).retryOperation
      
      const operation = jest.fn().mockRejectedValue(new Error('External API is disabled'))

      await expect(retryOperation(operation, 'test', 3)).rejects.toThrow('External API is disabled')
      expect(operation).toHaveBeenCalledTimes(1)
    })

    it('should update sync status with error message', async () => {
      const updateSyncStatus = (syncService as any).updateSyncStatus
      
      mockSupabase.update.mockResolvedValueOnce({ error: null })

      await updateSyncStatus('agent-123', 'error', 'Test error message')
      
      expect(mockSupabase.update).toHaveBeenCalledWith({
        sync_status: 'error',
        last_sync_attempt: expect.any(String),
        sync_error: 'Test error message'
      })
    })
  })
})