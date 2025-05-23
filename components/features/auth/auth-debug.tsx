"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

export default function AuthDebug() {
  const { data: session, status } = useSession()
  const [healthCheck, setHealthCheck] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkAuthHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/health")
      if (!res.ok) {
        throw new Error(`Health check failed: ${res.status} ${res.statusText}`)
      }
      const data = await res.json()
      setHealthCheck(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Auth Debug</h2>

      <div className="mb-4">
        <p>
          <strong>Status:</strong> {status}
        </p>
        {session && (
          <pre className="mt-2 max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs">
            {JSON.stringify(session, null, 2)}
          </pre>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={checkAuthHealth}
          disabled={loading}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Checking..." : "Check Auth Health"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {healthCheck && (
          <div className="mt-4">
            <h3 className="mb-2 font-medium">Health Check Results:</h3>
            <pre className="max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs">
              {JSON.stringify(healthCheck, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
