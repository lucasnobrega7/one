import { authAdapter } from './auth-adapter'
import { 
  UnifiedAgent, 
  UnifiedConversation, 
  UnifiedMessage,
  AgentDataAdapter, 
  ConversationDataAdapter, 
  MessageDataAdapter 
} from './dto/agent.dto'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  status?: number
}

export class AgentesDeConversaoClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.com.br'
  private useCache = process.env.USE_LOCAL_DB === 'true'
  private useExternalApi = process.env.USE_EXTERNAL_API !== 'false'
  
  // Agents operations
  async createAgent(agent: UnifiedAgent): Promise<ApiResponse<UnifiedAgent>> {
    try {
      if (!this.useExternalApi) {
        return { success: false, error: 'External API is disabled' }
      }
      
      const headers = await authAdapter.getApiHeaders()
      const apiData = AgentDataAdapter.toApiRequest(agent)
      
      const response = await fetch(`${this.baseUrl}/api/agents`, {
        method: 'POST',
        headers,
        body: JSON.stringify(apiData)
      })
      
      if (!response.ok) {
        const error = await response.text()
        return { 
          success: false, 
          error: `API Error: ${response.status} - ${error}`,
          status: response.status 
        }
      }
      
      const result = await response.json()
      const unifiedAgent = AgentDataAdapter.fromApiResponse(result)
      
      return { success: true, data: unifiedAgent }
    } catch (error) {
      console.error('Error creating agent:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
  
  async getAgent(agentId: string): Promise<ApiResponse<UnifiedAgent>> {
    try {
      if (!this.useExternalApi) {
        return { success: false, error: 'External API is disabled' }
      }
      
      const headers = await authAdapter.getApiHeaders()
      
      const response = await fetch(`${this.baseUrl}/api/agents/${agentId}`, {
        method: 'GET',
        headers
      })
      
      if (!response.ok) {
        return { 
          success: false, 
          error: `API Error: ${response.status}`,
          status: response.status 
        }
      }
      
      const result = await response.json()
      const unifiedAgent = AgentDataAdapter.fromApiResponse(result)
      
      return { success: true, data: unifiedAgent }
    } catch (error) {
      console.error('Error fetching agent:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
  
  async updateAgent(agentId: string, updates: Partial<UnifiedAgent>): Promise<ApiResponse<UnifiedAgent>> {
    try {
      if (!this.useExternalApi) {
        return { success: false, error: 'External API is disabled' }
      }
      
      const headers = await authAdapter.getApiHeaders()
      const apiData = AgentDataAdapter.toApiRequest({ ...updates, id: agentId } as UnifiedAgent)
      
      const response = await fetch(`${this.baseUrl}/api/agents/${agentId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(apiData)
      })
      
      if (!response.ok) {
        return { 
          success: false, 
          error: `API Error: ${response.status}`,
          status: response.status 
        }
      }
      
      const result = await response.json()
      const unifiedAgent = AgentDataAdapter.fromApiResponse(result)
      
      return { success: true, data: unifiedAgent }
    } catch (error) {
      console.error('Error updating agent:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
  
  async deleteAgent(agentId: string): Promise<ApiResponse<void>> {
    try {
      if (!this.useExternalApi) {
        return { success: false, error: 'External API is disabled' }
      }
      
      const headers = await authAdapter.getApiHeaders()
      
      const response = await fetch(`${this.baseUrl}/api/agents/${agentId}`, {
        method: 'DELETE',
        headers
      })
      
      if (!response.ok) {
        return { 
          success: false, 
          error: `API Error: ${response.status}`,
          status: response.status 
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting agent:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
  
  async listAgents(filters?: { userId?: string; isPublic?: boolean }): Promise<ApiResponse<UnifiedAgent[]>> {
    try {
      if (!this.useExternalApi) {
        return { success: false, error: 'External API is disabled' }
      }
      
      const headers = await authAdapter.getApiHeaders()
      const queryParams = new URLSearchParams()
      
      if (filters?.userId) queryParams.append('user_id', filters.userId)
      if (filters?.isPublic !== undefined) queryParams.append('is_public', String(filters.isPublic))
      
      const response = await fetch(`${this.baseUrl}/api/agents?${queryParams}`, {
        method: 'GET',
        headers
      })
      
      if (!response.ok) {
        return { 
          success: false, 
          error: `API Error: ${response.status}`,
          status: response.status 
        }
      }
      
      const result = await response.json()
      const agents = result.map((agent: any) => AgentDataAdapter.fromApiResponse(agent))
      
      return { success: true, data: agents }
    } catch (error) {
      console.error('Error listing agents:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
  
  // Chat/Conversation operations
  async invokeAgent(agentId: string, message: string, conversationId?: string): Promise<ApiResponse<UnifiedMessage>> {
    try {
      if (!this.useExternalApi) {
        return { success: false, error: 'External API is disabled' }
      }
      
      const headers = await authAdapter.getApiHeaders()
      
      const response = await fetch(`${this.baseUrl}/api/agents/${agentId}/invoke`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
          stream: false
        })
      })
      
      if (!response.ok) {
        return { 
          success: false, 
          error: `API Error: ${response.status}`,
          status: response.status 
        }
      }
      
      const result = await response.json()
      const unifiedMessage = MessageDataAdapter.fromApiResponse(result)
      
      return { success: true, data: unifiedMessage }
    } catch (error) {
      console.error('Error invoking agent:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
  
  // Streaming chat support
  async *invokeAgentStream(agentId: string, message: string, conversationId?: string) {
    try {
      if (!this.useExternalApi) {
        yield { error: 'External API is disabled' }
        return
      }
      
      const headers = await authAdapter.getApiHeaders()
      
      const response = await fetch(`${this.baseUrl}/api/agents/${agentId}/invoke`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
          stream: true
        })
      })
      
      if (!response.ok) {
        yield { error: `API Error: ${response.status}` }
        return
      }
      
      const reader = response.body?.getReader()
      if (!reader) {
        yield { error: 'No response body' }
        return
      }
      
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              return
            }
            try {
              const parsed = JSON.parse(data)
              yield parsed
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streaming:', error)
      yield { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
  
  // Conversation management
  async createConversation(agentId: string, title?: string): Promise<ApiResponse<UnifiedConversation>> {
    try {
      if (!this.useExternalApi) {
        return { success: false, error: 'External API is disabled' }
      }
      
      const headers = await authAdapter.getApiHeaders()
      
      const response = await fetch(`${this.baseUrl}/api/conversations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          agent_id: agentId,
          title
        })
      })
      
      if (!response.ok) {
        return { 
          success: false, 
          error: `API Error: ${response.status}`,
          status: response.status 
        }
      }
      
      const result = await response.json()
      const conversation = ConversationDataAdapter.fromApiResponse(result)
      
      return { success: true, data: conversation }
    } catch (error) {
      console.error('Error creating conversation:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
  
  async getConversation(conversationId: string): Promise<ApiResponse<UnifiedConversation>> {
    try {
      if (!this.useExternalApi) {
        return { success: false, error: 'External API is disabled' }
      }
      
      const headers = await authAdapter.getApiHeaders()
      
      const response = await fetch(`${this.baseUrl}/api/conversations/${conversationId}`, {
        method: 'GET',
        headers
      })
      
      if (!response.ok) {
        return { 
          success: false, 
          error: `API Error: ${response.status}`,
          status: response.status 
        }
      }
      
      const result = await response.json()
      const conversation = ConversationDataAdapter.fromApiResponse(result)
      
      // Fetch messages separately if needed
      if (result.messages) {
        conversation.messages = result.messages.map((msg: any) => 
          MessageDataAdapter.fromApiResponse(msg)
        )
      }
      
      return { success: true, data: conversation }
    } catch (error) {
      console.error('Error fetching conversation:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
  
  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      return response.ok
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

// Singleton instance
export const apiClient = new AgentesDeConversaoClient()