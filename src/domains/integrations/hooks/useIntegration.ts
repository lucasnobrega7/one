"use client"

import { useState, useEffect } from "react"
import { integrationService } from "../services/integrationService"
import type { Integration } from "../types"

interface UseIntegrationProps {
  id?: string
}

interface UseIntegrationReturn {
  integration: Integration | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook para gerenciar o estado de uma integração específica
 */
export function useIntegration({ id }: UseIntegrationProps): UseIntegrationReturn {
  const [integration, setIntegration] = useState<Integration | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchIntegration = async () => {
    if (!id) {
      setIntegration(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await integrationService.getIntegrationById(id)
      setIntegration(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch integration"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIntegration()
  }, [id])

  return {
    integration,
    isLoading,
    error,
    refetch: fetchIntegration,
  }
}
