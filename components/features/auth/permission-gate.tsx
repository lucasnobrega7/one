"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"

type Permission = string

interface PermissionGateProps {
  permission: Permission | Permission[]
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente que renderiza seu conteúdo apenas se o usuário tiver a permissão especificada
 */
export function PermissionGate({ permission, children, fallback }: PermissionGateProps) {
  const { user } = useAuth()

  // Se não houver sessão, não renderizar nada
  if (!user) {
    return fallback || null
  }

  const userPermissions = (user as any).permissions || []

  // Verificar se o usuário tem todas as permissões necessárias
  const hasPermission = Array.isArray(permission)
    ? permission.every((p) => userPermissions.includes(p))
    : userPermissions.includes(permission)

  if (!hasPermission) {
    return fallback || null
  }

  return <>{children}</>
}