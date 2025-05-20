"use client"

import { useUser, useOrganization } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import type { User, Organization, AuthState } from "../types/auth.types"

/**
 * Hook para gerenciar o estado de autenticação
 */
export function useAuth(): AuthState {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser()
  const { organization: clerkOrg, isLoaded: isOrgLoaded } = useOrganization()

  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isUserLoaded && isOrgLoaded) {
      if (clerkUser) {
        // Transformar dados do Clerk para o formato interno
        setUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          firstName: clerkUser.firstName || undefined,
          lastName: clerkUser.lastName || undefined,
          avatarUrl: clerkUser.imageUrl || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          organizationId: clerkOrg?.id || "",
          role: "member", // Valor padrão, idealmente seria obtido do backend
        })
      } else {
        setUser(null)
      }

      if (clerkOrg) {
        setOrganization({
          id: clerkOrg.id,
          name: clerkOrg.name || "",
          slug: clerkOrg.slug || "",
          logoUrl: clerkOrg.imageUrl || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      } else {
        setOrganization(null)
      }

      setIsLoading(false)
    }
  }, [clerkUser, clerkOrg, isUserLoaded, isOrgLoaded])

  return {
    isAuthenticated: !!user,
    isLoading,
    user,
    organization,
  }
}
