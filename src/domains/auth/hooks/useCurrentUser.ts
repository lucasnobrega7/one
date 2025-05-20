"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { supabaseClient } from "@/utils/supabase"
import type { User } from "../types"

/**
 * Hook para obter e gerenciar o usuário atual
 */
export function useCurrentUser() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUserFromSupabase = async () => {
      if (!clerkUser) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabaseClient.from("users").select("*").eq("clerk_id", clerkUser.id).single()

        if (error) {
          throw error
        }

        if (data) {
          setUser({
            id: data.id,
            clerkId: data.clerk_id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            organizationId: data.organization_id,
            role: data.role,
            avatarUrl: data.avatar_url,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro ao buscar usuário"))
        console.error("Erro ao buscar usuário do Supabase:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (isClerkLoaded) {
      fetchUserFromSupabase()
    }
  }, [clerkUser, isClerkLoaded])

  return {
    user,
    isLoading: !isClerkLoaded || isLoading,
    error,
  }
}
