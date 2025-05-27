/**
 * cPanel API Client for Subdomain Management
 * Documentation: https://api.docs.cpanel.net/cpanel/introduction
 */

interface CPanelConfig {
  baseUrl: string
  username: string
  apiToken: string
  domain: string
}

interface SubdomainCreateRequest {
  subdomain: string
  domain: string
  dir?: string
}

interface SubdomainResponse {
  success: boolean
  data?: any
  errors?: string[]
  messages?: string[]
}

interface DNSRecord {
  name: string
  type: 'A' | 'CNAME' | 'TXT' | 'MX'
  record: string
  ttl?: number
}

export class CPanelAPIClient {
  private config: CPanelConfig
  private baseHeaders: Record<string, string>

  constructor(config: CPanelConfig) {
    this.config = config
    this.baseHeaders = {
      'Authorization': `cpanel ${config.username}:${config.apiToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'AgentesDeConversao/1.0'
    }
  }

  /**
   * Execute cPanel API call
   */
  private async executeAPI(
    module: string, 
    func: string, 
    params: Record<string, any> = {}
  ): Promise<SubdomainResponse> {
    try {
      const url = new URL(`${this.config.baseUrl}/execute/${module}/${func}`)
      
      // Add parameters to URL
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })

      console.log(`[cPanel API] ${module}::${func}`, { url: url.toString(), params })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.baseHeaders,
        timeout: 30000
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: data.status === 1,
        data: data.data,
        errors: data.errors,
        messages: data.messages
      }
    } catch (error) {
      console.error('[cPanel API] Error:', error)
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Create a subdomain
   */
  async createSubdomain(
    subdomain: string, 
    targetPath?: string
  ): Promise<SubdomainResponse> {
    const params: SubdomainCreateRequest = {
      subdomain,
      domain: this.config.domain,
      dir: targetPath || `public_html/${subdomain}`
    }

    return this.executeAPI('SubDomain', 'addsubdomain', params)
  }

  /**
   * Delete a subdomain
   */
  async deleteSubdomain(subdomain: string): Promise<SubdomainResponse> {
    return this.executeAPI('SubDomain', 'delsubdomain', {
      subdomain: `${subdomain}.${this.config.domain}`
    })
  }

  /**
   * List all subdomains
   */
  async listSubdomains(): Promise<SubdomainResponse> {
    return this.executeAPI('SubDomain', 'listsubdomains')
  }

  /**
   * Add DNS record
   */
  async addDNSRecord(record: DNSRecord): Promise<SubdomainResponse> {
    return this.executeAPI('ZoneEdit', 'add_zone_record', {
      domain: this.config.domain,
      name: record.name,
      type: record.type,
      record: record.record,
      ttl: record.ttl || 14400
    })
  }

  /**
   * Delete DNS record
   */
  async deleteDNSRecord(line: number): Promise<SubdomainResponse> {
    return this.executeAPI('ZoneEdit', 'remove_zone_record', {
      domain: this.config.domain,
      line
    })
  }

  /**
   * List DNS records
   */
  async listDNSRecords(): Promise<SubdomainResponse> {
    return this.executeAPI('ZoneEdit', 'fetch_zone_records', {
      domain: this.config.domain
    })
  }

  /**
   * Setup subdomain for Vercel deployment
   */
  async setupSubdomainForVercel(
    subdomain: string,
    vercelUrl: string
  ): Promise<SubdomainResponse> {
    try {
      // Create CNAME record pointing to Vercel
      const dnsResult = await this.addDNSRecord({
        name: subdomain,
        type: 'CNAME',
        record: vercelUrl.replace('https://', '').replace('http://', '')
      })

      if (!dnsResult.success) {
        return dnsResult
      }

      return {
        success: true,
        data: {
          subdomain: `${subdomain}.${this.config.domain}`,
          target: vercelUrl,
          type: 'CNAME'
        },
        messages: [`Subdomain ${subdomain}.${this.config.domain} configured for Vercel`]
      }
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Failed to setup subdomain']
      }
    }
  }

  /**
   * Verify subdomain is properly configured
   */
  async verifySubdomain(subdomain: string): Promise<{
    exists: boolean
    resolves: boolean
    target?: string
    responseTime?: number
  }> {
    try {
      const startTime = Date.now()
      const fullDomain = `${subdomain}.${this.config.domain}`
      
      // Test DNS resolution
      const response = await fetch(`https://${fullDomain}`, {
        method: 'HEAD',
        timeout: 10000
      })
      
      const responseTime = Date.now() - startTime
      
      return {
        exists: true,
        resolves: response.ok,
        target: response.url,
        responseTime
      }
    } catch (error) {
      return {
        exists: false,
        resolves: false
      }
    }
  }
}