import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// 🚀 Simplified Middleware with Supabase Auth
const publicRoutes = new Set([
  "/", "/login", "/signup", "/auth/login", "/auth/signup", 
  "/auth/callback", "/auth/error", "/auth/forgot-password",
  "/about", "/docs", "/research", "/safety", "/api/health", 
  "/api/status", "/fix-domain"
])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ Skip static assets and API auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return await updateSession(request)
  }

  // ✅ Public routes - no auth required
  if (publicRoutes.has(pathname)) {
    return await updateSession(request)
  }

  // ✅ Update Supabase session for all other routes
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}