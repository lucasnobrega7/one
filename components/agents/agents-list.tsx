"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, MessageSquare, Settings, Trash2 } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/unified/api-client"
import { usePermissions } from "@/hooks/use-permissions"
import type { UnifiedAgent } from "@/lib/unified/dto/agent.dto"

export function AgentsList() {
  const [agents, setAgents] = useState<UnifiedAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { hasPermission } = usePermissions()

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.listAgents()
      
      if (response.success && response.data) {
        setAgents(response.data)
      } else {
        setError(response.error || "Erro ao carregar agentes")
      }
    } catch (err) {
      setError("Erro de conexão com a API")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm("Tem certeza que deseja excluir este agente?")) {
      return
    }

    try {
      const response = await apiClient.deleteAgent(agentId)
      
      if (response.success) {
        setAgents(agents.filter(agent => agent.id !== agentId))
      } else {
        alert(`Erro ao excluir agente: ${response.error}`)
      }
    } catch (err) {
      alert("Erro de conexão ao excluir agente")
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadAgents} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (agents.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum agente encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro agente para começar a automatizar conversas
            </p>
            {hasPermission("agents:create") && (
              <Button asChild>
                <Link href="/dashboard/agents/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Agente
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <CardDescription className="mt-1">
                  {agent.description || "Sem descrição"}
                </CardDescription>
              </div>
              <Badge variant={agent.isPublic ? "default" : "secondary"}>
                {agent.isPublic ? "Público" : "Privado"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {agent.systemPrompt && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {agent.systemPrompt}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1">
                {agent.tools && agent.tools.slice(0, 3).map((tool, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tool}
                  </Badge>
                ))}
                {agent.tools && agent.tools.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{agent.tools.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" className="flex-1">
                  <Link href={`/dashboard/agents/${agent.id}/chat`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Link>
                </Button>
                
                {true && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/agents/${agent.id}/settings`}>
                      <Settings className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                
                {true && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteAgent(agent.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}