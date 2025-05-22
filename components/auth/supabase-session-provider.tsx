"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)

  // We'll avoid creating the Supabase client if the URL is invalid
  // This way the app can still function with just NextAuth

  useEffect(() => {
    // Check if Supabase URL is valid
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    // Only show error if we're not in development mode with placeholder values
    if (supabaseUrl && (supabaseUrl === "your-supabase-url" || !supabaseUrl.startsWith("https://"))) {
      setError(`Invalid Supabase URL: ${supabaseUrl}. Please set a valid URL in your environment variables.`)
    }
  }, [])

  // If there's an error, show it but still render children
  // This allows the app to function with just NextAuth
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
