a"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type ApiStatusType = {
  name: string
  status: "online" | "offline" | "checking"
  message?: string
}

export function ApiStatus() {
  const [statuses, setStatuses] = useState<ApiStatusType[]>([
    { name: "OpenAI", status: "checking" },
    { name: "Cohere", status: "checking" },
    { name: "Pinecone", status: "checking" },
    { name: "Neon Database", status: "checking" },
  ])
  const [isChecking, setIsChecking] = useState(false)

  const checkApiStatus = async () => {
    setIsChecking(true)

    try {
      const response = await fetch("/api/check-status")

      if (!response.ok) {
        throw new Error("Falha ao verificar status das APIs")
      }

      const data = await response.json()

      setStatuses([
        {
          name: "OpenAI",
          status: data.openai.status ? "online" : "offline",
          message: data.openai.message,
        },
        {
          name: "Cohere",
          status: data.cohere.status ? "online" : "offline",
          message: data.cohere.message,
        },
        {
          name: "Pinecone",
          status: data.pinecone.status ? "online" : "offline",
          message: data.pinecone.message,
        },
        {
          name: "Neon Database",
          status: data.neon.status ? "online" : "offline",
          message: data.neon.message,
        },
      ])
    } catch (error) {
      console.error("Erro ao verificar status das APIs:", error)

      setStatuses((prev) =>
        prev.map((status) => ({
          ...status,
          status: "offline",
          message: "Erro ao verificar status",
        })),
      )
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">Verifique o status das APIs utilizadas pelo assistente.</div>
        <Button variant="outline" size="sm" onClick={checkApiStatus} disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar novamente"
          )}
        </Button>
      </div>

      <div className="grid gap-3">
        {statuses.map((api) => (
          <Card key={api.name} className="overflow-hidden">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="font-medium">{api.name}</div>
              <div className="flex items-center gap-2">
                {api.status === "checking" ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Verificando</span>
                  </Badge>
                ) : api.status === "online" ? (
                  <Badge variant="success" className="flex items-center gap-1 bg-green-500">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Online</span>
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    <span>Offline</span>
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {statuses.some((api) => api.status === "offline") && (
        <div className="text-sm text-amber-500 mt-4">
          Algumas APIs estão offline. Isso pode afetar o funcionamento do assistente.
        </div>
      )}
    </div>
  )
}
