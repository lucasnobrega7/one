import { auth } from "@clerk/nextjs/server"
import { supabaseClient } from "@/lib/supabase/client"
import type { User as ClerkUser } from "@clerk/nextjs/server"
import type { User } from "../types"

/**
 * Returns the currently authenticated user using Clerk and Supabase
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId, orgId } = auth()

  if (!userId) {
    return null
  }

  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single()

  if (error || !data) {
    console.error("Error fetching user from Supabase:", error)
    return null
  }

  return {
    id: data.id,
    clerkId: data.clerk_id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    organizationId: data.organization_id || orgId,
    role: data.role,
    avatarUrl: data.avatar_url,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

/**
 * Syncs a Clerk user to Supabase
 */
export async function syncUserToSupabase(user: ClerkUser) {
  try {
    const { data: existingUser, error: fetchError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Erro ao verificar usuário existente:", fetchError)
      return null
    }

    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabaseClient
        .from("users")
        .insert([
          {
            clerk_id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            first_name: user.firstName,
            last_name: user.lastName,
            avatar_url: user.imageUrl,
            organization_id:
              user.organizationMemberships?.[0]?.organization.id,
            role: "user",
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error("Erro ao criar usuário:", insertError)
        return null
      }

      return newUser
    }

    const { data: updatedUser, error: updateError } = await supabaseClient
      .from("users")
      .update({
        email: user.emailAddresses[0]?.emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
        avatar_url: user.imageUrl,
        organization_id:
          user.organizationMemberships?.[0]?.organization.id,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_id", user.id)
      .select()
      .single()

    if (updateError) {
      console.error("Erro ao atualizar usuário:", updateError)
      return null
    }

    return updatedUser
  } catch (error) {
    console.error("Erro ao sincronizar usuário:", error)
    return null
  }
}

/**
 * Basic permission check based on user role
 */
export function hasPermission(
  user: User | null,
  _action: string,
  _subject: string
): boolean {
  if (!user) return false
  return user.role === "admin"
}

export const authService = {
  getCurrentUser,
  syncUserToSupabase,
  hasPermission,
}