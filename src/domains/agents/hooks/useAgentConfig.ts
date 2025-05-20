"use client"

import { useState, useEffect } from "react"
import { agentService } from "../services/agentService"
import type { Agent, UpdateAgentParams } from "../types/agent.types"

/**
 * Hook para gerenciar a configuração de um agente
 */
export function useAgentConfig(agentId: string) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadAgent() {
      try {
        setIsLoading(true)
        const data = await agentService.getAgentById(agentId)
        setAgent(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load agent"))
      } finally {
        setIsLoading(false)
      }
    }

    if (agentId) {
      loadAgent()
    }
  }, [agentId])

  const updateAgent = async (params: Omit<UpdateAgentParams, "id">) => {
    try {
      setIsLoading(true)
      const updatedAgent = await agentService.updateAgent({
        id: agentId,
        ...params,
      })
      setAgent(updatedAgent)
      return updatedAgent
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update agent"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    agent,
    isLoading,
    error,
    updateAgent,
  }
}
