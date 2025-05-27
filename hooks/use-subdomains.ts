'use client'

import { useState, useEffect, useCallback } from 'react'

interface SubdomainStatus {
  subdomain: string
  status: 'healthy' | 'degraded' | 'down'
  url: string
  responseTime?: number
  error?: string
}

interface UseSubdomainsReturn {
  subdomains: SubdomainStatus[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  deploy: () => Promise<boolean>
  deploying: boolean
  allHealthy: boolean
  summary: {
    total: number
    healthy: number
    degraded: number
    down: number
  }
}

export function useSubdomains(): UseSubdomainsReturn {
  const [subdomains, setSubdomains] = useState<SubdomainStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allHealthy, setAllHealthy] = useState(false)
  const [summary, setSummary] = useState({
    total: 0,
    healthy: 0,
    degraded: 0,
    down: 0
  })

  const fetchSubdomains = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/subdomains')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch subdomains')
      }
      
      if (result.success) {
        setSubdomains(result.data.subdomains)
        setAllHealthy(result.data.allHealthy)
        setSummary(result.data.summary)
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error fetching subdomains:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const deploySubdomains = useCallback(async (): Promise<boolean> => {
    try {
      setDeploying(true)
      setError(null)
      
      const response = await fetch('/api/admin/subdomains', {
        method: 'POST'
      })
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Deployment failed')
      }
      
      if (result.success) {
        // Refresh the subdomain status after deployment
        await fetchSubdomains()
        return true
      } else {
        throw new Error(result.error || 'Deployment failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Deployment error'
      setError(errorMessage)
      console.error('Error deploying subdomains:', err)
      return false
    } finally {
      setDeploying(false)
    }
  }, [fetchSubdomains])

  const refresh = useCallback(async () => {
    await fetchSubdomains()
  }, [fetchSubdomains])

  useEffect(() => {
    fetchSubdomains()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSubdomains, 30000)
    
    return () => clearInterval(interval)
  }, [fetchSubdomains])

  return {
    subdomains,
    loading,
    error,
    refresh,
    deploy: deploySubdomains,
    deploying,
    allHealthy,
    summary
  }
}