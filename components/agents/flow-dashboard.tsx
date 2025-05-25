'use client'

import { useCallback, useState, useEffect } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Database, 
  Globe, 
  Plus,
  Play,
  Pause,
  Settings
} from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'

// Custom node types
const customNodeTypes = {
  agent: AgentNode,
  trigger: TriggerNode,
  action: ActionNode,
  integration: IntegrationNode,
}

// Agent Node Component
function AgentNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[200px] border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-sm">{data.label}</CardTitle>
          <Badge variant={data.status === 'active' ? 'default' : 'secondary'}>
            {data.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {data.description}
        </p>
        <div className="flex gap-1 mt-2">
          <Button size="sm" variant="outline">
            <Settings className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <MessageSquare className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Trigger Node Component  
function TriggerNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[180px] border-2 border-green-500 bg-green-50 dark:bg-green-950">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-green-600" />
          <CardTitle className="text-sm">{data.label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {data.triggerType}
        </p>
      </CardContent>
    </Card>
  )
}

// Action Node Component
function ActionNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[180px] border-2 border-purple-500 bg-purple-50 dark:bg-purple-950">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-purple-600" />
          <CardTitle className="text-sm">{data.label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {data.actionType}
        </p>
      </CardContent>
    </Card>
  )
}

// Integration Node Component
function IntegrationNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[180px] border-2 border-orange-500 bg-orange-50 dark:bg-orange-950">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-orange-600" />
          <CardTitle className="text-sm">{data.label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {data.service}
        </p>
        <Badge variant={data.connected ? 'default' : 'destructive'}>
          {data.connected ? 'Conectado' : 'Desconectado'}
        </Badge>
      </CardContent>
    </Card>
  )
}

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 50, y: 50 },
    data: { 
      label: 'WhatsApp Trigger',
      triggerType: 'Nova mensagem recebida'
    },
  },
  {
    id: '2',
    type: 'agent',
    position: { x: 300, y: 50 },
    data: { 
      label: 'Agente de Vendas',
      description: 'Especialista em conversão de leads',
      status: 'active'
    },
  },
  {
    id: '3',
    type: 'action',
    position: { x: 550, y: 50 },
    data: { 
      label: 'Enviar Resposta',
      actionType: 'Resposta automática'
    },
  },
  {
    id: '4',
    type: 'integration',
    position: { x: 300, y: 200 },
    data: { 
      label: 'CRM Integration',
      service: 'HubSpot',
      connected: true
    },
  },
]

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    animated: true,
    style: { stroke: '#10b981' }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3',
    animated: true,
    style: { stroke: '#3b82f6' }
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4',
    animated: true,
    style: { stroke: '#f59e0b' }
  },
]

export function FlowDashboard() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isRunning, setIsRunning] = useState(false)
  const permissions = usePermissions()
  const canCreateAgents = true
  const canManageIntegrations = true

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addNewAgent = () => {
    const newNode: Node = {
      id: `agent-${Date.now()}`,
      type: 'agent',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        label: 'Novo Agente',
        description: 'Configurar agente...',
        status: 'inactive'
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const toggleFlow = () => {
    setIsRunning(!isRunning)
    // Aqui você integraria com o backend para iniciar/parar o fluxo
  }

  useEffect(() => {
    // Simular atualizações em tempo real do status dos agentes
    const interval = setInterval(() => {
      if (isRunning) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.type === 'agent') {
              return {
                ...node,
                data: {
                  ...node.data,
                  status: Math.random() > 0.7 ? 'processing' : 'active'
                }
              }
            }
            return node
          })
        )
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isRunning, setNodes])

  return (
    <div className="w-full h-[600px] relative">
      {/* Flow Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          onClick={toggleFlow}
          variant={isRunning ? "destructive" : "default"}
          size="sm"
        >
          {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isRunning ? 'Pausar Fluxo' : 'Iniciar Fluxo'}
        </Button>
        
        {canCreateAgents && (
          <Button onClick={addNewAgent} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Agente
          </Button>
        )}
      </div>

      {/* Flow Status */}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant={isRunning ? "default" : "secondary"}>
          {isRunning ? 'Fluxo Ativo' : 'Fluxo Parado'}
        </Badge>
      </div>

      {/* ReactFlow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={customNodeTypes}
        className="bg-gray-50 dark:bg-gray-900"
        fitView
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor="#374151"
          nodeColor="#9ca3af"
          nodeBorderRadius={8}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#d1d5db"
        />
      </ReactFlow>
    </div>
  )
}