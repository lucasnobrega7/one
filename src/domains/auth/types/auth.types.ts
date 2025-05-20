export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
  organizationId: string
  role: UserRole
}

export type UserRole = "admin" | "member" | "guest"

export interface Organization {
  id: string
  name: string
  slug: string
  logoUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Permission {
  action: string
  subject: string
  conditions?: Record<string, any>
}

export interface Session {
  userId: string
  organizationId: string
  expiresAt: Date
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  organization: Organization | null
}
