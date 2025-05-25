"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiCall } from '@/hooks/use-api-call'
import { usePermissions } from '@/hooks/use-permissions'
import { Bot, MoreVertical, Play, Pause, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface Agent {
  id: string
  name: string
  status: 'online' | 'offline' | 'maintenance'
  conversations: number
  createdAt?: string
  description?: string
}

export function FixedAgentsList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const { data, loading, error, execute } = useApiCall<Agent[]>()
  const { hasPermission, loading: permissionsLoading } = usePermissions()

  useEffect(() => {
    loadAgents()
  }, [])

  useEffect(() => {
    if (data) {
      setAgents(data)
    }
  }, [data])

  const loadAgents = async () => {
    await execute('/api/agents')
  }

  const handleStatusToggle = async (agentId: string, currentStatus: string) => {
    if (!hasPermission('agents:edit')) {
      toast.error('Você não tem permissão para editar agentes')
      return
    }

    const newStatus = currentStatus === 'online' ? 'offline' : 'online'
    
    // Atualização otimista
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, status: newStatus as any } : agent
    ))

    const response = await execute(`/api/agents/${agentId}/status`, {
      method: 'PUT',
      data: { status: newStatus }
    })

    if (!response) {
      // Reverter em caso de erro
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? { ...agent, status: currentStatus as any } : agent
      ))
    } else {
      toast.success(`Agente ${newStatus === 'online' ? 'ativado' : 'desativado'} com sucesso`)
    }
  }

  const handleDelete = async (agentId: string) => {
    if (!hasPermission('agents:delete')) {
      toast.error('Você não tem permissão para deletar agentes')
      return
    }

    if (!confirm('Tem certeza que deseja deletar este agente?')) return

    const response = await execute(`/api/agents/${agentId}`, { method: 'DELETE' })
    
    if (response) {
      setAgents(prev => prev.filter(agent => agent.id !== agentId))
      toast.success('Agente deletado com sucesso')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-gray-500'
      case 'maintenance': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      case 'maintenance': return 'Manutenção'
      default: return 'Desconhecido'
    }
  }

  if (loading || permissionsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="openai-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }  if (error && !agents.length) {
    return (
      <Card className="openai-card border-red-200">
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadAgents} variant="outline">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <Card key={agent.id} className="openai-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-blue-500" />
                <div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    <span className="text-sm text-gray-600">{getStatusText(agent.status)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {agent.conversations} conversas
                </Badge>
                
                {hasPermission('agents:edit') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusToggle(agent.id, agent.status)}
                    className="p-2"
                  >
                    {agent.status === 'online' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                {hasPermission('agents:delete') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(agent.id)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          {agent.description && (
            <CardContent>
              <p className="text-sm text-gray-600">{agent.description}</p>
            </CardContent>
          )}
        </Card>
      ))}
      
      {agents.length === 0 && !loading && (
        <Card className="openai-card">
          <CardContent className="p-8 text-center">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum agente encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Comece criando seu primeiro agente de conversação.
            </p>
            {hasPermission('agents:create') && (
              <Button>
                Criar Primeiro Agente
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}