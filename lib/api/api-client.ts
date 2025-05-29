/**
 * API Client Unificado para comunicação Frontend <-> FastAPI
 * Gerencia autenticação JWT, retry policies e interceptors
 */

import { createClient } from '@/lib/supabase/client'

interface ApiClientConfig {
  baseURL: string
  timeout?: number
  retries?: number
}

interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

class ApiClient {
  private baseURL: string
  private timeout: number
  private retries: number
  private supabase = createClient()

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout || 30000
    this.retries = config.retries || 3
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await this.supabase.auth.getSession()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders()
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('API Request failed:', error)
      throw error
    }
  }

  // CRUD Operations for Agents
  async getAgents() {
    return this.request<any[]>('/agents')
  }

  async getAgent(id: string) {
    return this.request<any>(`/agents/${id}`)
  }

  async createAgent(agent: any) {
    return this.request<any>('/agents', {
      method: 'POST',
      body: JSON.stringify(agent),
    })
  }

  async updateAgent(id: string, agent: any) {
    return this.request<any>(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agent),
    })
  }

  async deleteAgent(id: string) {
    return this.request<any>(`/agents/${id}`, {
      method: 'DELETE',
    })
  }

  // Conversations
  async getConversations() {
    return this.request<any[]>('/conversations')
  }

  async getConversation(id: string) {
    return this.request<any>(`/conversations/${id}`)
  }

  async createConversation(conversation: any) {
    return this.request<any>('/conversations', {
      method: 'POST',
      body: JSON.stringify(conversation),
    })
  }

  // Analytics
  async getAnalytics(params?: Record<string, any>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request<any>(`/analytics/overview${queryString}`)
  }

  async getAgentAnalytics(agentId: string) {
    return this.request<any>(`/agents/${agentId}/analytics`)
  }

  // Knowledge Base
  async uploadDocument(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const headers = await this.getAuthHeaders()
    delete headers['Content-Type'] // Let browser set boundary for FormData

    const response = await fetch(`${this.baseURL}/knowledge/documents/upload`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getDocuments() {
    return this.request<any[]>('/knowledge/documents')
  }

  // Agent Studio - Flow Management
  async getFlows() {
    return this.request<any[]>('/flows')
  }

  async getFlow(id: string) {
    return this.request<any>(`/flows/${id}`)
  }

  async saveFlow(id: string, flowData: any) {
    return this.request<any>(`/flows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(flowData),
    })
  }

  async publishFlow(id: string) {
    return this.request<any>(`/flows/${id}/publish`, {
      method: 'POST',
    })
  }

  // Integrations
  async getIntegrations() {
    return this.request<any[]>('/integrations')
  }

  async connectIntegration(platform: string, config: any) {
    return this.request<any>(`/integrations/${platform}/connect`, {
      method: 'POST',
      body: JSON.stringify(config),
    })
  }

  // Health Check
  async healthCheck() {
    return this.request<{ status: string }>('/health')
  }
}

// Default API client instance
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.ai',
  timeout: 30000,
  retries: 3,
})

export default apiClient