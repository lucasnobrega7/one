"use client"

import { useCurrentUser } from "./useCurrentUser"
import { hasPermission } from "../services/authService"

/**
 * Hook para verificar permissões do usuário
 */
export function usePermissions() {
  const { user, isLoading } = useCurrentUser()

  const can = (action: string, subject: string): boolean => {
    if (isLoading || !user) return false
    return hasPermission(user, action, subject)
  }

  return {
    can,
    isAdmin: user?.role === "admin",
    isLoading,
  }
}
