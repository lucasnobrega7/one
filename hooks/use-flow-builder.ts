"use client"

import { useState, useCallback } from 'react'
import { Node, Edge } from '@xyflow/react'

// Types based on Prisma schema
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

interface FlowSaveData {
  id?: string
  name: string
  description?: string
  nodes: Node[]
  edges: Edge[]
  organization_id: string
  metadata?: Record<string, any>
}

export function useFlowBuilder(organizationId: string) {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Save flow to database
  const saveFlow = useCallback(async (flowData: FlowSaveData) => {
    setSaving(true)
    setError(null)
    
    try {
      // Extract agent data from nodes
      const agentNodes = flowData.nodes.filter(node => node.type === 'agentNode')
      
      // Save agents first
      const savedAgents = await Promise.all(
        agentNodes.map(async (node) => {
          const agentData = node.data.agentData as AgentFlowData
          
          const response = await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...agentData,
              organization_id: organizationId
            })
          })
          
          if (!response.ok) throw new Error('Failed to save agent')
          return response.json()
        })
      )
      
      // Update node data with saved agent IDs
      const updatedNodes = flowData.nodes.map(node => {
        if (node.type === 'agentNode') {
          const savedAgent = savedAgents.find(agent => 
            agent.name === node.data.agentData?.name
          )
          return {
            ...node,
            data: {
              ...node.data,
              agentData: {
                ...node.data.agentData,
                id: savedAgent?.id
              }
            }
          }
        }
        return node
      })
      
      // Save flow metadata
      const flowResponse = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...flowData,
          nodes: updatedNodes,
          organization_id: organizationId
        })
      })
      
      if (!flowResponse.ok) throw new Error('Failed to save flow')
      
      const savedFlow = await flowResponse.json()
      return savedFlow
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setSaving(false)
    }
  }, [organizationId])

  // Load flow from database
  const loadFlow = useCallback(async (flowId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/flows/${flowId}`)
      if (!response.ok) throw new Error('Failed to load flow')
      
      const flowData = await response.json()
      return flowData
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // List flows for organization
  const listFlows = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/flows?organization_id=${organizationId}`)
      if (!response.ok) throw new Error('Failed to load flows')
      
      const flows = await response.json()
      return flows
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  // Execute flow
  const executeFlow = useCallback(async (flowId: string, inputData?: Record<string, any>) => {
    try {
      const response = await fetch(`/api/flows/${flowId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputData })
      })
      
      if (!response.ok) throw new Error('Failed to execute flow')
      
      const result = await response.json()
      return result
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [])

  return {
    saveFlow,
    loadFlow,
    listFlows,
    executeFlow,
    saving,
    loading,
    error
  }
}