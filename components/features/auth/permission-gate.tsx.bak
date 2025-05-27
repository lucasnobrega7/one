"use client"

import { useSession } from "next-auth/react"
import type { Permission } from "@/lib/auth/permissions"
import type { ReactNode } from "react"

interface PermissionGateProps {
  permission: Permission | Permission[]
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente que renderiza seu conteúdo apenas se o usuário tiver a permissão especificada
 */
export function PermissionGate({ permission, children, fallback }: PermissionGateProps) {
  const { data: session } = useSession()

  // Se não houver sessão, não renderizar nada
  if (!session) {
    return fallback || null
  }

  const userPermissions = session.user.permissions || []

  // Verificar se o usuário tem todas as permissões necessárias
  const hasPermission = Array.isArray(permission)
    ? permission.every((p) => userPermissions.includes(p))
    : userPermissions.includes(permission)

  if (!hasPermission) {
    return fallback || null
  }

  return <>{children}</>
}