"use client"

import { useState, useCallback } from "react"
import { useAuthToken } from "@/hooks/use-auth-token"
import { agentApiService } from "../services/agentApiService"
import type { AgentCreate, AgentUpdate } from "../types/agent.types"

export function useAgentsApi() {
  const { token, loading: tokenLoading } = useAuthToken()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAgents = useCallback(
    async (search?: string, visibility?: string) => {
      setLoading(true)
      setError(null)

      try {
        if (!token) throw new Error("Não autenticado")

        const agents = await agentApiService.getAgents(token, search, visibility)
        return agents
      } catch (err: any) {
        setError(err.message || "Erro ao obter agentes")
        return []
      } finally {
        setLoading(false)
      }
    },
    [token],
  )

  const getAgent = useCallback(
    async (agentId: string) => {
      setLoading(true)
      setError(null)

      try {
        if (!token) throw new Error("Não autenticado")

        return await agentApiService.getAgent(token, agentId)
      } catch (err: any) {
        setError(err.message || "Erro ao obter agente")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token],
  )

  const createAgent = useCallback(
    async (agent: AgentCreate) => {
      setLoading(true)
      setError(null)

      try {
        if (!token) throw new Error("Não autenticado")

        return await agentApiService.createAgent(token, agent)
      } catch (err: any) {
        setError(err.message || "Erro ao criar agente")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token],
  )

  const updateAgent = useCallback(
    async (agentId: string, agent: AgentUpdate) => {
      setLoading(true)
      setError(null)

      try {
        if (!token) throw new Error("Não autenticado")

        return await agentApiService.updateAgent(token, agentId, agent)
      } catch (err: any) {
        setError(err.message || "Erro ao atualizar agente")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token],
  )

  const deleteAgent = useCallback(
    async (agentId: string) => {
      setLoading(true)
      setError(null)

      try {
        if (!token) throw new Error("Não autenticado")

        await agentApiService.deleteAgent(token, agentId)
        return true
      } catch (err: any) {
        setError(err.message || "Erro ao excluir agente")
        return false
      } finally {
        setLoading(false)
      }
    },
    [token],
  )

  const queryAgent = useCallback(
    async (agentId: string, query: string, conversationId?: string, visitorId?: string) => {
      setLoading(true)
      setError(null)

      try {
        if (!token) throw new Error("Não autenticado")

        return await agentApiService.queryAgent(token, agentId, query, conversationId, visitorId)
      } catch (err: any) {
        setError(err.message || "Erro ao consultar agente")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token],
  )

  return {
    loading: loading || tokenLoading,
    error,
    getAgents,
    getAgent,
    createAgent,
    updateAgent,
    deleteAgent,
    queryAgent,
  }
}
