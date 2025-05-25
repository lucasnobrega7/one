"use client"

import { useSession } from "next-auth/react"
import { hasPermission } from "@/lib/auth/permissions"
import type { Role, Permission } from "@/lib/auth/permissions"

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole?: Role
  requiredPermission?: Permission
  fallback?: React.ReactNode
}

export function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback = null
}: RoleGuardProps) {
  const { data: session } = useSession()
  
  if (!session) return fallback

  const userRole = (session.user as any)?.role as Role || 'viewer'

  // Check role requirement
  if (requiredRole && userRole !== requiredRole) {
    return fallback as React.ReactElement
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return fallback as React.ReactElement
  }

  return <>{children}</>
}