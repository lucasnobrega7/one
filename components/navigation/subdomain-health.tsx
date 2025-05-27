'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SubdomainStatus = 'healthy' | 'degraded' | 'down' | 'checking'

export interface SubdomainHealth {
  subdomain: string
  status: SubdomainStatus
  responseTime?: number
  lastChecked: Date
  fallbackAvailable?: boolean
}

interface SubdomainHealthMonitorProps {
  className?: string
  showDetails?: boolean
}

export function SubdomainHealthMonitor({ 
  className, 
  showDetails = false 
}: SubdomainHealthMonitorProps) {
  const [healthStatus, setHealthStatus] = useState<SubdomainHealth[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const subdomains = [
    { key: 'lp', name: 'Landing Page' },
    { key: 'login', name: 'Authentication' },
    { key: 'dash', name: 'Dashboard' },
    { key: 'docs', name: 'Documentation' },
    { key: 'api', name: 'API' }
  ]

  const checkSubdomainHealth = async (subdomain: string): Promise<SubdomainHealth> => {
    const startTime = Date.now()
    
    try {
      const url = process.env.NODE_ENV === 'production'
        ? `https://${subdomain}.agentesdeconversao.ai/api/health`
        : `http://localhost:3000/api/health`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // Para evitar CORS em health checks
      })
      
      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime
      
      let status: SubdomainStatus = 'healthy'
      if (responseTime > 2000) status = 'degraded'
      if (!response.ok && response.status !== 0) status = 'down' // status 0 é esperado com no-cors
      
      return {
        subdomain,
        status,
        responseTime,
        lastChecked: new Date(),
        fallbackAvailable: true
      }
    } catch (error) {
      return {
        subdomain,
        status: 'down',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        fallbackAvailable: process.env.NODE_ENV === 'development'
      }
    }
  }

  const runHealthCheck = async () => {
    setIsChecking(true)
    
    try {
      const results = await Promise.all(
        subdomains.map(sub => checkSubdomainHealth(sub.key))
      )
      
      setHealthStatus(results)
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    runHealthCheck()
    
    // Check every 30 seconds
    const interval = setInterval(runHealthCheck, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: SubdomainStatus) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'down':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'checking':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: SubdomainStatus) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500'
      case 'degraded':
        return 'text-yellow-500'
      case 'down':
        return 'text-red-500'
      case 'checking':
        return 'text-blue-500'
    }
  }

  const overallStatus = healthStatus.length > 0
    ? healthStatus.every(h => h.status === 'healthy') 
      ? 'healthy'
      : healthStatus.some(h => h.status === 'down')
      ? 'down' 
      : 'degraded'
    : 'checking'

  if (!showDetails) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {getStatusIcon(isChecking ? 'checking' : overallStatus)}
        <span className={cn("text-sm", getStatusColor(isChecking ? 'checking' : overallStatus))}>
          {isChecking ? 'Verificando...' : 'Sistema operacional'}
        </span>
      </div>
    )
  }

  return (
    <div className={cn("bg-[#1a1a1d] border border-[#27272a] rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Status dos Subdomínios</h3>
        <button
          onClick={runHealthCheck}
          disabled={isChecking}
          className="text-blue-400 hover:text-blue-300 text-sm disabled:opacity-50"
        >
          {isChecking ? 'Verificando...' : 'Atualizar'}
        </button>
      </div>
      
      <div className="space-y-3">
        {subdomains.map((subdomain) => {
          const health = healthStatus.find(h => h.subdomain === subdomain.key)
          const status = health?.status || 'checking'
          
          return (
            <div key={subdomain.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(status)}
                <div>
                  <span className="text-white text-sm">{subdomain.name}</span>
                  <div className="text-xs text-gray-400">
                    {subdomain.key}.agentesdeconversao.ai
                  </div>
                </div>
              </div>
              
              <div className="text-right text-xs text-gray-400">
                {health?.responseTime && (
                  <div>{health.responseTime}ms</div>
                )}
                {health?.lastChecked && (
                  <div>{health.lastChecked.toLocaleTimeString()}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {healthStatus.some(h => h.status === 'down') && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">
            ⚠️ Alguns subdomínios estão indisponíveis. O sistema irá redirecionar automaticamente para versões alternativas.
          </p>
        </div>
      )}
    </div>
  )
}