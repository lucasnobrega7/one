"use client"

import { useEffect } from "react"

export function DashboardRedirect() {
  useEffect(() => {
    // Immediate redirect to correct subdomain
    const currentHost = window.location.hostname
    if (!currentHost.includes('dash.agentesdeconversao.ai')) {
      const targetUrl = `https://dash.agentesdeconversao.ai${window.location.pathname}${window.location.search}`
      console.log(`Client-side redirect to: ${targetUrl}`)
      window.location.href = targetUrl
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para o dashboard...</p>
      </div>
    </div>
  )
}