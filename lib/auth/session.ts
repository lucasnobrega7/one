import { auth } from "@/config/auth"
import { redirect } from "next/navigation"
import type { Role } from "./permissions"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }
  return session.user
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth()
  const userRole = (user as any)?.role as Role || 'viewer'
  
  if (!allowedRoles.includes(userRole)) {
    redirect("/auth/access-denied")
  }
  
  return { user, role: userRole }
}

export async function getSession() {
  return await auth()
}