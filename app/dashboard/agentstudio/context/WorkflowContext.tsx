'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react'

interface WorkflowContextType {
  nodes: Node[]
  edges: Edge[]
  workflowName: string
  isExecuting: boolean
  executionStatus: 'idle' | 'running' | 'success' | 'error'
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (nodeData: any) => void
  updateNode: (nodeId: string, data: any) => void
  deleteNode: (nodeId: string) => void
  saveWorkflow: () => Promise<void>
  loadWorkflow: (workflowId: string) => Promise<void>
  executeWorkflow: () => Promise<void>
  stopExecution: () => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    // Implementation will be added based on React Flow requirements
  }, [])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    // Implementation will be added based on React Flow requirements
  }, [])

  const onConnect = useCallback((connection: Connection) => {
    // Implementation for connecting nodes
  }, [])

  const addNode = useCallback((nodeData: any) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: nodeData.type,
      position: nodeData.position || { x: 250, y: 250 },
      data: nodeData.data || {},
    }
    setNodes(prev => [...prev, newNode])
  }, [])

  const updateNode = useCallback((nodeId: string, data: any) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    ))
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setEdges(prev => prev.filter(edge => edge.source !== nodeId && edge.target !== nodeId))
  }, [])

  const saveWorkflow = useCallback(async () => {
    // Implementation for saving workflow to backend
    console.log('Saving workflow...', { nodes, edges })
  }, [nodes, edges])

  const loadWorkflow = useCallback(async (workflowId: string) => {
    // Implementation for loading workflow from backend
    console.log('Loading workflow...', workflowId)
  }, [])

  const executeWorkflow = useCallback(async () => {
    setIsExecuting(true)
    setExecutionStatus('running')
    // Implementation for executing workflow
    console.log('Executing workflow...')
  }, [])

  const stopExecution = useCallback(() => {
    setIsExecuting(false)
    setExecutionStatus('idle')
    console.log('Stopping execution...')
  }, [])

  const value: WorkflowContextType = {
    nodes,
    edges,
    workflowName,
    isExecuting,
    executionStatus,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
    saveWorkflow,
    loadWorkflow,
    executeWorkflow,
    stopExecution,
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}