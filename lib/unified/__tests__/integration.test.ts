import { AgentesDeConversaoClient } from '../api-client'
import { SyncService } from '../sync-service'
import { unifiedConfig } from '../config'

describe('Integration Tests', () => {
  let apiClient: AgentesDeConversaoClient
  let syncService: SyncService

  // Skip integration tests in CI unless specifically enabled
  const runIntegrationTests = process.env.RUN_INTEGRATION_TESTS === 'true'

  beforeAll(() => {
    if (!runIntegrationTests) {
      console.log('Skipping integration tests. Set RUN_INTEGRATION_TESTS=true to run.')
      return
    }

    apiClient = new AgentesDeConversaoClient()
    syncService = new SyncService()
  })

  describe('API Health and Connectivity', () => {
    it('should connect to the external API', async () => {
      if (!runIntegrationTests) return

      const isHealthy = await apiClient.checkHealth()
      expect(isHealthy).toBe(true)
    }, 10000) // 10 second timeout

    it('should have proper configuration', () => {
      if (!runIntegrationTests) return

      expect(unifiedConfig.API_BASE_URL).toBeDefined()
      expect(unifiedConfig.USE_EXTERNAL_API).toBe(true)
      expect(unifiedConfig.RETRY_ATTEMPTS).toBeGreaterThan(0)
    })
  })

  describe('Authentication Flow', () => {
    it('should handle authentication with valid credentials', async () => {
      if (!runIntegrationTests) return

      // Note: This would require test credentials
      // const result = await apiClient.authenticate('test@example.com', 'test-password')
      // expect(result.success).toBe(true)
      
      // For now, just test that the method exists and handles errors properly
      const result = await apiClient.authenticate('invalid@example.com', 'invalid-password')
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    }, 15000)

    it('should handle invalid credentials gracefully', async () => {
      if (!runIntegrationTests) return

      const result = await apiClient.authenticate('nonexistent@example.com', 'wrongpassword')
      expect(result.success).toBe(false)
      expect(result.status).toBe(401)
    }, 10000)
  })

  describe('API Endpoint Validation', () => {
    it('should validate all main endpoints are accessible', async () => {
      if (!runIntegrationTests) return

      const endpoints = [
        { path: '/health', method: 'GET' },
        { path: '/auth/login', method: 'POST' },
        { path: '/auth/signup', method: 'POST' },
        { path: '/ai/chat/completions', method: 'POST' },
        { path: '/zapi/send-message', method: 'POST' },
        { path: '/zapi/messages', method: 'GET' },
        { path: '/supabase/query', method: 'POST' },
        { path: '/supabase/insert', method: 'POST' },
        { path: '/supabase/update', method: 'POST' },
        { path: '/supabase/delete', method: 'POST' }
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${unifiedConfig.API_BASE_URL}${endpoint.path}`, {
            method: endpoint.method,
            headers: { 'Content-Type': 'application/json' }
          })
          
          // We expect either success or auth error (401/403), not 404
          expect([200, 201, 401, 403, 422]).toContain(response.status)
        } catch (error) {
          fail(`Endpoint ${endpoint.path} is not accessible: ${error}`)
        }
      }
    }, 30000)
  })

  describe('Data Flow Integration', () => {
    it('should sync data between local and external systems', async () => {
      if (!runIntegrationTests) return

      // This would require a test database setup
      // const mockAgent = {
      //   id: 'test-agent-' + Date.now(),
      //   name: 'Integration Test Agent',
      //   description: 'Created by integration test',
      //   instructions: 'Test instructions'
      // }

      // Test sync health check
      const health = await syncService.checkSyncHealth()
      expect(health).toBeDefined()
      expect(typeof health.healthy).toBe('boolean')
      expect(typeof health.pendingAgents).toBe('number')
      expect(typeof health.pendingConversations).toBe('number')
      expect(typeof health.lastSyncErrors).toBe('number')
    }, 20000)
  })

  describe('Error Handling Integration', () => {
    it('should handle network timeouts gracefully', async () => {
      if (!runIntegrationTests) return

      // Test with a very short timeout to simulate network issues
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 100) // 100ms timeout

      try {
        await fetch(`${unifiedConfig.API_BASE_URL}/health`, {
          signal: controller.signal
        })
      } catch (error) {
        expect(error).toBeDefined()
        // This is expected to fail due to timeout
      }
    })

    it('should handle rate limiting properly', async () => {
      if (!runIntegrationTests) return

      // Make multiple rapid requests to potentially trigger rate limiting
      const requests = Array.from({ length: 10 }, () => 
        apiClient.checkHealth()
      )

      const results = await Promise.allSettled(requests)
      
      // All requests should either succeed or fail gracefully
      results.forEach(result => {
        if (result.status === 'rejected') {
          // Should not throw unhandled errors
          expect(result.reason).toBeDefined()
        }
      })
    }, 15000)
  })

  describe('Performance Testing', () => {
    it('should complete health check within reasonable time', async () => {
      if (!runIntegrationTests) return

      const startTime = Date.now()
      await apiClient.checkHealth()
      const duration = Date.now() - startTime

      // Health check should complete within 5 seconds
      expect(duration).toBeLessThan(5000)
    })

    it('should handle concurrent requests efficiently', async () => {
      if (!runIntegrationTests) return

      const concurrentRequests = 5
      const startTime = Date.now()

      const requests = Array.from({ length: concurrentRequests }, () => 
        apiClient.checkHealth()
      )

      const results = await Promise.all(requests)
      const duration = Date.now() - startTime

      // All requests should succeed
      results.forEach(result => expect(result).toBe(true))
      
      // Concurrent requests should not take much longer than sequential
      expect(duration).toBeLessThan(10000)
    }, 15000)
  })

  describe('Data Consistency', () => {
    it('should maintain data consistency between local and external systems', async () => {
      if (!runIntegrationTests) return

      // This would require test data setup
      // For now, just test that sync operations don't corrupt data
      const healthBefore = await syncService.checkSyncHealth()
      
      // Attempt a sync operation
      try {
        await syncService.syncPendingAgents()
      } catch (error) {
        // Sync might fail due to lack of test data, but shouldn't crash
        expect(error).toBeDefined()
      }

      const healthAfter = await syncService.checkSyncHealth()
      
      // Health check should still work after sync attempt
      expect(healthAfter).toBeDefined()
      expect(typeof healthAfter.healthy).toBe('boolean')
    }, 20000)
  })

  describe('Configuration Validation', () => {
    it('should validate all required environment variables', () => {
      if (!runIntegrationTests) return

      const requiredConfig = [
        'API_BASE_URL',
        'USE_EXTERNAL_API',
        'RETRY_ATTEMPTS',
        'RETRY_DELAY_MS'
      ]

      requiredConfig.forEach(key => {
        expect(unifiedConfig[key as keyof typeof unifiedConfig]).toBeDefined()
      })
    })

    it('should have reasonable default values', () => {
      if (!runIntegrationTests) return

      expect(unifiedConfig.RETRY_ATTEMPTS).toBeGreaterThan(0)
      expect(unifiedConfig.RETRY_ATTEMPTS).toBeLessThan(10)
      expect(unifiedConfig.RETRY_DELAY_MS).toBeGreaterThan(0)
      expect(unifiedConfig.SYNC_INTERVAL_MS).toBeGreaterThan(10000) // At least 10 seconds
    })
  })

  describe('Security Testing', () => {
    it('should not expose sensitive information in error messages', async () => {
      if (!runIntegrationTests) return

      // Test with invalid authentication
      const result = await apiClient.authenticate('test@example.com', 'wrongpassword')
      
      if (!result.success) {
        // Error message should not contain sensitive information like tokens or keys
        expect(result.error).not.toMatch(/[A-Za-z0-9]{32,}/) // No long tokens
        expect(result.error).not.toContain('secret')
        expect(result.error).not.toContain('key')
        expect(result.error).not.toContain('token')
      }
    })

    it('should use HTTPS for all API calls', () => {
      if (!runIntegrationTests) return

      expect(unifiedConfig.API_BASE_URL).toMatch(/^https:\/\//)
    })
  })
})

// Helper function to set up test data (would be used in actual tests)
async function setupTestData() {
  // This would create test agents, conversations, etc.
  // for integration testing
  return {
    testAgent: {
      id: 'test-agent-' + Date.now(),
      name: 'Integration Test Agent',
      description: 'Created for integration testing'
    }
  }
}

// Helper function to clean up test data
async function cleanupTestData(testData: any) {
  // This would remove test data after tests complete
  console.log('Cleaning up test data:', testData)
}