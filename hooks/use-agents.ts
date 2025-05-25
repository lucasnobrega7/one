"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "@/contexts/app-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import { apiClient } from "@/lib/unified/api-client"
import { unifiedConfig, shouldUseCache } from "@/lib/unified/config"
import { type UnifiedAgent } from "@/lib/unified/dto/agent.dto"
import { syncService } from "@/lib/unified/sync-service"
// import { LIMITS } from "@/constants"

export type Agent = {
  id: string
  name: string
  description: string | null
  system_prompt: string | null
  model_id: string
  temperature: number
  user_id: string
  knowledge_base_id: string | null
  created_at: string
  updated_at: string
  external_id?: string
  sync_status?: 'synced' | 'pending' | 'error'
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAppContext()
  const supabase = getSupabaseClient()

  // Carregar agentes
  const loadAgents = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)

      // Try external API first if enabled
      if (unifiedConfig.USE_EXTERNAL_API) {
        const apiResponse = await apiClient.listAgents()
        if (apiResponse.success && apiResponse.data) {
          // Convert to local format and cache
          const localAgents = apiResponse.data.map((agent: any) => ({
            id: agent.id,
            name: agent.name,
            description: agent.description || null,
            system_prompt: agent.systemPrompt || null,
            model_id: 'gpt-4',
            temperature: 0.7,
            user_id: user.id,
            knowledge_base_id: null,
            created_at: agent.createdAt,
            updated_at: agent.updatedAt.toISOString(),
          }))
          
          setAgents(localAgents)
          
          // Cache in local DB if enabled
          if (shouldUseCache()) {
            // Update local cache asynchronously
            Promise.all(localAgents.map((agent: any) => 
              supabase!.from("agents").upsert(agent)
            )).catch(() => {})
          }
          
          return
        }
      }

      // Fall back to local database
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setAgents(data || [])
    } catch (err: any) {
      setError(err.message || "Erro ao carregar agentes")
    } finally {
      setLoading(false)
    }
  }

  // Carregar agentes quando o usuário mudar
  useEffect(() => {
    if (user?.id) {
      loadAgents()
    } else {
      setAgents([])
    }
  }, [user?.id])

  // Criar um novo agente
  const createAgent = async (agentData: Partial<Agent>) => {
    if (!user?.id) throw new Error("Usuário não autenticado")

    // Verificar limite de agentes
    if (agents.length >= LIMITS.MAX_AGENTS_FREE) {
      throw new Error(`Você atingiu o limite de ${LIMITS.MAX_AGENTS_FREE} agentes no plano gratuito`)
    }

    try {
      // Create locally first
      const { data: localAgent, error: localError } = await supabase
        .from("agents")
        .insert({
          ...agentData,
          user_id: user.id,
          sync_status: 'pending'
        })
        .select()
        .single()

      if (localError) throw localError

      // Update UI immediately
      setAgents((prev) => [localAgent, ...prev])

      // Try to sync with external API
      if (unifiedConfig.USE_EXTERNAL_API) {
        const unifiedAgent = AgentDataAdapter.fromSupabase(localAgent)
        const apiResponse = await apiClient.createAgent(unifiedAgent)
        
        if (apiResponse.success && apiResponse.data) {
          // Update local record with external ID
          await supabase
            .from("agents")
            .update({
              external_id: apiResponse.data.externalId,
              sync_status: 'synced',
              last_sync_at: new Date().toISOString()
            })
            .eq("id", localAgent.id)
            
          // Update UI
          setAgents((prev) => prev.map(agent => 
            agent.id === localAgent.id 
              ? { ...agent, external_id: apiResponse.data!.externalId, sync_status: 'synced' }
              : agent
          ))
        }
      }

      return localAgent
    } catch (err: any) {
      throw err
    }
  }

  // Atualizar um agente existente
  const updateAgent = async (id: string, agentData: Partial<Agent>) => {
    if (!user?.id) throw new Error("Usuário não autenticado")

    try {
      // Update locally first
      const { data: localAgent, error: localError } = await supabase
        .from("agents")
        .update({
          ...agentData,
          sync_status: 'pending'
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (localError) throw localError

      // Update UI immediately
      setAgents((prev) => prev.map((agent) => (agent.id === id ? localAgent : agent)))

      // Try to sync with external API
      if (unifiedConfig.USE_EXTERNAL_API && localAgent.external_id) {
        const unifiedAgent = AgentDataAdapter.fromSupabase(localAgent)
        const apiResponse = await apiClient.updateAgent(localAgent.external_id, unifiedAgent)
        
        if (apiResponse.success) {
          // Update sync status
          await supabase
            .from("agents")
            .update({
              sync_status: 'synced',
              last_sync_at: new Date().toISOString()
            })
            .eq("id", id)
            
          // Update UI
          setAgents((prev) => prev.map(agent => 
            agent.id === id ? { ...agent, sync_status: 'synced' } : agent
          ))
        }
      }

      return localAgent
    } catch (err: any) {
      throw err
    }
  }

  // Excluir um agente
  const deleteAgent = async (id: string) => {
    if (!user?.id) throw new Error("Usuário não autenticado")

    try {
      const agent = agents.find(a => a.id === id)
      
      // Delete from external API first if it exists there
      if (unifiedConfig.USE_EXTERNAL_API && agent?.external_id) {
        const apiResponse = await apiClient.deleteAgent(agent.external_id)
        if (!apiResponse.success) {
          // Failed to delete from external API - continue with local deletion
        }
      }

      // Delete locally
      const { error } = await supabase
        .from("agents")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      // Update UI
      setAgents((prev) => prev.filter((agent) => agent.id !== id))

      return true
    } catch (err: any) {
      throw err
    }
  }

  // Force sync all agents
  const syncAgents = async () => {
    if (!unifiedConfig.USE_EXTERNAL_API) return
    
    try {
      await syncService.syncAll()
      await loadAgents() // Reload to get updated sync status
    } catch (error) {
      // Error syncing agents
    }
  }

  return {
    agents,
    loading,
    error,
    loadAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    syncAgents,
  }
}