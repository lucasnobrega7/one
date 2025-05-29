// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createBrowserClient } from '@supabase/ssr'

export interface DigitalOceanConfig {
  clientId: string
  redirectUri: string
}

export interface DigitalOceanTokens {
  access_token: string
  token_type: string
  scope: string
}

export class DigitalOceanClient {
  private config: DigitalOceanConfig
  private supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  constructor(config: DigitalOceanConfig) {
    this.config = config
  }

  /**
   * Generate the authorization URL for DigitalOcean OAuth
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'read write',
    })

    if (state) {
      params.set('state', state)
    }

    return `https://cloud.digitalocean.com/v1/oauth/authorize?${params.toString()}`
  }

  /**
   * Get stored DigitalOcean tokens for the current user
   */
  async getTokens(): Promise<DigitalOceanTokens | null> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No active session')
      }

      const { data, error } = await this.supabase
        .from('user_integrations')
        .select('access_token, token_type, scope')
        .eq('user_id', session.user.id)
        .eq('provider', 'digitalocean')
        .single()

      if (error || !data) {
        return null
      }

      return {
        access_token: data.access_token,
        token_type: data.token_type,
        scope: data.scope,
      }
    } catch (error) {
      console.error('Error getting DigitalOcean tokens:', error)
      return null
    }
  }

  /**
   * Make authenticated requests to DigitalOcean API
   */
  async apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const tokens = await this.getTokens()
    
    if (!tokens) {
      throw new Error('No DigitalOcean tokens found. Please connect your account.')
    }

    const response = await fetch(`https://api.digitalocean.com/v2${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `${tokens.token_type} ${tokens.access_token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`DigitalOcean API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get account information
   */
  async getAccount() {
    return this.apiRequest('/account')
  }

  /**
   * List all droplets
   */
  async getDroplets() {
    return this.apiRequest('/droplets')
  }

  /**
   * Get specific droplet
   */
  async getDroplet(dropletId: string) {
    return this.apiRequest(`/droplets/${dropletId}`)
  }

  /**
   * List all projects
   */
  async getProjects() {
    return this.apiRequest('/projects')
  }

  /**
   * Get billing information
   */
  async getBilling() {
    return this.apiRequest('/customers/my/balance')
  }

  /**
   * Check if user has connected DigitalOcean account
   */
  async isConnected(): Promise<boolean> {
    const tokens = await this.getTokens()
    return tokens !== null
  }

  /**
   * Disconnect DigitalOcean account
   */
  async disconnect(): Promise<void> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No active session')
      }

      const { error } = await this.supabase
        .from('user_integrations')
        .delete()
        .eq('user_id', session.user.id)
        .eq('provider', 'digitalocean')

      if (error) {
        throw new Error('Failed to disconnect DigitalOcean account')
      }
    } catch (error) {
      console.error('Error disconnecting DigitalOcean:', error)
      throw error
    }
  }
}

// Default client instance
export const digitalOceanClient = new DigitalOceanClient({
  clientId: process.env.NEXT_PUBLIC_DIGITALOCEAN_CLIENT_ID || '',
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/digitalocean`,
})