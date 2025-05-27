import { auth } from "@/config/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/auth/forgot-password", "/auth/reset-password", "/auth/error"]

// Define routes that should be completely skipped by middleware
const skipMiddlewareRoutes = ["/api/auth", "/api/debug-session", "/api/health", "/_next", "/favicon.ico"]

export async function middleware(request: NextRequest) {
  // 🚨 PROTEÇÃO CONTRA CVE-2025-29927: Bloquear header x-middleware-subrequest
  if (request.headers.get('x-middleware-subrequest')) {
    console.error('[SECURITY ALERT] Blocked x-middleware-subrequest attack attempt from:', request.ip);
    return new NextResponse('Forbidden - Security Policy Violation', { 
      status: 403,
      headers: {
        'X-Security-Block': 'CVE-2025-29927-Protection',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    });
  }

  const { pathname } = request.nextUrl

  // Skip middleware for NextAuth routes and static assets
  if (
    skipMiddlewareRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get session using NextAuth
  const session = await auth()

  // Check if the path is an API route
  const isApiRoute = pathname.startsWith("/api/")

  // If not authenticated and trying to access protected route or API
  if (!session?.user) {
    // For API routes, return 401 Unauthorized
    if (isApiRoute) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // For other routes, redirect to login
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Adicionar headers de segurança para todas as respostas autenticadas
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

// Configure the matcher for the middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
