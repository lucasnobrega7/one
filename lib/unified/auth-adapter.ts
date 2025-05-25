import { auth } from '@/config/auth'
import { getSession } from 'next-auth/react'

export class UnifiedAuthAdapter {
  private apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.com.br'
  
  // Para o frontend (NextAuth sessions)
  async getSessionToken(): Promise<string | null> {
    // Try server-side first
    if (typeof window === 'undefined') {
      const session = await auth()
      return session?.user?.accessToken || null
    }
    
    // Client-side fallback
    const session = await getSession()
    return session?.user?.accessToken || null
  }
  
  // Para chamadas à API (Bearer token)
  async getApiHeaders(): Promise<Record<string, string>> {
    const token = await this.getSessionToken()
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      'X-API-Base': this.apiBaseUrl
    }
  }
  
  // Para autenticação com a API externa
  async authenticateWithExternalApi(credentials: {
    email: string
    password?: string
    provider?: string
    providerId?: string
  }): Promise<{ token: string; user: any } | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      
      if (!response.ok) {
        return null
      }
      
      const data = await response.json()
      return {
        token: data.access_token || data.token,
        user: data.user
      }
    } catch (error) {
      return null
    }
  }
  
  // Para refresh de token
  async refreshExternalToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
      
      if (!response.ok) {
        return null
      }
      
      const data = await response.json()
      return data.access_token || data.token
    } catch (error) {
      return null
    }
  }
  
  // Para validar token
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      return response.ok
    } catch (error) {
      return false
    }
  }
}

// Singleton instance
export const authAdapter = new UnifiedAuthAdapter()