import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Singleton instance
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (e) {
    throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`)
  }

  // Create the client
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseClient
}

// Helper function to safely get a Supabase client with error handling
export function safeGetSupabaseClient() {
  try {
    return { client: getSupabaseClient(), error: null }
  } catch (e) {
    console.error("Error getting Supabase client:", e)
    return { client: null, error: e instanceof Error ? e.message : String(e) }
  }
}
