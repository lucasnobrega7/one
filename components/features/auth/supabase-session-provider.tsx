"use client"

import type React from "react"
import { useSupabase } from "@/components/supabase-provider"
import { useEffect, useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Supabase URL is valid
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    // Only show error if we're not in development mode with placeholder values
    if (supabaseUrl && (supabaseUrl === "your-supabase-url" || !supabaseUrl.startsWith("https://"))) {
      setError(`Invalid Supabase URL: ${supabaseUrl}. Please set a valid URL in your environment variables.`)
    }
  }, [])

  // If there's an error, show it but still render children
  return (
    <>
      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <Alert variant="destructive">
            <AlertTitle>Supabase Configuration Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      {children}
    </>
  )
}
