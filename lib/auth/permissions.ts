export type Role = 'admin' | 'manager' | 'user' | 'viewer'

export type Permission = 
  | 'agents:create'
  | 'agents:read' 
  | 'agents:update'
  | 'agents:delete'
  | 'analytics:read'
  | 'analytics:export'
  | 'knowledge:upload'
  | 'knowledge:read'
  | 'knowledge:delete'
  | 'users:manage'
  | 'billing:read'
  | 'billing:manage'
  | 'settings:read'
  | 'settings:write'
  | 'integrations:manage'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'agents:create',
    'agents:read',
    'agents:update', 
    'agents:delete',
    'analytics:read',
    'analytics:export',
    'knowledge:upload',
    'knowledge:read',
    'knowledge:delete',
    'users:manage',
    'billing:read',
    'billing:manage',
    'settings:read',
    'settings:write',
    'integrations:manage'
  ],
  manager: [
    'agents:create',
    'agents:read',
    'agents:update',
    'analytics:read',
    'analytics:export',
    'knowledge:upload',
    'knowledge:read',
    'knowledge:delete',
    'billing:read',
    'settings:read',
    'integrations:manage'
  ],
  user: [
    'agents:create',
    'agents:read',
    'agents:update',
    'analytics:read',
    'knowledge:upload',
    'knowledge:read',
    'settings:read'
  ],
  viewer: [
    'agents:read',
    'analytics:read',
    'knowledge:read'
  ]
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

export function getAllPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}