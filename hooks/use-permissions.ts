"use client"

import { useSession } from "next-auth/react"
import { type Permission, Role } from "@/lib/auth/permissions"

export function usePermissions() {
  const { data: session } = useSession()

  const userPermissions = session?.user?.permissions || []
  const userRoles = session?.user?.roles || []

  const hasPermission = (permission: Permission | Permission[]): boolean => {
    if (!session) return false

    if (Array.isArray(permission)) {
      return permission.every((p) => userPermissions.includes(p))
    }

    return userPermissions.includes(permission)
  }

  const hasRole = (role: Role | Role[]): boolean => {
    if (!session) return false

    if (Array.isArray(role)) {
      return role.some((r) => userRoles.includes(r))
    }

    return userRoles.includes(role)
  }

  const isAdmin = (): boolean => {
    return hasRole(Role.Admin)
  }

  return {
    permissions: userPermissions,
    roles: userRoles,
    hasPermission,
    hasRole,
    isAdmin,
  }
}
