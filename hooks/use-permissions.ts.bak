// Sistema de permissões funcional
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type Permission = 
  | 'agents:create'
  | 'agents:delete'
  | 'agents:edit'
  | 'agents:view'
  | 'conversations:view'
  | 'conversations:delete'
  | 'analytics:view'
  | 'settings:edit'

interface UsePermissionsReturn {
  hasPermission: (permission: Permission) => boolean
  loading: boolean
  userRole: string | null
}

export function usePermissions(): UsePermissionsReturn {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      // Determinar role do usuário baseado no email ou metadata
      const email = session.user.email
      let role = 'user'

      if (email?.includes('admin') || email?.endsWith('@agentesdeconversao.com.br')) {
        role = 'admin'
      } else if (email?.includes('manager')) {
        role = 'manager'
      }

      setUserRole(role)
    }
    
    setLoading(false)
  }, [session, status])

  const hasPermission = (permission: Permission): boolean => {
    if (loading || !userRole) return false

    const rolePermissions: Record<string, Permission[]> = {
      admin: [
        'agents:create',
        'agents:delete', 
        'agents:edit',
        'agents:view',
        'conversations:view',
        'conversations:delete',
        'analytics:view',
        'settings:edit',
      ],
      manager: [
        'agents:create',
        'agents:edit',
        'agents:view',
        'conversations:view',
        'analytics:view',
      ],
      user: [
        'agents:view',
        'conversations:view',
      ],
    }

    return rolePermissions[userRole]?.includes(permission) || false
  }

  return {
    hasPermission,
    loading,
    userRole,
  }
}