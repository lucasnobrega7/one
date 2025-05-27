// API Client moderno para Agentes de Conversão
import { getSession } from 'next-auth/react'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  status?: number
}

class ApiClient {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.ai'
  }

  private async getHeaders(): Promise<Record<string, string>> {
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
    try {
      const url = `${this.baseUrl}${endpoint}`
      const headers = await this.getHeaders()

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      })

      // Tentar parsear JSON, mas lidar com erros
      let data: any = null
      try {
        data = await response.json()
      } catch {
        // Se não conseguir parsear JSON, criar resposta genérica
        data = { message: response.statusText }
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}`,
          status: response.status
        }
      }

      return {
        success: true,
        data,
        status: response.status
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        status: 0
      }
    }
  }

  // Métodos HTTP básicos
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()