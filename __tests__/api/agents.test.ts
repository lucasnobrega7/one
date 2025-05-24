import { createMocks } from 'node-mocks-http'
import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/agents/route'

// Mock NextAuth
jest.mock('@/config/auth', () => ({
  auth: jest.fn(),
}))

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123'),
}))

import { auth } from '@/config/auth'
import { createClient } from '@/lib/supabase/server'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('/api/agents', () => {
  let mockSupabase: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      order: jest.fn().mockReturnThis(),
    }
    
    mockCreateClient.mockReturnValue(mockSupabase)
  })

  describe('POST /api/agents', () => {
    it('should create agent successfully', async () => {
      mockAuth.mockResolvedValue({
        user: { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' }
      } as any)

      mockSupabase.single.mockResolvedValue({
        data: {
          id: 'mock-uuid-123',
          name: 'Test Agent',
          description: 'Test Description',
          system_prompt: 'Test prompt',
          model_id: 'gpt-3.5-turbo',
          temperature: 0.7,
          user_id: '550e8400-e29b-41d4-a716-446655440000',
        },
        error: null,
      })

      const request = new NextRequest('http://localhost:3000/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Agent',
          description: 'Test Description',
          systemPrompt: 'Test prompt',
          modelId: 'gpt-3.5-turbo',
          temperature: 0.7,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      // Debug output
      if (response.status !== 200) {
        console.log('Error response:', data)
      }

      expect(response.status).toBe(200)
      expect(data.name).toBe('Test Agent')
      expect(mockSupabase.from).toHaveBeenCalledWith('agents')
      expect(mockSupabase.insert).toHaveBeenCalled()
    })

    it('should return 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/agents', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Agent' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Não autorizado')
    })
  })

  describe('GET /api/agents', () => {
    it('should fetch agents successfully', async () => {
      mockAuth.mockResolvedValue({
        user: { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' }
      } as any)

      const mockAgents = [
        {
          id: 'agent-1',
          name: 'Agent 1',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
        }
      ]

      mockSupabase.order.mockResolvedValue({
        data: mockAgents,
        error: null,
      })

      const request = new NextRequest('http://localhost:3000/api/agents', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
      expect(data[0].name).toBe('Agent 1')
    })
  })
})