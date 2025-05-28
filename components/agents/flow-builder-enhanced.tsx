"use client"

import { useCallback, useState, useRef, createContext, useContext, useEffect } from 'react'
import { 
  ReactFlow, 
  Controls, 
  Background, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Handle, 
  Position, 
  getBezierPath, 
  useReactFlow,
  BackgroundVariant
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Pause, 
  Save, 
  MessageSquare, 
  GitBranch, 
  Zap, 
  X, 
  Plus, 
  Search,
  Bot,
  Database,
  Webhook,
  Mail,
  Clock,
  Filter,
  Share2,
  Eye,
  Copy,
  Download,
  Settings,
  FileText,
  Users,
  BarChart3,
  Layers,
  Code
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types based on Prisma schema and ReactFlow
interface AgentFlowData {
  id?: string
  name: string
  description?: string
  system_prompt?: string
  model_name?: 'gpt_3_5_turbo' | 'gpt_4' | 'claude_3_5_sonnet' | 'mixtral_8x7b'
  temperature?: number
  max_tokens?: number
  organization_id?: string
  datastore_id?: string
}

interface FlowNodeData {
  id: string
  label: string
  type: 'agent' | 'condition' | 'action' | 'datasource' | 'webhook' | 'trigger'
  config: Record<string, any>
  agentData?: AgentFlowData
  status?: 'idle' | 'running' | 'success' | 'error'
}

// Enhanced Flow Context with N8N-inspired features
const FlowContext = createContext({
  reactFlowInstance: null,
  setReactFlowInstance: () => {},
  deleteNode: () => {},
  deleteEdge: () => {},
  selectedNode: null,
  setSelectedNode: () => {},
  saveFlow: () => {},
  loadFlow: () => {},
  runFlow: () => {},
  isRunning: false
})

// Enhanced Node Components with N8N/Chatvolt inspiration
function AgentNode({ data, selected }) {
  const { status = 'idle' } = data
  
  const statusColors = {
    idle: 'border-gray-300 bg-white',
    running: 'border-blue-500 bg-blue-50 animate-pulse',
    success: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50'
  }

  return (
    <div className={cn(
      "border-2 rounded-lg p-4 min-w-[220px] shadow-sm hover:shadow-md transition-all",
      selected ? "border-blue-500 shadow-lg" : statusColors[status]
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400"
      />
      
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <span className="font-medium text-gray-900">{data.label}</span>
          {data.agentData?.model_name && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {data.agentData.model_name}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-2 line-clamp-2">
        {data.agentData?.description || "Configure agent..."}
      </div>

      {status === 'running' && (
        <div className="text-xs text-blue-600 font-medium">Executando...</div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  )
}

function ConditionNode({ data, selected }) {
  const { status = 'idle' } = data
  
  return (
    <div className={cn(
      "border-2 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-all",
      selected ? "border-yellow-500 shadow-lg" : "border-gray-200 bg-white"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-yellow-600" />
        </div>
        <span className="font-medium">{data.label}</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-3">
        {data.config?.condition || "Configure condition..."}
      </div>
      
      <div className="flex justify-between">
        <Handle
          type="source"
          position={Position.Right}
          id="true"
          className="w-3 h-3 !bg-green-500"
          style={{ top: '70%' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="false"
          className="w-3 h-3 !bg-red-500"
          style={{ top: '85%' }}
        />
      </div>
      
      <div className="text-xs text-gray-500 mt-2 flex justify-between">
        <span className="text-green-600">Verdadeiro</span>
        <span className="text-red-600">Falso</span>
      </div>
    </div>
  )
}

function DataSourceNode({ data, selected }) {
  return (
    <div className={cn(
      "border-2 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-all",
      selected ? "border-purple-500 shadow-lg" : "border-gray-200 bg-white"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <Database className="w-4 h-4 text-purple-600" />
        </div>
        <span className="font-medium">{data.label}</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {data.config?.datasource_type || "Configure datasource..."}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-purple-500"
      />
    </div>
  )
}

function WebhookNode({ data, selected }) {
  return (
    <div className={cn(
      "border-2 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-all",
      selected ? "border-green-500 shadow-lg" : "border-gray-200 bg-white"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Webhook className="w-4 h-4 text-green-600" />
        </div>
        <span className="font-medium">{data.label}</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {data.config?.url || "Configure webhook..."}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500"
      />
    </div>
  )
}

function TriggerNode({ data, selected }) {
  return (
    <div className={cn(
      "border-2 rounded-lg p-4 min-w-[180px] shadow-sm hover:shadow-md transition-all border-gradient-to-r from-orange-400 to-red-500",
      selected ? "shadow-lg ring-2 ring-orange-300" : "bg-gradient-to-r from-orange-50 to-red-50"
    )}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-gray-900">{data.label}</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {data.config?.trigger_type || "Manual trigger"}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-orange-500"
      />
    </div>
  )
}

// Custom Edge with enhanced styling
function ButtonEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) {
  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition
  })
  
  const { deleteEdge } = useContext(FlowContext)
  
  const onEdgeClick = (evt) => {
    evt.stopPropagation()
    deleteEdge(id)
  }
  
  return (
    <>
      <path 
        id={id} 
        className="react-flow__edge-path stroke-2" 
        d={edgePath} 
        stroke={data?.isActive ? "#3b82f6" : "#9ca3af"}
        strokeWidth={data?.isActive ? 3 : 2}
      />
      <foreignObject
        width={30}
        height={30}
        x={edgeCenterX - 15}
        y={edgeCenterY - 15}
        className="overflow-visible pointer-events-none"
      >
        <button 
          className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-300 pointer-events-auto transition-colors shadow-sm"
          onClick={onEdgeClick}
        >
          <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
        </button>
      </foreignObject>
    </>
  )
}

// Enhanced Node Palette with categories
function NodePalette({ onNodeAdd }) {
  const [searchValue, setSearchValue] = useState('')
  const [activeCategory, setActiveCategory] = useState('triggers')
  
  const nodeCategories = {
    triggers: [
      { 
        type: 'triggerNode', 
        label: 'Manual Trigger', 
        icon: '🚀', 
        description: 'Inicia o fluxo manualmente',
        config: { trigger_type: 'manual' } 
      },
      { 
        type: 'triggerNode', 
        label: 'Webhook Trigger', 
        icon: '🔗', 
        description: 'Inicia via webhook',
        config: { trigger_type: 'webhook' } 
      },
      { 
        type: 'triggerNode', 
        label: 'Schedule Trigger', 
        icon: '⏰', 
        description: 'Inicia em horário programado',
        config: { trigger_type: 'schedule' } 
      }
    ],
    agents: [
      { 
        type: 'agentNode', 
        label: 'GPT-4 Agent', 
        icon: '🤖', 
        description: 'Agente com GPT-4',
        agentData: { 
          name: 'GPT-4 Agent', 
          model_name: 'gpt_4',
          temperature: 0.7,
          max_tokens: 1000
        } 
      },
      { 
        type: 'agentNode', 
        label: 'Claude Agent', 
        icon: '🧠', 
        description: 'Agente com Claude',
        agentData: { 
          name: 'Claude Agent', 
          model_name: 'claude_3_5_sonnet',
          temperature: 0.7,
          max_tokens: 1000
        } 
      }
    ],
    logic: [
      { 
        type: 'conditionNode', 
        label: 'If/Else', 
        icon: '🔀', 
        description: 'Condição lógica',
        config: { condition: 'Se condição for verdadeira' } 
      }
    ],
    data: [
      { 
        type: 'dataSourceNode', 
        label: 'Knowledge Base', 
        icon: '📚', 
        description: 'Base de conhecimento',
        config: { datasource_type: 'knowledge_base' } 
      },
      { 
        type: 'dataSourceNode', 
        label: 'Database', 
        icon: '🗄️', 
        description: 'Consulta ao banco',
        config: { datasource_type: 'database' } 
      }
    ],
    actions: [
      { 
        type: 'webhookNode', 
        label: 'HTTP Request', 
        icon: '🌐', 
        description: 'Requisição HTTP',
        config: { method: 'POST' } 
      },
      { 
        type: 'webhookNode', 
        label: 'Send Email', 
        icon: '📧', 
        description: 'Enviar email',
        config: { action_type: 'email' } 
      }
    ]
  }
  
  const categoryLabels = {
    triggers: 'Triggers',
    agents: 'Agentes IA',
    logic: 'Lógica',
    data: 'Dados',
    actions: 'Ações'
  }

  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = 'move'
  }
  
  const allNodes = Object.values(nodeCategories).flat()
  const filteredNodes = searchValue 
    ? allNodes.filter(node => 
        node.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        node.description.toLowerCase().includes(searchValue.toLowerCase())
      )
    : nodeCategories[activeCategory] || []
  
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Componentes</h3>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar componentes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        {!searchValue && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 text-xs">
              <TabsTrigger value="triggers" className="text-xs">Triggers</TabsTrigger>
              <TabsTrigger value="agents" className="text-xs">Agentes</TabsTrigger>
              <TabsTrigger value="logic" className="text-xs">Lógica</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 text-xs mt-1">
              <TabsTrigger value="data" className="text-xs">Dados</TabsTrigger>
              <TabsTrigger value="actions" className="text-xs">Ações</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      
      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredNodes.map((node, index) => (
            <div
              key={`${node.type}-${index}`}
              draggable
              onDragStart={(event) => onDragStart(event, node)}
              className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-sm hover:border-gray-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="text-lg">{node.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {node.label}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {node.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Enhanced Properties Panel
function PropertiesPanel({ node, onNodeUpdate }) {
  if (!node) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Selecione um componente para configurar</p>
        </div>
      </div>
    )
  }
  
  const handleInputChange = (field, value) => {
    if (field.startsWith('agentData.')) {
      const agentField = field.replace('agentData.', '')
      onNodeUpdate(node.id, { 
        agentData: { 
          ...node.data.agentData, 
          [agentField]: value 
        } 
      })
    } else if (field.startsWith('config.')) {
      const configField = field.replace('config.', '')
      onNodeUpdate(node.id, { 
        config: { 
          ...node.data.config, 
          [configField]: value 
        } 
      })
    } else {
      onNodeUpdate(node.id, { [field]: value })
    }
  }
  
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Propriedades</h3>
        <p className="text-sm text-gray-600">{node.type.replace('Node', '')}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Properties */}
        <div>
          <Label htmlFor="node-label">Nome do Componente</Label>
          <Input
            id="node-label"
            value={node.data.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Nome do componente"
          />
        </div>
        
        {/* Agent-specific properties */}
        {node.type === 'agentNode' && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Configurações do Agente</h4>
              
              <div>
                <Label htmlFor="agent-description">Descrição</Label>
                <Textarea
                  id="agent-description"
                  value={node.data.agentData?.description || ''}
                  onChange={(e) => handleInputChange('agentData.description', e.target.value)}
                  placeholder="Descreva o que este agente faz..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="agent-model">Modelo de IA</Label>
                <Select 
                  value={node.data.agentData?.model_name || 'gpt_3_5_turbo'} 
                  onValueChange={(value) => handleInputChange('agentData.model_name', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt_3_5_turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt_4">GPT-4</SelectItem>
                    <SelectItem value="claude_3_5_sonnet">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="mixtral_8x7b">Mixtral 8x7B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="agent-temperature">Temperatura ({node.data.agentData?.temperature || 0.7})</Label>
                <input
                  type="range"
                  id="agent-temperature"
                  min="0"
                  max="2"
                  step="0.1"
                  value={node.data.agentData?.temperature || 0.7}
                  onChange={(e) => handleInputChange('agentData.temperature', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="agent-tokens">Max Tokens</Label>
                <Input
                  id="agent-tokens"
                  type="number"
                  value={node.data.agentData?.max_tokens || 1000}
                  onChange={(e) => handleInputChange('agentData.max_tokens', parseInt(e.target.value))}
                  placeholder="1000"
                />
              </div>
              
              <div>
                <Label htmlFor="agent-prompt">System Prompt</Label>
                <Textarea
                  id="agent-prompt"
                  value={node.data.agentData?.system_prompt || ''}
                  onChange={(e) => handleInputChange('agentData.system_prompt', e.target.value)}
                  placeholder="Você é um assistente especializado em..."
                  rows={4}
                />
              </div>
            </div>
          </>
        )}
        
        {/* Condition-specific properties */}
        {node.type === 'conditionNode' && (
          <>
            <Separator />
            <div>
              <Label htmlFor="condition-logic">Condição</Label>
              <Input
                id="condition-logic"
                value={node.data.config?.condition || ''}
                onChange={(e) => handleInputChange('config.condition', e.target.value)}
                placeholder="Ex: idade > 18"
              />
            </div>
          </>
        )}
        
        {/* Webhook-specific properties */}
        {node.type === 'webhookNode' && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Configurações do Webhook</h4>
              
              <div>
                <Label htmlFor="webhook-url">URL</Label>
                <Input
                  id="webhook-url"
                  value={node.data.config?.url || ''}
                  onChange={(e) => handleInputChange('config.url', e.target.value)}
                  placeholder="https://example.com/webhook"
                />
              </div>
              
              <div>
                <Label htmlFor="webhook-method">Método HTTP</Label>
                <Select 
                  value={node.data.config?.method || 'POST'} 
                  onValueChange={(value) => handleInputChange('config.method', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Enhanced node types
const nodeTypes = {
  agentNode: AgentNode,
  conditionNode: ConditionNode,
  dataSourceNode: DataSourceNode,
  webhookNode: WebhookNode,
  triggerNode: TriggerNode
}

const edgeTypes = {
  buttonEdge: ButtonEdge
}

// Enhanced initial nodes with better data structure
const initialNodes = [
  {
    id: 'trigger-1',
    type: 'triggerNode',
    data: { 
      id: 'trigger-1',
      label: 'Manual Start', 
      type: 'trigger',
      config: { trigger_type: 'manual' }
    },
    position: { x: 100, y: 200 },
  },
  {
    id: 'agent-1',
    type: 'agentNode',
    data: { 
      id: 'agent-1',
      label: 'Atendimento Inicial', 
      type: 'agent',
      config: {},
      agentData: {
        name: 'Atendimento Inicial',
        description: 'Primeira interação com o cliente',
        model_name: 'gpt_4',
        temperature: 0.7,
        max_tokens: 1000,
        system_prompt: 'Você é um assistente de atendimento ao cliente especializado em primeiras interações.'
      }
    },
    position: { x: 400, y: 200 },
  }
]

const initialEdges = [
  { 
    id: 'e-trigger-agent', 
    source: 'trigger-1', 
    target: 'agent-1', 
    type: 'buttonEdge',
    data: { isActive: false }
  }
]

export function FlowBuilderEnhanced() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isRunning, setIsRunning] = useState(false)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [flowSaved, setFlowSaved] = useState(true)
  const reactFlowWrapper = useRef(null)
  
  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!flowSaved) {
        // Auto-save logic here
        console.log('Auto-saving flow...')
        setFlowSaved(true)
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [flowSaved, nodes, edges])

  // Utility function to get unique node ID
  const getUniqueNodeId = useCallback((nodeType) => {
    let suffix = 0
    let baseId = `${nodeType}_${suffix}`
    
    while (nodes.some(node => node.id === baseId)) {
      suffix += 1
      baseId = `${nodeType}_${suffix}`
    }
    
    return baseId
  }, [nodes])

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: 'buttonEdge',
        id: `${params.source}-${params.target}`,
        data: { isActive: false }
      }
      setEdges((eds) => addEdge(newEdge, eds))
      setFlowSaved(false)
    },
    [setEdges]
  )
  
  const onNodeClick = useCallback((event, clickedNode) => {
    setSelectedNode(clickedNode)
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          selected: node.id === clickedNode.id
        }
      }))
    )
  }, [setNodes])
  
  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    setSelectedNode(null)
    setFlowSaved(false)
  }, [setNodes, setEdges])
  
  const deleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
    setFlowSaved(false)
  }, [setEdges])
  
  const onNodeUpdate = useCallback((nodeId, updates) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: { ...node.data, ...updates }
            }
          : node
      )
    )
    
    // Update selected node if it's the one being updated
    if (selectedNode?.id === nodeId) {
      setSelectedNode({
        ...selectedNode,
        data: { ...selectedNode.data, ...updates }
      })
    }
    
    setFlowSaved(false)
  }, [setNodes, selectedNode])
  
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])
  
  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'))
      
      if (!nodeData || !reactFlowInstance) return
      
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })
      
      const nodeId = getUniqueNodeId(nodeData.type)
      const newNode = {
        id: nodeId,
        type: nodeData.type,
        position,
        data: {
          ...nodeData,
          id: nodeId,
        },
      }
      
      setNodes((nds) => nds.concat(newNode))
      setFlowSaved(false)
    },
    [reactFlowInstance, getUniqueNodeId, setNodes]
  )

  const handleSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject()
      console.log('Flow saved:', flow)
      // TODO: Implement actual save to backend/database
      setFlowSaved(true)
    }
  }, [reactFlowInstance])

  const handleRunFlow = useCallback(async () => {
    setIsRunning(true)
    
    // Simulate flow execution
    const triggerNodes = nodes.filter(node => node.type === 'triggerNode')
    
    for (const node of triggerNodes) {
      // Update node status to running
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: 'running' } }
            : n
        )
      )
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update to success
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: 'success' } }
            : n
        )
      )
    }
    
    setIsRunning(false)
  }, [nodes, setNodes])
  
  const contextValue = {
    reactFlowInstance,
    setReactFlowInstance,
    deleteNode,
    deleteEdge,
    selectedNode,
    setSelectedNode,
    saveFlow: handleSave,
    runFlow: handleRunFlow,
    isRunning
  }

  return (
    <FlowContext.Provider value={contextValue}>
      <Card className="h-[900px] overflow-hidden border-0 shadow-lg">
        <div className="h-full flex flex-col">
          {/* Enhanced Header */}
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-gray-900">AgentStudio</h3>
              <Badge variant={flowSaved ? "default" : "secondary"}>
                {flowSaved ? "Salvo" : "Não salvo"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleSave} disabled={flowSaved}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              
              <Button 
                size="sm" 
                onClick={handleRunFlow} 
                disabled={isRunning}
                className={isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {isRunning ? (
                  <><Pause className="h-4 w-4 mr-2" />Executando...</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" />Executar</>
                )}
              </Button>
              
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex">
            {/* Enhanced Node Palette */}
            <NodePalette onNodeAdd={() => {}} />
            
            {/* Enhanced Canvas */}
            <div className="flex-1 relative" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                deleteKeyCode={['Delete', 'Backspace']}
                className="bg-gray-50"
                minZoom={0.1}
                maxZoom={2}
              >
                <Controls 
                  className="bg-white border border-gray-200 shadow-lg" 
                  showZoom={true}
                  showFitView={true}
                  showInteractive={true}
                />
                <Background 
                  variant={BackgroundVariant.Dots}
                  gap={20} 
                  size={1} 
                  color="#e5e7eb" 
                />
                <MiniMap 
                  className="bg-white border border-gray-200 shadow-lg"
                  nodeColor={(node) => {
                    switch (node.type) {
                      case 'triggerNode': return '#f97316'
                      case 'agentNode': return '#3b82f6'
                      case 'conditionNode': return '#eab308'
                      case 'dataSourceNode': return '#8b5cf6'
                      case 'webhookNode': return '#10b981'
                      default: return '#6b7280'
                    }
                  }}
                  maskColor="rgba(0, 0, 0, 0.1)"
                />
              </ReactFlow>
            </div>
            
            {/* Enhanced Properties Panel */}
            <PropertiesPanel 
              node={selectedNode} 
              onNodeUpdate={onNodeUpdate}
            />
          </div>
        </div>
      </Card>
    </FlowContext.Provider>
  )
}