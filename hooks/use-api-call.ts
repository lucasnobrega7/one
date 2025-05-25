// Hook para estados de loading consistentes
import { useState, useCallback } from 'react'
import { apiClient, ApiResponse } from '@/lib/api/client'
import { toast } from 'sonner'

interface UseApiCallState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiCallReturn<T> extends UseApiCallState<T> {
  execute: (endpoint: string, options?: { method?: string; data?: any }) => Promise<T | null>
  reset: () => void
}

export function useApiCall<T = any>(): UseApiCallReturn<T> {
  const [state, setState] = useState<UseApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (
    endpoint: string,
    options: { method?: string; data?: any } = {}
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      let response: ApiResponse<T>
      
      switch (options.method?.toUpperCase()) {
        case 'POST':
          response = await apiClient.post<T>(endpoint, options.data)
          break
        case 'PUT':
          response = await apiClient.put<T>(endpoint, options.data)
          break
        case 'DELETE':
          response = await apiClient.delete<T>(endpoint)
          break
        default:
          response = await apiClient.get<T>(endpoint)
      }

      if (response.success) {
        setState(prev => ({ ...prev, data: response.data, loading: false }))
        return response.data
      } else {
        const errorMessage = response.error || response.message || 'Erro desconhecido'
        setState(prev => ({ ...prev, error: errorMessage, loading: false }))
        toast.error(errorMessage)
        return null
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na requisição'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      toast.error(errorMessage)
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}