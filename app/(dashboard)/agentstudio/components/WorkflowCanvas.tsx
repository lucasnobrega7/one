'use client'

import { useCallback, useRef, useState } from 'react'
import { ReactFlow, Controls, Background, BackgroundVariant, MiniMap, useNodesState, useEdgesState, addEdge, Connection, ReactFlowInstance, Node, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import CustomNode from './nodes/CustomNode'
import CustomEdge from './edges/CustomEdge'

const nodeTypes = {
  default: CustomNode,
}

const edgeTypes = {
  default: CustomEdge,
}

interface WorkflowCanvasProps {
  onNodeSelect: (nodeId: string | null) => void
  selectedNode: string | null
}

export default function WorkflowCanvas({ onNodeSelect, selectedNode }: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const nodeData = event.dataTransfer.getData('application/reactflow')

      if (!nodeData) return

      try {
        const parsedNodeData = JSON.parse(nodeData)
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        const newNode: Node = {
          id: `${parsedNodeData.type}_${Date.now()}`,
          type: 'default',
          position,
          data: parsedNodeData.data,
        }

        setNodes((nds) => nds.concat(newNode))
        onNodeSelect(newNode.id)
      } catch (error) {
        console.error('Error parsing node data:', error)
      }
    },
    [reactFlowInstance, setNodes, onNodeSelect]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => onNodeSelect(node.id),
    [onNodeSelect]
  )

  const onPaneClick = useCallback(() => onNodeSelect(null), [onNodeSelect])

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-[#1a1a1a]"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2a2a" />
        <Controls className="!bg-[#252525] !border-[#3a3a3a]" />
        <MiniMap className="!bg-[#252525] !border-[#3a3a3a]" pannable zoomable />
      </ReactFlow>
    </div>
  )
}