"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { Permission } from "@/lib/auth/permissions"

interface ProtectedRouteProps {
  children: React.ReactNode
  permission?: Permission | Permission[]
  redirectTo?: string
}

/**
 * Componente que protege uma rota, redirecionando para login se não autenticado
 * ou para acesso negado se não tiver permissão
 */
export function ProtectedRoute({ children, permission, redirectTo = "/auth/login" }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Se ainda estiver carregando, não fazer nada
    if (status === "loading") return

    // Se não estiver autenticado, redirecionar para login
    if (!session) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    // Se precisar verificar permissão
    if (permission) {
      const userPermissions = session.user.permissions || []

      // Verificar se o usuário tem todas as permissões necessárias
      const hasPermission = Array.isArray(permission)
        ? permission.every((p) => userPermissions.includes(p))
        : userPermissions.includes(permission)

      if (!hasPermission) {
        router.push("/auth/access-denied")
      }
    }
  }, [session, status, router, permission, redirectTo])

  // Mostrar indicador de carregamento enquanto verifica autenticação
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Se não estiver autenticado ou não tiver permissão, não renderizar nada
  // (o redirecionamento será feito pelo useEffect)
  if (!session) {
    return null
  }

  // Se precisar verificar permissão
  if (permission) {
    const userPermissions = session.user.permissions || []

    // Verificar se o usuário tem todas as permissões necessárias
    const hasPermission = Array.isArray(permission)
      ? permission.every((p) => userPermissions.includes(p))
      : userPermissions.includes(permission)

    if (!hasPermission) {
      return null
    }
  }

  return <>{children}</>
}
