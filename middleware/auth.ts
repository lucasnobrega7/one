import { auth } from "@/config/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = [
  '/',
  '/about',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth'
]

const adminRoutes = [
  '/admin',
  '/dashboard/settings',
  '/dashboard/users'
]

const protectedRoutes = [
  '/dashboard',
  '/agents',
  '/knowledge',
  '/analytics'
]

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for public routes, static files, and API routes
  if (
    publicRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const session = await auth()

  // Redirect to login if accessing protected route without session
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check admin access
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const userRole = (session?.user as any)?.role || 'viewer'
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/auth/access-denied', request.url))
    }
  }

  return NextResponse.next()
}