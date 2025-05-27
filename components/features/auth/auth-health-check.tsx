"use client"

import { useState, useEffect } from "react"

export function AuthHealthCheck() {
  const { data: session, status } = // TODO: Replace with Supabase auth()
  const [apiHealth, setApiHealth] = useState<{ status: string; error?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkHealth() {
      try {
        // Check the debug session endpoint
        const res = await fetch("/api/debug-session")
        const data = await res.json()
        setApiHealth(data)
      } catch (error) {
        setApiHealth({
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkHealth()
  }, [])

  if (isLoading) {
    return <div className="p-4 bg-gray-100 rounded-md">Checking authentication health...</div>
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="font-bold mb-2">Auth Health Check</h3>
      <div className="mb-2">
        <strong>NextAuth Status:</strong> {status}
      </div>
      {session && (
        <div className="mb-2">
          <strong>User:</strong> {session.user?.email}
        </div>
      )}
      <div className="mb-2">
        <strong>API Health:</strong> {apiHealth?.status || "Unknown"}
      </div>
      {apiHealth?.error && (
        <div className="text-red-500">
          <strong>Error:</strong> {apiHealth.error}
        </div>
      )}
    </div>
  )
}
