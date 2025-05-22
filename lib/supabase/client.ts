import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  return supabaseClient
}

// Server-side Supabase client with service role
let supabaseAdminClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
    }

    supabaseAdminClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return supabaseAdminClient
}

// Helper functions for common database operations
export async function fetchUserById(userId: string) {
  const client = getSupabaseClient()
  return client.from("users").select("*").eq("id", userId).single()
}

export async function fetchUserSettings(userId: string) {
  const client = getSupabaseClient()
  return client.from("user_settings").select("*").eq("user_id", userId).single()
}

export async function updateUserSettings(
  userId: string,
  settings: Partial<Database["public"]["Tables"]["user_settings"]["Update"]>,
) {
  const client = getSupabaseClient()
  return client.from("user_settings").update(settings).eq("user_id", userId)
}

export async function fetchUserAgents(userId: string) {
  const client = getSupabaseClient()
  return client
    .from("agents")
    .select(`
      *,
      knowledge_bases (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
}

export async function fetchUserConversations(userId: string) {
  const client = getSupabaseClient()
  return client
    .from("conversations")
    .select(`
      *,
      agents (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
}

export async function fetchConversationMessages(conversationId: string) {
  const client = getSupabaseClient()
  return client
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
}

export async function createMessage(conversationId: string, content: string, role: "user" | "assistant") {
  const client = getSupabaseClient()
  return client.from("messages").insert({
    conversation_id: conversationId,
    content,
    role,
  })
}

export async function fetchUserRoles(userId: string) {
  const client = getSupabaseClient()
  return client.from("user_roles").select("role").eq("user_id", userId)
}

export async function updateUserRoles(userId: string, roles: string[]) {
  const admin = getSupabaseAdmin()

  // First delete existing roles
  await admin.from("user_roles").delete().eq("user_id", userId)

  // Then insert new roles
  if (roles.length > 0) {
    const rolesToInsert = roles.map((role) => ({
      user_id: userId,
      role,
    }))

    return admin.from("user_roles").insert(rolesToInsert)
  }

  return { data: null, error: null }
}
