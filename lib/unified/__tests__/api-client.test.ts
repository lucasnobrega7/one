import { AgentesDeConversaoClient } from '../api-client'
import { ApiErrorHandler, ApiErrorType } from '../error-handler'
import { authAdapter } from '../auth-adapter'

// Mock dependencies
jest.mock('../auth-adapter')
jest.mock('../config', () => ({
  unifiedConfig: {
    API_BASE_URL: 'https://api.agentesdeconversao.com.br',
    USE_EXTERNAL_API: true,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000
  }
}))

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('AgentesDeConversaoClient', () => {
  let client: AgentesDeConversaoClient
  
  beforeEach(() => {
    client = new AgentesDeConversaoClient()
    mockFetch.mockClear()
    ;(authAdapter.getApiHeaders as jest.Mock).mockResolvedValue({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token'
    })
  })

  describe('Health Check', () => {
    it('should return true when API is healthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      })

      const result = await client.checkHealth()
      expect(result).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/health',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })

    it('should return false when API is unhealthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const result = await client.checkHealth()
      expect(result).toBe(false)
    })

    it('should return false when network error occurs', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.checkHealth()
      expect(result).toBe(false)
    })
  })

  describe('Authentication', () => {
    it('should authenticate successfully with valid credentials', async () => {
      const mockResponse = {
        token: 'jwt-token',
        user: { id: '123', email: 'test@example.com' }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse)
      })

      const result = await client.authenticate('test@example.com', 'password')
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com', password: 'password' })
        })
      )
    })

    it('should handle authentication failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })

      const result = await client.authenticate('test@example.com', 'wrong-password')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Authentication failed: 401')
      expect(result.status).toBe(401)
    })
  })

  describe('AI Chat Completion', () => {
    it('should send chat completion request successfully', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Hello! How can I help you?' } }]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse)
      })

      const messages = [{ role: 'user', content: 'Hello' }]
      const result = await client.chatCompletion(messages)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/ai/chat/completions',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            messages,
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            stream: false
          })
        })
      )
    })

    it('should handle custom options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({})
      })

      const messages = [{ role: 'user', content: 'Hello' }]
      const options = {
        model: 'gpt-4',
        temperature: 0.5,
        max_tokens: 1000,
        stream: true
      }

      await client.chatCompletion(messages, options)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/ai/chat/completions',
        expect.objectContaining({
          body: JSON.stringify({
            messages,
            model: 'gpt-4',
            temperature: 0.5,
            max_tokens: 1000,
            stream: true
          })
        })
      )
    })
  })

  describe('WhatsApp Integration', () => {
    it('should send WhatsApp message successfully', async () => {
      const mockResponse = { messageId: 'msg-123', status: 'sent' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse)
      })

      const result = await client.sendWhatsAppMessage('5511999999999', 'Hello World')
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/zapi/send-message',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            to: '5511999999999',
            message: 'Hello World',
            type: 'text'
          })
        })
      )
    })

    it('should get WhatsApp messages successfully', async () => {
      const mockMessages = [
        { id: 'msg-1', content: 'Hello', from: '5511999999999' },
        { id: 'msg-2', content: 'Hi there', from: '5511888888888' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockMessages)
      })

      const result = await client.getWhatsAppMessages(10)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockMessages)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/zapi/messages?limit=10',
        expect.objectContaining({ method: 'GET' })
      )
    })
  })

  describe('Database Operations', () => {
    it('should query database successfully', async () => {
      const mockData = [{ id: '1', name: 'Test Agent' }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockData)
      })

      const result = await client.queryDatabase('agents', { select: '*' })
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/supabase/query',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            table: 'agents',
            query: { select: '*' }
          })
        })
      )
    })

    it('should insert data successfully', async () => {
      const mockResult = { id: 'new-id', created: true }
      const insertData = { name: 'New Agent', description: 'Test agent' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue(mockResult)
      })

      const result = await client.insertData('agents', insertData)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResult)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/supabase/insert',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            table: 'agents',
            data: insertData
          })
        })
      )
    })

    it('should update data successfully', async () => {
      const mockResult = { updated: true }
      const updateData = { name: 'Updated Agent' }
      const conditions = { id: 'agent-123' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResult)
      })

      const result = await client.updateData('agents', updateData, conditions)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResult)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/supabase/update',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            table: 'agents',
            data: updateData,
            conditions
          })
        })
      )
    })

    it('should delete data successfully', async () => {
      const mockResult = { deleted: true }
      const conditions = { id: 'agent-123' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResult)
      })

      const result = await client.deleteData('agents', conditions)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResult)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.agentesdeconversao.com.br/supabase/delete',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            table: 'agents',
            conditions
          })
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.authenticate('test@example.com', 'password')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
    })

    it('should handle server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValue('Internal Server Error')
      })

      const result = await client.chatCompletion([{ role: 'user', content: 'Hello' }])
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('AI Chat Error: 500')
      expect(result.status).toBe(500)
    })

    it('should handle disabled external API', async () => {
      // Mock config to disable external API
      jest.doMock('../config', () => ({
        unifiedConfig: {
          USE_EXTERNAL_API: false
        }
      }))

      // Re-import to get the mocked config
      const { AgentesDeConversaoClient: DisabledClient } = await import('../api-client')
      const disabledClient = new DisabledClient()

      const result = await disabledClient.chatCompletion([{ role: 'user', content: 'Hello' }])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('External API is disabled')
    })
  })

  describe('Legacy Agent Operations', () => {
    it('should create agent successfully', async () => {
      const mockAgent = { 
        id: 'agent-123', 
        name: 'Test Agent',
        externalId: 'ext-123'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue(mockAgent)
      })

      const agentData = {
        id: 'agent-123',
        name: 'Test Agent',
        description: 'A test agent',
        instructions: 'Test instructions'
      }

      const result = await client.createAgent(agentData as any)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should get agent successfully', async () => {
      const mockAgent = { 
        id: 'agent-123', 
        name: 'Test Agent',
        externalId: 'ext-123'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockAgent)
      })

      const result = await client.getAgent('agent-123')
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should list agents successfully', async () => {
      const mockAgents = [
        { id: 'agent-1', name: 'Agent 1' },
        { id: 'agent-2', name: 'Agent 2' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockAgents)
      })

      const result = await client.listAgents()
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })
  })
})