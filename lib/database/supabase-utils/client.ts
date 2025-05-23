import { createBrowserClient } from '@supabase/ssr'
import type { Database } from "@/types/supabase"

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Legacy support - kept for compatibility
export function getSupabaseClient() {
  return createClient()
}

// Helper function to safely get a Supabase client with error handling
export function safeGetSupabaseClient() {
  try {
    return { client: createClient(), error: null }
  } catch (e) {
    console.error("Error getting Supabase client:", e)
    return { client: null, error: e instanceof Error ? e.message : String(e) }
  }
}
