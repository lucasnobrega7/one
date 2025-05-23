import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Safely create a server client with error handling
export async function createClient() {
  // Dynamic import to avoid SSR issues
  const { cookies } = await import("next/headers")
  const cookieStore = cookies()

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

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

// Maintain legacy function for compatibility
export function createServerSupabaseClient() {
  return createClient()
}

// Function to get client with service key (for administrative operations)
export async function getAdminClient() {
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables for admin client")
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (e) {
    throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`)
  }

  return createServerClient<Database>(supabaseUrl, serviceRoleKey, {
    cookies: {
      get: () => undefined,
      set: () => {},
      remove: () => {},
    },
  })
}
