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
  Handle,
  Position,
  ConnectionLineType,
  ConnectionMode,
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
  Settings,
  Cpu
} from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'
import { SmartAIClient } from '@/lib/ai/smart-ai-client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Custom node types
const customNodeTypes = {
  agent: AgentNode,
  trigger: TriggerNode,
  action: ActionNode,
  integration: IntegrationNode,
}

// Agent Node Component
function AgentNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#46B2E0', border: '2px solid #8A53D2' }}
      />
      <Card className={`min-w-[240px] border ${selected ? 'border-[#46B2E0] ring-2 ring-[#46B2E0]/20' : 'border-[#27272a]'} bg-[#1a1a1d] hover:border-[#46B2E0]/30 transition-all duration-200`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#46B2E0]" />
            <CardTitle className="text-sm text-white">{data.label}</CardTitle>
            <Badge variant={data.status === 'active' ? 'default' : 'secondary'} className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white">
              {data.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <p className="text-xs text-gray-400">
            {data.description}
          </p>
          
          {/* Model Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">
              Modelo de IA:
            </label>
            <Select value={data.model || 'openai/gpt-4o-mini'}>
              <SelectTrigger className="h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai/gpt-4o-mini">GPT-4O Mini (Rápido)</SelectItem>
                <SelectItem value="openai/gpt-4o">GPT-4O (Balanced)</SelectItem>
                <SelectItem value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</SelectItem>
                <SelectItem value="google/gemini-pro-1.5">Gemini Pro 1.5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Provider Status */}
          <div className="flex items-center gap-1">
            <Cpu className="h-3 w-3 text-[#8A53D2]" />
            <span className="text-xs text-[#8A53D2]">OpenRouter (87% margem)</span>
          </div>
          
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
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#46B2E0', border: '2px solid #8A53D2' }}
      />
    </>
  )
}

// Trigger Node Component  
function TriggerNode({ data }: { data: any }) {
  return (
    <>
      <Card className="min-w-[180px] border border-[#27272a] bg-[#1a1a1d] hover:border-[#46B2E0]/30 transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#46B2E0]" />
            <CardTitle className="text-sm text-white">{data.label}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-400">
            {data.triggerType}
          </p>
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#46B2E0', border: '2px solid #8A53D2' }}
      />
    </>
  )
}

// Action Node Component
function ActionNode({ data }: { data: any }) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#8A53D2', border: '2px solid #E056A0' }}
      />
      <Card className="min-w-[180px] border border-[#27272a] bg-[#1a1a1d] hover:border-[#8A53D2]/30 transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#8A53D2]" />
            <CardTitle className="text-sm text-white">{data.label}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-400">
            {data.actionType}
          </p>
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#8A53D2', border: '2px solid #E056A0' }}
      />
    </>
  )
}

// Integration Node Component
function IntegrationNode({ data }: { data: any }) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#E056A0', border: '2px solid #46B2E0' }}
      />
      <Card className="min-w-[180px] border border-[#27272a] bg-[#1a1a1d] hover:border-[#E056A0]/30 transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#E056A0]" />
            <CardTitle className="text-sm text-white">{data.label}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-400">
            {data.service}
          </p>
          <Badge variant={data.connected ? 'default' : 'destructive'} className={data.connected ? 'bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white' : ''}>
            {data.connected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#E056A0', border: '2px solid #46B2E0' }}
      />
    </>
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
  const [aiClient, setAIClient] = useState<SmartAIClient | null>(null)
  const [availableModels, setAvailableModels] = useState<any[]>([])
  const permissions = usePermissions()
  const canCreateAgents = true
  const canManageIntegrations = true

  // Inicializar AI Client
  useEffect(() => {
    const client = new SmartAIClient({
      openrouter: {
        apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
        enabled: true,
      },
      openai: {
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
        enabled: true,
      },
      fallback: {
        enabled: true,
        retries: 3,
      },
    })

    setAIClient(client)
    
    // Carregar modelos disponíveis
    client.loadAvailableModels().then(setAvailableModels)
  }, [])

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
        description: 'Agente com OpenRouter + 300 modelos',
        status: 'inactive',
        model: 'openai/gpt-4o-mini'
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
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Badge variant={isRunning ? "default" : "secondary"}>
          {isRunning ? 'Fluxo Ativo' : 'Fluxo Parado'}
        </Badge>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Cpu className="h-3 w-3 mr-1" />
          OpenRouter Active
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
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        className="bg-[#0e0e10]"
        fitView
        panOnDrag={true}
        selectNodesOnDrag={false}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionMode={ConnectionMode.Loose}
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor="#27272a"
          nodeColor="#1a1a1d"
          nodeBorderRadius={8}
          className="bg-[#0e0e10] border border-[#27272a]"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#27272a"
        />
      </ReactFlow>
    </div>
  )
}