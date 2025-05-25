"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type ApiStatus = {
  name: string
  status: "online" | "offline" | "unknown"
  lastChecked: string
}

export default function ApiStatus() {
  const [statuses, setStatuses] = useState<ApiStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()

        const apiStatuses = data.variables.map((v: any) => ({
          name: v.name,
          status: v.status === "success" ? "online" : "offline",
          lastChecked: new Date().toLocaleTimeString(),
        }))

        setStatuses(apiStatuses)
      } catch (error) {
        // Error checking API status
      } finally {
        setLoading(false)
      }
    }

    checkApiStatus()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Status das APIs</CardTitle>
        <CardDescription>Status atual das conexões com APIs externas</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            {statuses.map((api) => (
              <div key={api.name} className="flex items-center justify-between py-1">
                <span className="text-sm font-medium">{api.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={api.status === "online" ? "default" : "destructive"}>
                    {api.status === "online" ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground mt-4">
              Última verificação: {statuses[0]?.lastChecked || "N/A"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
