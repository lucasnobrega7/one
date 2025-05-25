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
    <Card>
      <CardHeader>
        <CardTitle>Status das APIs</CardTitle>
        <CardDescription>Verifique se todas as APIs estão funcionando corretamente</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <ErrorHandler message={error} retry={checkApis} />}

        <div className="space-y-4">
          {apiStatus.map((api) => (
            <div key={api.name} className="flex items-center justify-between p-2 border rounded-md">
              <div className="font-medium">{api.name}</div>
              <div className="flex items-center gap-2">
                {api.status === "checking" ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Verificando
                  </Badge>
                ) : api.status === "online" ? (
                  <Badge
                    variant="success"
                    className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {apiStatus.some((api) => api.status === "offline") && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
            <p className="font-medium">Algumas APIs estão offline</p>
            <ul className="list-disc list-inside mt-1">
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
        <Button onClick={checkApis} disabled={loading} className="flex items-center gap-1">
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
