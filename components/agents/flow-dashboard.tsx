'use client'

import { useCallback, useState, useEffect, useMemo, memo } from 'react'
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
  useConnection,
  useReactFlow,
  ReactFlowProvider,
  type NodeTypes,
  type EdgeTypes,
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

// Custom node types - using NodeTypes for better type safety
const customNodeTypes: NodeTypes = {
  agent: AgentNode,
  trigger: TriggerNode,
  action: ActionNode,
  integration: IntegrationNode,
}

// Estilos memoizados para evitar recriação
const handleStyles = {
  target: { background: '#46B2E0', border: '2px solid #8A53D2' },
  source: { background: '#46B2E0', border: '2px solid #8A53D2' },
}

const cardBaseClasses = "min-w-[240px] border bg-[#1a1a1d] hover:border-[#46B2E0]/30 transition-colors duration-150"

// Agent Node Component - Otimizado com memo
const AgentNode = memo(({ data, selected }: { data: any; selected?: boolean }) => {
  // Memoizar classes CSS para evitar recálculos
  const cardClasses = useMemo(() => 
    `${cardBaseClasses} ${selected ? 'border-[#46B2E0] ring-2 ring-[#46B2E0]/20' : 'border-[#27272a]'}`,
    [selected]
  )

  const badgeVariant = data.status === 'active' ? 'default' : 'secondary'

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyles.target}
      />
      <Card className={cardClasses}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#46B2E0]" />
            <CardTitle className="text-sm text-white">{data.label}</CardTitle>
            <Badge variant={badgeVariant} className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white">
              {data.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <p className="text-xs text-gray-400">
            {data.description}
          </p>
          
          {/* Provider Status - Simplificado para melhor performance */}
          <div className="flex items-center gap-1">
            <Cpu className="h-3 w-3 text-[#8A53D2]" />
            <span className="text-xs text-[#8A53D2]">OpenRouter (87% margem)</span>
          </div>
          
          <div className="flex gap-1 mt-2">
            <Button size="sm" variant="outline" className="p-1">
              <Settings className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="p-1">
              <MessageSquare className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyles.source}
      />
    </>
  )
})

AgentNode.displayName = 'AgentNode'

// Trigger Node Component - Otimizado com memo
const TriggerNode = memo(({ data }: { data: any }) => (
  <>
    <Card className="min-w-[180px] border border-[#27272a] bg-[#1a1a1d] hover:border-[#46B2E0]/30 transition-colors duration-150">
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
      style={handleStyles.source}
    />
  </>
))

TriggerNode.displayName = 'TriggerNode'

// Estilos específicos para action nodes
const actionHandleStyles = {
  target: { background: '#8A53D2', border: '2px solid #E056A0' },
  source: { background: '#8A53D2', border: '2px solid #E056A0' },
}

// Action Node Component - Otimizado com memo
const ActionNode = memo(({ data }: { data: any }) => (
  <>
    <Handle
      type="target"
      position={Position.Left}
      style={actionHandleStyles.target}
    />
    <Card className="min-w-[180px] border border-[#27272a] bg-[#1a1a1d] hover:border-[#8A53D2]/30 transition-colors duration-150">
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
      style={actionHandleStyles.source}
    />
  </>
))

ActionNode.displayName = 'ActionNode'

// Estilos específicos para integration nodes  
const integrationHandleStyles = {
  target: { background: '#E056A0', border: '2px solid #46B2E0' },
  source: { background: '#E056A0', border: '2px solid #46B2E0' },
}

// Integration Node Component - Otimizado com memo
const IntegrationNode = memo(({ data }: { data: any }) => {
  const badgeVariant = data.connected ? 'default' : 'destructive'
  const badgeClasses = data.connected ? 'bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white' : ''

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={integrationHandleStyles.target}
      />
      <Card className="min-w-[180px] border border-[#27272a] bg-[#1a1a1d] hover:border-[#E056A0]/30 transition-colors duration-150">
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
          <Badge variant={badgeVariant} className={badgeClasses}>
            {data.connected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        style={integrationHandleStyles.source}
      />
    </>
  )
})

IntegrationNode.displayName = 'IntegrationNode'

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

// Enhanced validation function
const isValidConnection = (connection: Connection): boolean => {
  // Prevent self-connections
  if (connection.source === connection.target) return false
  
  // Only allow specific connection patterns
  const sourceType = connection.sourceHandle?.split('-')[0]
  const targetType = connection.targetHandle?.split('-')[0]
  
  // Business logic: triggers can only connect to agents, agents to actions/integrations
  if (sourceType === 'trigger' && targetType !== 'agent') return false
  if (sourceType === 'agent' && !['action', 'integration'].includes(targetType || '')) return false
  
  return true
}

function FlowDashboardInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isRunning, setIsRunning] = useState(false)
  const [aiClient, setAIClient] = useState<SmartAIClient | null>(null)
  const [availableModels, setAvailableModels] = useState<any[]>([])
  const permissions = usePermissions()
  const canCreateAgents = true
  const canManageIntegrations = true
  
  // Use React Flow hooks for better control
  const { fitView, setCenter } = useReactFlow()
  const connection = useConnection()
  
  // Memoize node types for performance
  const nodeTypes = useMemo(() => customNodeTypes, [])

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
    (params: Connection) => {
      if (isValidConnection(params)) {
        setEdges((eds) => addEdge(params, eds))
      }
    },
    [setEdges]
  )
  
  // Enhanced node update function with immutable updates (React Flow v12+) - Otimizado
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) => {
      const nodeIndex = nds.findIndex(node => node.id === nodeId)
      if (nodeIndex === -1) return nds
      
      const updatedNode = { ...nds[nodeIndex], data: { ...nds[nodeIndex].data, ...newData } }
      const newNodes = [...nds]
      newNodes[nodeIndex] = updatedNode
      return newNodes
    })
  }, [setNodes])
  
  // Delete handler for selected nodes and edges
  const onDelete = useCallback((nodesToDelete: Node[], edgesToDelete: Edge[]) => {
    console.log('Deleted nodes:', nodesToDelete.length, 'edges:', edgesToDelete.length)
    // Additional cleanup logic here if needed
  }, [])

  const addNewAgent = useCallback(() => {
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
  }, [setNodes])

  const toggleFlow = useCallback(() => {
    setIsRunning(prev => !prev)
    // Aqui você integraria com o backend para iniciar/parar o fluxo
  }, [])

  useEffect(() => {
    // Simular atualizações em tempo real do status dos agentes - otimizado com menos re-renders
    if (!isRunning) return

    const interval = setInterval(() => {
      setNodes((nds) => {
        let hasChanges = false
        const newNodes = nds.map((node) => {
          if (node.type === 'agent') {
            const newStatus = Math.random() > 0.7 ? 'processing' : 'active'
            if (node.data.status !== newStatus) {
              hasChanges = true
              return {
                ...node,
                data: {
                  ...node.data,
                  status: newStatus
                }
              }
            }
          }
          return node
        })
        // Só retorna novo array se houve mudanças
        return hasChanges ? newNodes : nds
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isRunning, setNodes])
  
  // Auto-fit view when nodes change - debounced for performance
  useEffect(() => {
    if (nodes.length === 0) return
    
    const timeoutId = setTimeout(() => {
      fitView({ duration: 600, padding: 0.1 })
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [nodes.length, fitView])

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

      {/* ReactFlow Canvas - Ultra otimizado para performance */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        className="bg-[#0e0e10]"
        fitView
        fitViewOptions={{ 
          padding: 0.1, 
          includeHiddenNodes: false,
          duration: 600,
          maxZoom: 1.5,
          minZoom: 0.5
        }}
        panOnDrag={true}
        selectNodesOnDrag={false}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionMode={ConnectionMode.Loose}
        multiSelectionKeyCode="Shift"
        deleteKeyCode="Delete"
        selectionKeyCode="Shift"
        // Performance optimizations
        nodeExtent={[[-1000, -1000], [1000, 1000]]}
        translateExtent={[[-2000, -2000], [2000, 2000]]}
        nodeOrigin={[0.5, 0.5]}
        snapToGrid={true}
        snapGrid={[15, 15]}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        maxZoom={2}
        minZoom={0.25}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        onlyRenderVisibleElements={true}
      >
        <Controls 
          position="bottom-right"
          showInteractive={false}
          showZoom={true}
          showFitView={true}
        />
        <MiniMap 
          nodeStrokeColor="#27272a"
          nodeColor="#1a1a1d"
          nodeBorderRadius={6}
          className="bg-[#0e0e10] border border-[#27272a]"
          position="bottom-left"
          ariaLabel="Flow minimap"
          pannable={true}
          zoomable={true}
          style={{ 
            backgroundColor: '#0e0e10',
            border: '1px solid #27272a'
          }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={15} 
          size={0.8}
          color="#27272a"
          style={{ opacity: 0.3 }}
        />
      </ReactFlow>
    </div>
  )
}

// Main component wrapped with ReactFlowProvider for v12+ compatibility
export function FlowDashboard() {
  return (
    <ReactFlowProvider>
      <FlowDashboardInner />
    </ReactFlowProvider>
  )
}