"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { ErrorHandler } from "@/components/error-handler"

interface ApiStatus {
  name: string
  status: "checking" | "online" | "offline"
  error?: string
}

export function ApiChecker() {
  const [apiStatus, setApiStatus] = useState<ApiStatus[]>([
    { name: "OpenAI", status: "checking" },
    { name: "Cohere", status: "checking" },
    { name: "Pinecone", status: "checking" },
    { name: "Neon Database", status: "checking" },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkApis = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/check-status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao verificar status das APIs")
      }

      const data = await response.json()

      setApiStatus([
        {
          name: "OpenAI",
          status: data.openai.status ? "online" : "offline",
          error: data.openai.error,
        },
        {
          name: "Cohere",
          status: data.cohere.status ? "online" : "offline",
          error: data.cohere.error,
        },
        {
          name: "Pinecone",
          status: data.pinecone.status ? "online" : "offline",
          error: data.pinecone.error,
        },
        {
          name: "Neon Database",
          status: data.neon.status ? "online" : "offline",
          error: data.neon.error,
        },
      ])
    } catch (err: any) {
      setError(err.message || "Erro ao verificar status das APIs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkApis()
  }, [])

  return (
    <Card className="bg-[#1a1a1d] border-[#27272a]">
      <CardHeader>
        <CardTitle className="text-white">Status das APIs</CardTitle>
        <CardDescription className="text-white/70">Verifique se todas as APIs estão funcionando corretamente</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <ErrorHandler message={error} retry={checkApis} />}

        <div className="space-y-4">
          {apiStatus.map((api) => (
            <div key={api.name} className="flex items-center justify-between p-2 border border-[#27272a] rounded-md bg-[#0e0e10]/50">
              <div className="font-medium text-white">{api.name}</div>
              <div className="flex items-center gap-2">
                {api.status === "checking" ? (
                  <Badge variant="outline" className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Verificando
                  </Badge>
                ) : api.status === "online" ? (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1 bg-red-500/20 text-red-400 border-red-500/30">
                    <XCircle className="h-3 w-3" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {apiStatus.some((api) => api.status === "offline") && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-400 text-sm">
            <p className="font-medium text-amber-300">Algumas APIs estão offline</p>
            <ul className="list-disc list-inside mt-1 text-amber-400/80">
              {apiStatus
                .filter((api) => api.status === "offline")
                .map((api) => (
                  <li key={`error-${api.name}`}>
                    {api.name}: {api.error || "Não foi possível conectar"}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkApis} 
          disabled={loading} 
          className="flex items-center gap-1 bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] hover:from-[#46B2E0]/80 hover:to-[#8A53D2]/80 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Verificar novamente
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
