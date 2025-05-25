"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { hasPermission } from "@/lib/auth/permissions"
import type { Role, Permission } from "@/lib/auth/permissions"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: Role
  requiredPermission?: Permission
  redirectTo?: string
  loading?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  redirectTo = "/auth/login",
  loading = <div>Loading...</div>
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push(redirectTo)
      return
    }

    const userRole = (session.user as any)?.role as Role || 'viewer'

    // Check role requirement
    if (requiredRole && userRole !== requiredRole) {
      router.push("/unauthorized")
      return
    }

    // Check permission requirement
    if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
      router.push("/unauthorized")
      return
    }
  }, [session, status, router, requiredRole, requiredPermission, redirectTo])

  if (status === "loading") {
    return loading as React.ReactElement
  }

  if (!session) {
    return null
  }

  const userRole = (session.user as any)?.role as Role || 'viewer'

  // Final checks before rendering
  if (requiredRole && userRole !== requiredRole) {
    return null
  }

  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return null
  }

  return <>{children}</>
}