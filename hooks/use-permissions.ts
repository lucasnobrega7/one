"use client"

import { useSession } from "next-auth/react"
import { hasPermission, getAllPermissions } from "@/lib/auth/permissions"
import type { Role, Permission } from "@/lib/auth/permissions"

export function usePermissions() {
  const { data: session } = useSession()
  
  const userRole = (session?.user as any)?.role as Role || 'viewer'
  const permissions = getAllPermissions(userRole)

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(userRole, permission)
  }

  const hasRole = (role: Role): boolean => {
    return userRole === role
  }

  const isAdmin = (): boolean => {
    return userRole === 'admin'
  }

  const isManager = (): boolean => {
    return userRole === 'manager' || userRole === 'admin'
  }

  return {
    role: userRole,
    permissions,
    hasPermission: checkPermission,
    hasRole,
    isAdmin,
    isManager,
    isAuthenticated: !!session,
  }
}
