import { supabaseClient } from "../supabase/client"
import type { User } from "@clerk/nextjs/server"

export async function syncUserToSupabase(user: User) {
  try {
    // Verificar se o usuário já existe no Supabase
    const { data: existingUser, error: fetchError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Erro ao verificar usuário existente:", fetchError)
      return null
    }

    // Se o usuário não existir, crie-o
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
            organization_id: user.organizationMemberships?.[0]?.organization.id,
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

    // Se o usuário existir, atualize-o
    const { data: updatedUser, error: updateError } = await supabaseClient
      .from("users")
      .update({
        email: user.emailAddresses[0]?.emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
        avatar_url: user.imageUrl,
        organization_id: user.organizationMemberships?.[0]?.organization.id,
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
