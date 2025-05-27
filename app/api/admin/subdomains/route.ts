import { NextRequest, NextResponse } from 'next/server'
import { SubdomainManager } from '@/lib/cpanel/subdomain-manager'

/**
 * GET /api/admin/subdomains
 * Get current subdomain status
 */
export async function GET() {
  try {
    const manager = new SubdomainManager()
    const verification = await manager.verifyAllSubdomains()
    
    return NextResponse.json({
      success: true,
      data: {
        allHealthy: verification.allHealthy,
        subdomains: verification.results,
        config: manager.getSubdomainConfig(),
        summary: {
          total: verification.results.length,
          healthy: verification.results.filter(r => r.status === 'healthy').length,
          degraded: verification.results.filter(r => r.status === 'degraded').length,
          down: verification.results.filter(r => r.status === 'down').length
        }
      }
    })
    
  } catch (error) {
    console.error('[API] Subdomain status error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get subdomain status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/subdomains
 * Deploy all subdomains
 */
export async function POST() {
  try {
    const manager = new SubdomainManager()
    const result = await manager.deployAllSubdomains()
    
    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? 'All subdomains deployed successfully' 
        : 'Some subdomains failed to deploy',
      data: result
    })
    
  } catch (error) {
    console.error('[API] Subdomain deployment error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to deploy subdomains',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}