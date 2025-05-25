"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthCheckProps {
  children: React.ReactNode
  redirectTo?: string
  requiredRole?: string | string[]
}

export function AuthCheck({ children, redirectTo = "/login", requiredRole }: AuthCheckProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    // If authenticated but role check is required
    if (status === "authenticated" && requiredRole && session) {
      const userRoles = session.user.roles || []

      // Check if user has the required role(s)
      const hasRequiredRole = Array.isArray(requiredRole)
        ? requiredRole.some((role) => userRoles.includes(role as any))
        : userRoles.includes(requiredRole as any)

      if (!hasRequiredRole) {
        router.push("/auth/access-denied")
      }
    }
  }, [status, router, redirectTo, requiredRole, session])

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // If authenticated and either no role is required or user has the required role
  if (status === "authenticated") {
    if (!requiredRole) {
      return <>{children}</>
    }

    const userRoles = session?.user.roles || []
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.some((role) => userRoles.includes(role as any))
      : userRoles.includes(requiredRole as any)

    if (hasRequiredRole) {
      return <>{children}</>
    }

    // If we're still checking roles, show nothing
    return null
  }

  // If not authenticated, show nothing (redirect will happen in useEffect)
  return null
}
