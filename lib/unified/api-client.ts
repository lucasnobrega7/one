import { getSession } from 'next-auth/react'

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  status?: number
}

// Error types
export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
    this.name = 'ApiError'
  }
}

// Environment configuration
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.ai',
  timeout: 30000, // 30 seconds
  retries: 3
}

// Request interceptor for authentication
class ApiClient {
  private baseUrl: string
  private timeout: number
  private retries: number

  constructor() {
    this.baseUrl = config.apiUrl
    this.timeout = config.timeout
    this.retries = config.retries
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    try {
      const session = await getSession()
      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`
      }
    } catch (error) {
      // Failed to get session - continue without auth header
    }

    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = await this.getAuthHeaders()

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    }

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          let errorData: any = {}
          try {
            errorData = await response.json()
          } catch {}

          return {
            success: false,
            error: errorData.detail || errorData.message || `HTTP ${response.status}`,
            status: response.status
          }
        }

        const data = await response.json()
        return {
          success: true,
          data,
          status: response.status
        }

      } catch (error) {
        if (attempt === this.retries) {
          if (error instanceof Error && error.name === 'AbortError') {
            return {
              success: false,
              error: 'Request timeout - please try again',
              status: 408
            }
          }
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error',
            status: 0
          }
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, attempt * 1000))
      }
    }

    return {
      success: false,
      error: 'Maximum retries exceeded',
      status: 0
    }
  }

  // Agent management
  async listAgents(): Promise<ApiResponse> {
    return this.request('/api/agents')
  }

  async getAgent(agentId: string): Promise<ApiResponse> {
    return this.request(`/api/agents/${agentId}`)
  }

  async createAgent(agent: any): Promise<ApiResponse> {
    return this.request('/api/agents', {
      method: 'POST',
      body: JSON.stringify(agent)
    })
  }

  async updateAgent(agentId: string, agent: any): Promise<ApiResponse> {
    return this.request(`/api/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(agent)
    })
  }

  async deleteAgent(agentId: string): Promise<ApiResponse> {
    return this.request(`/api/agents/${agentId}`, {
      method: 'DELETE'
    })
  }

  // Analytics
  async getAnalytics(): Promise<ApiResponse> {
    return this.request('/api/analytics')
  }

  // Knowledge base
  async uploadKnowledge(file: File): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const headers = await this.getAuthHeaders()
    delete headers['Content-Type'] // Let browser set for FormData

    return this.request('/api/knowledge', {
      method: 'POST',
      body: formData,
      headers
    })
  }

  // Chat/conversations
  async sendMessage(message: string, agentId: string): Promise<ApiResponse> {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, agent_id: agentId })
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/api/health')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
