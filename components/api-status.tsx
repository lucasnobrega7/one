"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type ApiStatusType = {
  name: string
  status: "online" | "offline" | "checking"
  responseTime?: number
  lastChecked?: Date
}

export function ApiStatus() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatusType[]>([
    { name: "OpenAI", status: "checking" },
    { name: "Anthropic", status: "checking" },
    { name: "Supabase", status: "checking" },
  ])

  const checkApiStatus = async (apiName: string): Promise<ApiStatusType> => {
    const startTime = Date.now()
    
    try {
      // Simulate API check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500))
      const responseTime = Date.now() - startTime
      
      return {
        name: apiName,
        status: Math.random() > 0.1 ? "online" : "offline",
        responseTime,
        lastChecked: new Date()
      }
    } catch (error) {
      return {
        name: apiName,
        status: "offline",
        lastChecked: new Date()
      }
    }
  }

  const checkAllApis = async () => {
    setApiStatuses(prev => prev.map(api => ({ ...api, status: "checking" as const })))
    
    const promises = apiStatuses.map(api => checkApiStatus(api.name))
    const results = await Promise.all(promises)
    
    setApiStatuses(results)
  }

  useEffect(() => {
    checkAllApis()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Online</Badge>
      case "offline":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Offline</Badge>
      case "checking":
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Verificando</Badge>
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Status das APIs</h3>
          <Button onClick={checkAllApis} variant="outline" size="sm">
            Atualizar
          </Button>
        </div>
        
        <div className="space-y-3">
          {apiStatuses.map((api) => (
            <div key={api.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(api.status)}
                <span className="text-white font-medium">{api.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                {api.responseTime && (
                  <span className="text-sm text-gray-400">
                    {api.responseTime}ms
                  </span>
                )}
                {getStatusBadge(api.status)}
              </div>
            </div>
          ))}
        </div>
        
        {apiStatuses.some(api => api.lastChecked) && (
          <div className="mt-4 text-xs text-gray-400">
            Última verificação: {apiStatuses.find(api => api.lastChecked)?.lastChecked?.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}