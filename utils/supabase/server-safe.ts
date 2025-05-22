import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Safe server client that works in both server and client contexts
export function createClient() {
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

  // Use browser client for compatibility
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Function to get service role client (server-side only)
export function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables for service client")
  }

  return createBrowserClient<Database>(supabaseUrl, serviceRoleKey)
}