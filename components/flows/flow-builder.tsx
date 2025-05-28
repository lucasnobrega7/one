"use client"

import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { FlowSidebar } from './flow-sidebar'
import { CustomNode } from './custom-node'
import { CustomEdge } from './custom-edge'

// Tipos de nós personalizados baseados no Flowise
const nodeTypes = {
  customNode: CustomNode,
}

// Tipos de edge personalizados
const edgeTypes = {
  customEdge: CustomEdge,
}

// Nós iniciais inspirados no Flowise
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Chat Model',
      category: 'LLMs',
      icon: '🤖',
      description: 'OpenRouter GPT-4 com 87% margem'
    },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 400, y: 200 },
    data: { 
      label: 'Vector Store',
      category: 'Vector Stores',
      icon: '📊',
      description: 'Supabase pgvector integration'
    },
  },
]

const initialEdges: Edge[] = []

export function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const onConnect = useCallback(
    (params: Connection) => {
      const edge: Edge = {
        ...params,
        type: 'customEdge',
        id: `${params.source}-${params.target}`,
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const nodeData = JSON.parse(event.dataTransfer.getData('application/nodedata'))

      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = {
        x: event.clientX - 250, // Offset for sidebar
        y: event.clientY - 150, // Offset for header
      }

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'customNode',
        position,
        data: nodeData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes],
  )

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <FlowSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Flow Area */}
      <div className={`flex-1 transition-all duration-200 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="bg-gray-50"
        >
          <Controls className="bg-white shadow-lg" />
          <MiniMap 
            className="bg-white shadow-lg border"
            nodeColor="#e2e8f0"
            maskColor="rgba(0, 0, 0, 0.2)"
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#e2e8f0"
          />
        </ReactFlow>
      </div>
    </div>
  )
}