"use client"

import { useAuth } from "@clerk/nextjs"
import { useState, useEffect, useCallback } from "react"

export function useAuthToken() {
  const { getToken } = useAuth()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchToken = useCallback(async () => {
    try {
      setLoading(true)
      const newToken = await getToken()
      setToken(newToken)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to get token"))
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  return { token, loading, error, refreshToken: fetchToken }
}
