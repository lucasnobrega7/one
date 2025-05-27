'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  RefreshCw,
  ExternalLink,
  Settings,
  Zap
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SubdomainStatus {
  subdomain: string
  status: 'healthy' | 'degraded' | 'down'
  url: string
  responseTime?: number
  error?: string
}

interface SubdomainData {
  allHealthy: boolean
  subdomains: SubdomainStatus[]
  summary: {
    total: number
    healthy: number
    degraded: number
    down: number
  }
}

export default function SubdomainsPage() {
  const [data, setData] = useState<SubdomainData | null>(null)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [fixingDomain, setFixingDomain] = useState(false)
  const { toast } = useToast()

  const fetchSubdomainStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/subdomains')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch status')
      }
    } catch (error) {
      console.error('Error fetching subdomain status:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao carregar status dos subdomínios',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const deployAllSubdomains = async () => {
    try {
      setDeploying(true)
      const response = await fetch('/api/admin/subdomains', {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Subdomínios implantados com sucesso!',
        })
        await fetchSubdomainStatus()
      } else {
        throw new Error(result.error || 'Deployment failed')
      }
    } catch (error) {
      console.error('Error deploying subdomains:', error)
      toast({
        title: 'Erro',
        description: 'Falha na implantação dos subdomínios',
        variant: 'destructive'
      })
    } finally {
      setDeploying(false)
    }
  }

  const fixMainDomain = async () => {
    try {
      setFixingDomain(true)
      const response = await fetch('/api/admin/fix-domain', {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Domínio principal corrigido! Aguarde propagação DNS.',
        })
        await fetchSubdomainStatus()
      } else {
        throw new Error(result.error || 'Domain fix failed')
      }
    } catch (error) {
      console.error('Error fixing domain:', error)
      toast({
        title: 'Erro',
        description: 'Falha na correção do domínio principal',
        variant: 'destructive'
      })
    } finally {
      setFixingDomain(false)
    }
  }

  useEffect(() => {
    fetchSubdomainStatus()
    const interval = setInterval(fetchSubdomainStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'down':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-500" />
            Gerenciamento de Subdomínios
          </h1>
          <p className="text-gray-600 mt-2">
            Configure e monitore os subdomínios do agentesdeconversao.ai
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchSubdomainStatus}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button
            onClick={fixMainDomain}
            disabled={fixingDomain || loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {fixingDomain ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Settings className="w-4 h-4 mr-2" />
            )}
            Corrigir Domínio Principal
          </Button>
          
          <Button
            onClick={deployAllSubdomains}
            disabled={deploying || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {deploying ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Implantar Todos
          </Button>
        </div>
      </div>

      {/* Subdomains List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Status dos Subdomínios
          </CardTitle>
          <CardDescription>
            Monitor em tempo real do status de todos os subdomínios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2">Carregando status...</span>
            </div>
          ) : data ? (
            <div className="space-y-4">
              {data.subdomains.map((subdomain) => (
                <div
                  key={subdomain.subdomain}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(subdomain.status)}
                    <div>
                      <h4 className="font-medium">
                        {subdomain.subdomain}.agentesdeconversao.ai
                      </h4>
                      <p className="text-sm text-gray-600">
                        {subdomain.error || `${subdomain.responseTime}ms`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge>
                      {subdomain.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={subdomain.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visitar
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Falha ao carregar dados dos subdomínios</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}