"use client"

import type React from "react"

import { SupabaseSessionProvider } from "@/components/features/auth/supabase-session-provider"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [envError, setEnvError] = useState<string | null>(null)

  // Check environment variables on mount
  useEffect(() => {
    // Check for required environment variables (only client-side accessible vars)
    const requiredVars = [
      { name: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL },
      { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    ]

    const missingVars = requiredVars
      .filter(
        (v) =>
          !v.value ||
          v.value.includes("your-") ||
          v.value === "sua-chave-secreta-para-producao-7b36f6d1bc9e5a9b8d0e3a2f7c4b1a9e",
      )
      .map((v) => v.name)

    if (missingVars.length > 0) {
      setEnvError(`Missing or placeholder environment variables: ${missingVars.join(", ")}`)
    }

    // Check URL format
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && !supabaseUrl.startsWith("https://")) {
      setEnvError(`Invalid Supabase URL format: ${supabaseUrl}. URL must start with https://`)
    }
  }, [])

  return (
    <SupabaseSessionProvider>
      {envError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert variant="destructive">
            <AlertTitle>Environment Configuration Error</AlertTitle>
            <AlertDescription className="text-sm">
              {envError}
              <div className="mt-2">
                Please update your <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file with valid
                values.
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      {children}
    </SupabaseSessionProvider>
  )
}
