"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Shield, Settings } from "lucide-react"

export default function AuthDebug() {
  const { data: session, status } = // TODO: Replace with Supabase auth()
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
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Auth Debug Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Session Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Session Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={status === "authenticated" ? "default" : status === "loading" ? "secondary" : "destructive"}>
                  {status}
                </Badge>
              </div>

              {session && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Email:</span> {session.user?.email || "N/A"}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Name:</span> {session.user?.name || "N/A"}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Roles:</span> {session.user?.roles?.join(", ") || "N/A"}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Permissions:</span> {session.user?.permissions?.length || 0} total
                  </div>
                </div>
              )}

              {session && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">Full Session Data</summary>
                  <pre className="mt-2 max-h-40 overflow-auto rounded bg-muted p-2 text-xs">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Auth Health Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={checkAuthHealth}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Run Health Check"
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {healthCheck && (
                <div className="space-y-2">
                  <h3 className="font-medium">Health Check Results:</h3>
                  <pre className="max-h-40 overflow-auto rounded bg-muted p-2 text-xs">
                    {JSON.stringify(healthCheck, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div>
              <span className="font-medium">NODE_ENV:</span> {process.env.NODE_ENV}
            </div>
            <div>
              <span className="font-medium">Next.js Version:</span> {process.env.NEXT_PUBLIC_VERSION || "Unknown"}
            </div>
            <div>
              <span className="font-medium">Supabase URL:</span> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configured" : "❌ Not configured"}
            </div>
            <div>
              <span className="font-medium">NextAuth URL:</span> {process.env.NEXTAUTH_URL || "Not set"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}