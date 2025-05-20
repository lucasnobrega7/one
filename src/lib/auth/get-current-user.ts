import { auth } from "@clerk/nextjs/server"
import { supabaseClient } from "../supabase/client"

export async function getCurrentUser() {
  const { userId, orgId } = auth()

  if (!userId) {
    return null
  }

  // Get user from Supabase
  const { data, error } = await supabaseClient.from("users").select("*").eq("clerk_id", userId).single()

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
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}
