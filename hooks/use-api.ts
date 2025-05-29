/**
 * React Hooks para interação com API FastAPI
 * Gerencia estado, loading, cache e error handling
 */

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api/api-client'
import { useToast } from '@/hooks/use-toast'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<{ data: T }>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall()
      setData(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      toast({
        title: 'Erro na API',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  }
}

// Agents hooks
export function useAgents() {
  return useApi(() => apiClient.getAgents())
}

export function useAgent(id: string) {
  return useApi(() => apiClient.getAgent(id), [id])
}

export function useAgentMutations() {
  const { toast } = useToast()

  const createAgent = async (agent: any) => {
    try {
      const response = await apiClient.createAgent(agent)
      toast({
        title: 'Agente criado',
        description: 'Agente criado com sucesso!',
      })
      return response
    } catch (error) {
      toast({
        title: 'Erro ao criar agente',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
      throw error
    }
  }

  const updateAgent = async (id: string, agent: any) => {
    try {
      const response = await apiClient.updateAgent(id, agent)
      toast({
        title: 'Agente atualizado',
        description: 'Agente atualizado com sucesso!',
      })
      return response
    } catch (error) {
      toast({
        title: 'Erro ao atualizar agente',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
      throw error
    }
  }

  const deleteAgent = async (id: string) => {
    try {
      const response = await apiClient.deleteAgent(id)
      toast({
        title: 'Agente excluído',
        description: 'Agente excluído com sucesso!',
      })
      return response
    } catch (error) {
      toast({
        title: 'Erro ao excluir agente',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
      throw error
    }
  }

  return {
    createAgent,
    updateAgent,
    deleteAgent,
  }
}

// Conversations hooks
export function useConversations() {
  return useApi(() => apiClient.getConversations())
}

export function useConversation(id: string) {
  return useApi(() => apiClient.getConversation(id), [id])
}

// Analytics hooks
export function useAnalytics(params?: Record<string, any>) {
  return useApi(() => apiClient.getAnalytics(params), [params])
}

export function useAgentAnalytics(agentId: string) {
  return useApi(() => apiClient.getAgentAnalytics(agentId), [agentId])
}

// Knowledge Base hooks
export function useDocuments() {
  return useApi(() => apiClient.getDocuments())
}

export function useDocumentUpload() {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const uploadDocument = async (file: File) => {
    try {
      setUploading(true)
      const response = await apiClient.uploadDocument(file)
      toast({
        title: 'Documento enviado',
        description: 'Documento processado com sucesso!',
      })
      return response
    } catch (error) {
      toast({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
      throw error
    } finally {
      setUploading(false)
    }
  }

  return {
    uploadDocument,
    uploading,
  }
}

// Agent Studio - Flow Management
export function useFlows() {
  return useApi(() => apiClient.getFlows())
}

export function useFlow(id: string) {
  return useApi(() => apiClient.getFlow(id), [id])
}

export function useFlowMutations() {
  const { toast } = useToast()

  const saveFlow = async (id: string, flowData: any) => {
    try {
      const response = await apiClient.saveFlow(id, flowData)
      toast({
        title: 'Fluxo salvo',
        description: 'Fluxo salvo com sucesso!',
      })
      return response
    } catch (error) {
      toast({
        title: 'Erro ao salvar fluxo',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
      throw error
    }
  }

  const publishFlow = async (id: string) => {
    try {
      const response = await apiClient.publishFlow(id)
      toast({
        title: 'Fluxo publicado',
        description: 'Fluxo publicado com sucesso!',
      })
      return response
    } catch (error) {
      toast({
        title: 'Erro ao publicar fluxo',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
      throw error
    }
  }

  return {
    saveFlow,
    publishFlow,
  }
}

// Integrations hooks
export function useIntegrations() {
  return useApi(() => apiClient.getIntegrations())
}

export function useIntegrationMutations() {
  const { toast } = useToast()

  const connectIntegration = async (platform: string, config: any) => {
    try {
      const response = await apiClient.connectIntegration(platform, config)
      toast({
        title: 'Integração conectada',
        description: `${platform} conectado com sucesso!`,
      })
      return response
    } catch (error) {
      toast({
        title: 'Erro na integração',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
      throw error
    }
  }

  return {
    connectIntegration,
  }
}

// Health Check hook
export function useHealthCheck() {
  return useApi(() => apiClient.healthCheck())
}