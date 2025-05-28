"use client"

import { useCallback, useState, useRef, createContext, useContext } from 'react'
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, addEdge, Handle, Position, getBezierPath, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
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
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types based on Prisma schema
interface AgentFlowData {
  id?: string
  name: string
  description?: string
  system_prompt?: string
  model_name?: string
  temperature?: number
  max_tokens?: number
  organization_id?: string
  datastore_id?: string
}

interface FlowNodeData {
  id: string
  label: string
  type: 'agent' | 'condition' | 'action' | 'datasource' | 'webhook'
  config: Record<string, any>
  agentData?: AgentFlowData
}

// Flow Context
const FlowContext = createContext({
  reactFlowInstance: null,
  setReactFlowInstance: () => {},
  deleteNode: () => {},
  deleteEdge: () => {},
  selectedNode: null,
  setSelectedNode: () => {},
  saveFlow: () => {},
  loadFlow: () => {}
})

// Custom Node Components
function ConversationNode({ data, selected }) {
  return (
    <div className={cn(
      "bg-white border-2 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-all",
      selected ? "border-blue-500 shadow-lg" : "border-gray-200"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-blue-600" />
        </div>
        <span className="font-medium">{data.label}</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {data.message || "Configure message..."}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  )
}

function ConditionNode({ data, selected }) {
  return (
    <div className={cn(
      "bg-white border-2 rounded-lg p-4 min-w-[180px] shadow-sm hover:shadow-md transition-all",
      selected ? "border-yellow-500 shadow-lg" : "border-gray-200"
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
      
      <div className="text-sm text-gray-600 mb-2">
        {data.condition || "Configure condition..."}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 !bg-green-500"
        style={{ top: '60%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 !bg-red-500"
        style={{ top: '80%' }}
      />
    </div>
  )
}

function ActionNode({ data, selected }) {
  return (
    <div className={cn(
      "bg-white border-2 rounded-lg p-4 min-w-[180px] shadow-sm hover:shadow-md transition-all",
      selected ? "border-green-500 shadow-lg" : "border-gray-200"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Zap className="w-4 h-4 text-green-600" />
        </div>
        <span className="font-medium">{data.label}</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {data.action || "Configure action..."}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500"
      />
    </div>
  )
}

// Custom Edge with Delete Button
function ButtonEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
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
      <path id={id} className="react-flow__edge-path stroke-2 stroke-gray-300" d={edgePath} />
      <foreignObject
        width={30}
        height={30}
        x={edgeCenterX - 15}
        y={edgeCenterY - 15}
        className="overflow-visible pointer-events-none"
      >
        <button 
          className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-300 pointer-events-auto transition-colors"
          onClick={onEdgeClick}
        >
          <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
        </button>
      </foreignObject>
    </>
  )
}

// Node Palette Component
function NodePalette({ onNodeAdd }) {
  const [searchValue, setSearchValue] = useState('')
  
  const nodeCategories = {
    conversation: [
      { type: 'conversationNode', label: 'Saudação', icon: '👋', data: { message: 'Olá! Como posso ajudar?' } },
      { type: 'conversationNode', label: 'Pergunta', icon: '❓', data: { message: 'Qual é sua necessidade?' } },
      { type: 'conversationNode', label: 'Resposta', icon: '💬', data: { message: 'Entendi sua situação.' } },
    ],
    logic: [
      { type: 'conditionNode', label: 'Condição', icon: '🔀', data: { condition: 'Se idade > 18' } },
      { type: 'actionNode', label: 'Delay', icon: '⏱️', data: { action: 'Aguardar 5 segundos' } },
    ],
    actions: [
      { type: 'actionNode', label: 'Webhook', icon: '🔗', data: { action: 'Enviar para CRM' } },
      { type: 'actionNode', label: 'Email', icon: '📧', data: { action: 'Enviar email' } },
    ]
  }
  
  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = 'move'
  }
  
  const filteredCategories = Object.entries(nodeCategories).reduce((acc, [category, nodes]) => {
    const filtered = nodes.filter(node => 
      node.label.toLowerCase().includes(searchValue.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {})
  
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">Componentes</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar componentes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(filteredCategories).map(([category, nodes]) => (
          <div key={category}>
            <h4 className="font-medium text-gray-700 mb-2 capitalize text-sm">
              {category === 'conversation' ? 'Conversação' : 
               category === 'logic' ? 'Lógica' : 'Ações'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {nodes.map((node, index) => (
                <div
                  key={`${node.type}-${index}`}
                  draggable
                  onDragStart={(event) => onDragStart(event, node)}
                  className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-sm hover:border-gray-300 transition-all"
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">{node.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{node.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Properties Panel
function PropertiesPanel({ node, onNodeUpdate }) {
  if (!node) return null
  
  const handleInputChange = (field, value) => {
    onNodeUpdate(node.id, { [field]: value })
  }
  
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Propriedades</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          <Input
            value={node.data.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Nome do componente"
          />
        </div>
        
        {node.type === 'conversationNode' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md resize-none h-20"
              value={node.data.message || ''}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Digite a mensagem..."
            />
          </div>
        )}
        
        {node.type === 'conditionNode' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição
            </label>
            <Input
              value={node.data.condition || ''}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              placeholder="Ex: idade > 18"
            />
          </div>
        )}
        
        {node.type === 'actionNode' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ação
            </label>
            <Input
              value={node.data.action || ''}
              onChange={(e) => handleInputChange('action', e.target.value)}
              placeholder="Descreva a ação..."
            />
          </div>
        )}
      </div>
    </div>
  )
}

const nodeTypes = {
  conversationNode: ConversationNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode
}

const edgeTypes = {
  buttonEdge: ButtonEdge
}

const initialNodes = [
  {
    id: '1',
    type: 'conversationNode',
    data: { label: 'Início da Conversa', message: 'Olá! Bem-vindo ao nosso atendimento.' },
    position: { x: 250, y: 50 },
  },
  {
    id: '2',
    type: 'conversationNode',
    data: { label: 'Saudação', message: 'Como posso ajudar você hoje?' },
    position: { x: 100, y: 200 },
  },
  {
    id: '3',
    type: 'conditionNode',
    data: { label: 'Qualificação', condition: 'É cliente?' },
    position: { x: 400, y: 200 },
  },
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'buttonEdge' },
  { id: 'e1-3', source: '1', target: '3', type: 'buttonEdge' },
]

export function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isRunning, setIsRunning] = useState(false)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const reactFlowWrapper = useRef(null)
  
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
        id: `${params.source}-${params.target}`
      }
      setEdges((eds) => addEdge(newEdge, eds))
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
  }, [setNodes, setEdges])
  
  const deleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
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
          ...nodeData.data,
          label: nodeData.label,
          id: nodeId,
        },
      }
      
      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, getUniqueNodeId, setNodes]
  )

  const handleSave = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject()
      console.log('Flow saved:', flow)
      // Implementar salvamento real aqui
    }
  }

  const handleToggleRun = () => {
    setIsRunning(!isRunning)
  }
  
  const contextValue = {
    reactFlowInstance,
    setReactFlowInstance,
    deleteNode,
    deleteEdge,
    selectedNode,
    setSelectedNode
  }

  return (
    <FlowContext.Provider value={contextValue}>
      <Card className="h-[800px] overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-900">Flow Builder - Agentes de Conversão</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button size="sm" onClick={handleToggleRun} className={isRunning ? 'bg-red-600 hover:bg-red-700' : ''}>
                {isRunning ? (
                  <><Pause className="h-4 w-4 mr-2" />Pausar</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" />Executar</>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex">
            {/* Node Palette */}
            <NodePalette onNodeAdd={() => {}} />
            
            {/* Canvas */}
            <div className="flex-1" ref={reactFlowWrapper}>
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
              >
                <Controls className="bg-white border border-gray-200" />
                <Background gap={16} size={1} color="#e5e7eb" />
              </ReactFlow>
            </div>
            
            {/* Properties Panel */}
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