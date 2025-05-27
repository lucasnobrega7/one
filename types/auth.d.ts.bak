import type { Role, Permission } from "@/lib/auth/permissions"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      roles: Role[]
      permissions: Permission[]
    }
  }

  interface User {
    id: string
    name: string
    email: string
    image?: string
    roles: Role[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name?: string
    email?: string
    picture?: string
    roles: Role[]
  }
}
