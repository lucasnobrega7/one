"use client"

import { useState, useEffect } from "react"
import type { Agent } from "../types"
import { agentService } from "../services/agentService"

interface UseAgentProps {
  id?: string
}

interface UseAgentReturn {
  agent: Agent | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook para gerenciar o estado de um agente específico
 */
export function useAgent({ id }: UseAgentProps): UseAgentReturn {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAgent = async () => {
    if (!id) {
      setAgent(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await agentService.getAgentById(id)
      setAgent(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch agent"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAgent()
  }, [id])

  return {
    agent,
    isLoading,
    error,
    refetch: fetchAgent,
  }
}
