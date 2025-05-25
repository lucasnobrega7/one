"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Copy } from "lucide-react"

export default function ConfigCheckPage() {
  const [envVars, setEnvVars] = useState<
    { name: string; status: "ok" | "error" | "warning"; value: string; message?: string }[]
  >([])

  useEffect(() => {
    // Check environment variables
    const vars = [
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        value: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        validate: (v: string) => {
          if (!v) return { status: "error", message: "Missing value" }
          if (v === "your-supabase-url") return { status: "error", message: "Placeholder value detected" }
          try {
            new URL(v)
            if (!v.startsWith("https://")) return { status: "warning", message: "URL should start with https://" }
            return { status: "ok", message: "Valid URL" }
          } catch (e) {
            return { status: "error", message: "Invalid URL format" }
          }
        },
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        validate: (v: string) => {
          if (!v) return { status: "error", message: "Missing value" }
          if (v === "your-supabase-anon-key") return { status: "error", message: "Placeholder value detected" }
          return { status: "ok", message: "Value set" }
        },
      },
      {
        name: "NEXTAUTH_URL",
        value: process.env.NEXTAUTH_URL || "",
        validate: (v: string) => {
          if (!v) return { status: "error", message: "Missing value" }
          try {
            new URL(v)
            return { status: "ok", message: "Valid URL" }
          } catch (e) {
            return { status: "error", message: "Invalid URL format" }
          }
        },
      },
      {
        name: "NEXTAUTH_SECRET",
        value: process.env.NEXTAUTH_SECRET || "",
        validate: (v: string) => {
          if (!v) return { status: "error", message: "Missing value" }
          if (v === "your-nextauth-secret-at-least-32-chars-long")
            return { status: "error", message: "Placeholder value detected" }
          if (v.length < 32) return { status: "warning", message: "Secret should be at least 32 characters" }
          return { status: "ok", message: "Valid secret" }
        },
      },
    ]

    const results = vars.map((v) => {
      const result = v.validate(v.value)
      return {
        name: v.name,
        value: v.value,
        status: result.status as "ok" | "error" | "warning",
        message: result.message,
      }
    })

    setEnvVars(results)
  }, [])

  const copyEnvTemplate = () => {
    const template = `# Autenticação NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generate-a-secure-random-string-at-least-32-chars

# Configurações do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase-dashboard
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-dashboard

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret`

    navigator.clipboard
      .writeText(template)
      .then(() => alert("Template copied to clipboard!"))
      .catch((err) => alert("Failed to copy template to clipboard"))
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Environment Configuration Check</CardTitle>
          <CardDescription>Verify your environment variables are correctly configured</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {envVars.map((v) => (
              <Alert
                key={v.name}
                variant={v.status === "error" ? "destructive" : v.status === "warning" ? "default" : "default"}
              >
                {v.status === "ok" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className={`h-4 w-4 ${v.status === "warning" ? "text-yellow-500" : ""}`} />
                )}
                <AlertTitle>{v.name}</AlertTitle>
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{v.message}</p>
                      <p className="text-xs mt-1 font-mono">
                        {v.value ? (
                          v.name.includes("KEY") || v.name.includes("SECRET") ? (
                            `${v.value.substring(0, 8)}...`
                          ) : (
                            v.value
                          )
                        ) : (
                          <span className="text-muted-foreground italic">Not set</span>
                        )}
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="text-sm font-medium mb-2">How to fix configuration issues:</h3>
            <ol className="list-decimal pl-5 text-sm space-y-2">
              <li>
                Create a <code className="bg-background px-1 py-0.5 rounded">.env.local</code> file in your project root
              </li>
              <li>Add the required environment variables with proper values</li>
              <li>Restart your development server</li>
              <li>For production, add these variables to your hosting platform</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={copyEnvTemplate} className="w-full">
            <Copy className="mr-2 h-4 w-4" />
            Copy Environment Template
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
