"use client"

import type { Role } from "@/lib/auth/permissions"
import type { ReactNode } from "react"

interface RoleGateProps {
  role: Role | Role[]
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente que renderiza seu conteúdo apenas se o usuário tiver o role especificado
 */
export function RoleGate({ role, children, fallback }: RoleGateProps) {
  const { data: session } = // TODO: Replace with Supabase auth()

  // Se não houver sessão, não renderizar nada
  if (!session) {
    return fallback || null
  }

  const userRoles = session.user.roles || []

  // Verificar se o usuário tem pelo menos um dos roles necessários
  const hasRole = Array.isArray(role) ? role.some((r) => userRoles.includes(r)) : userRoles.includes(role)

  if (!hasRole) {
    return fallback || null
  }

  return <>{children}</>
}