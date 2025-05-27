"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthCheckProps {
  children: React.ReactNode
  redirectTo?: string
  requiredRole?: string | string[]
}

export function AuthCheck({ children, redirectTo = "/auth/login", requiredRole }: AuthCheckProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
    
    // TODO: Add role-based access control here
    // if (requiredRole && user) {
    //   // Check if user has required role
    // }
  }, [user, loading, router, redirectTo, requiredRole])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!user) {
    return null
  }

  return <>{children}</>
}