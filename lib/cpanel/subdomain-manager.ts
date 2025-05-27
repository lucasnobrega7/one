import { CPanelAPIClient } from './client'

interface SubdomainConfig {
  name: string
  description: string
  vercelUrl: string
  required: boolean
  path?: string
}

interface DeploymentResult {
  subdomain: string
  success: boolean
  url?: string
  error?: string
  verificationStatus?: {
    exists: boolean
    resolves: boolean
    responseTime?: number
  }
}

export class SubdomainManager {
  private cpanel: CPanelAPIClient
  private readonly requiredSubdomains: SubdomainConfig[] = [
    {
      name: 'lp',
      description: 'Landing Page & Marketing',
      vercelUrl: process.env.VERCEL_URL || 'agentesdeconversao.vercel.app',
      required: true,
      path: '/'
    },
    {
      name: 'login',
      description: 'Authentication System',
      vercelUrl: process.env.VERCEL_URL || 'agentesdeconversao.vercel.app',
      required: true,
      path: '/auth'
    },
    {
      name: 'dash',
      description: 'Dashboard & Main App',
      vercelUrl: process.env.VERCEL_URL || 'agentesdeconversao.vercel.app', 
      required: true,
      path: '/dashboard'
    },
    {
      name: 'docs',
      description: 'Documentation & Guides',
      vercelUrl: process.env.VERCEL_URL || 'agentesdeconversao.vercel.app',
      required: true,
      path: '/docs'
    },
    {
      name: 'api',
      description: 'Backend API',
      vercelUrl: process.env.VERCEL_URL || 'agentesdeconversao.vercel.app',
      required: true,
      path: '/api'
    }
  ]

  constructor() {
    this.cpanel = new CPanelAPIClient({
      baseUrl: process.env.CPANEL_BASE_URL || 'https://cpanel.agentesdeconversao.ai:2083',
      username: process.env.CPANEL_USERNAME || 'agentesdeconversao',
      apiToken: process.env.CPANEL_API_TOKEN || 'Q5HZZI8QVOVKP0HI5TDUS83KHCJ6ZZHH',
      domain: 'agentesdeconversao.ai'
    })
  }

  /**
   * Deploy all required subdomains
   */
  async deployAllSubdomains(): Promise<{
    success: boolean
    results: DeploymentResult[]
    summary: {
      total: number
      successful: number
      failed: number
    }
  }> {
    console.log('[SubdomainManager] Starting deployment of all subdomains...')
    
    const results: DeploymentResult[] = []
    
    for (const config of this.requiredSubdomains) {
      const result = await this.deploySubdomain(config)
      results.push(result)
      
      // Wait between deployments to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
    
    console.log('[SubdomainManager] Deployment completed:', summary)
    
    return {
      success: summary.failed === 0,
      results,
      summary
    }
  }

  /**
   * Deploy a single subdomain
   */
  async deploySubdomain(config: SubdomainConfig): Promise<DeploymentResult> {
    try {
      console.log(`[SubdomainManager] Deploying ${config.name}.agentesdeconversao.ai...`)
      
      // Setup subdomain with CNAME to Vercel
      const setupResult = await this.cpanel.setupSubdomainForVercel(
        config.name,
        config.vercelUrl
      )
      
      if (!setupResult.success) {
        return {
          subdomain: config.name,
          success: false,
          error: setupResult.errors?.join(', ') || 'Setup failed'
        }
      }
      
      // Wait for DNS propagation
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Verify subdomain
      const verification = await this.cpanel.verifySubdomain(config.name)
      
      const result: DeploymentResult = {
        subdomain: config.name,
        success: true,
        url: `https://${config.name}.agentesdeconversao.ai`,
        verificationStatus: verification
      }
      
      console.log(`[SubdomainManager] ✅ ${config.name} deployed successfully`)
      return result
      
    } catch (error) {
      console.error(`[SubdomainManager] ❌ Failed to deploy ${config.name}:`, error)
      
      return {
        subdomain: config.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Verify all subdomains are working
   */
  async verifyAllSubdomains(): Promise<{
    allHealthy: boolean
    results: Array<{
      subdomain: string
      status: 'healthy' | 'degraded' | 'down'
      url: string
      responseTime?: number
      error?: string
    }>
  }> {
    console.log('[SubdomainManager] Verifying all subdomains...')
    
    const results = []
    
    for (const config of this.requiredSubdomains) {
      const verification = await this.cpanel.verifySubdomain(config.name)
      const url = `https://${config.name}.agentesdeconversao.ai`
      
      let status: 'healthy' | 'degraded' | 'down' = 'down'
      if (verification.exists && verification.resolves) {
        status = verification.responseTime && verification.responseTime > 2000 ? 'degraded' : 'healthy'
      }
      
      results.push({
        subdomain: config.name,
        status,
        url,
        responseTime: verification.responseTime,
        error: !verification.exists ? 'DNS not configured' : !verification.resolves ? 'Not responding' : undefined
      })
    }
    
    const allHealthy = results.every(r => r.status === 'healthy')
    
    console.log('[SubdomainManager] Verification completed. All healthy:', allHealthy)
    
    return {
      allHealthy,
      results
    }
  }

  /**
   * Get subdomain configuration
   */
  getSubdomainConfig(): SubdomainConfig[] {
    return this.requiredSubdomains
  }

  /**
   * Remove all subdomains (for cleanup)
   */
  async removeAllSubdomains(): Promise<{
    success: boolean
    results: Array<{
      subdomain: string
      success: boolean
      error?: string
    }>
  }> {
    console.log('[SubdomainManager] Removing all subdomains...')
    
    const results = []
    
    for (const config of this.requiredSubdomains) {
      try {
        const result = await this.cpanel.deleteSubdomain(config.name)
        results.push({
          subdomain: config.name,
          success: result.success,
          error: result.errors?.join(', ')
        })
      } catch (error) {
        results.push({
          subdomain: config.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    const success = results.every(r => r.success)
    
    console.log('[SubdomainManager] Removal completed. Success:', success)
    
    return {
      success,
      results
    }
  }
}