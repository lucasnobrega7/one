// Tipos relacionados ao domínio de autenticação

export interface User {
  id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  organizationId: string | null
  role: string
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  userId: string
  organizationId?: string
  expiresAt: Date
}

export interface Permission {
  action: string
  subject: string
  conditions?: Record<string, any>
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
}
