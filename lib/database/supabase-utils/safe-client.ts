import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Singleton pattern for client-side Supabase client
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function useSafeSupabaseClient() {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return { client: null, error: "Cannot use client-side Supabase in server components" }
  }

  // Validate Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check for missing or placeholder values
  if (!supabaseUrl || supabaseUrl === "your-supabase-url") {
    return {
      client: null,
      error: `Missing or invalid NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl || "undefined"}`,
    }
  }

  if (!supabaseAnonKey || supabaseAnonKey === "your-supabase-anon-key") {
    return {
      client: null,
      error: "Missing or invalid NEXT_PUBLIC_SUPABASE_ANON_KEY",
    }
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (e) {
    return {
      client: null,
      error: `Invalid Supabase URL format: ${supabaseUrl}`,
    }
  }

  // Create or return the singleton client
  try {
    if (!supabaseClient) {
      supabaseClient = createClientComponentClient<Database>()
    }
    return { client: supabaseClient, error: null }
  } catch (e) {
    return {
      client: null,
      error: `Error creating Supabase client: ${e instanceof Error ? e.message : String(e)}`,
    }
  }
}
