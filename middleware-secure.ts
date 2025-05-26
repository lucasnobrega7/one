import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// ✅ Security: Comprehensive route definitions
const publicRoutes = [
  "/", 
  "/login", 
  "/signup", 
  "/auth/login",
  "/auth/signup", 
  "/auth/callback",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/access-denied",
  "/auth", 
  "/about", 
  "/docs", 
  "/example", 
  "/research", 
  "/safety", 
  "/notes",
  "/unauthorized",
  "/api/auth",
  "/api/health",
  "/api/status"
] as const

// ✅ Security: Routes that should completely skip middleware
const skipMiddlewareRoutes = [
  "/api/auth", 
  "/api/health", 
  "/api/status", 
  "/_next", 
  "/favicon.ico",
  "/public",
  "/.well-known"
] as const

// ✅ Security: Admin routes requiring elevated permissions
const adminRoutes = [
  "/admin",
  "/api/admin"
] as const

// ✅ Critical Security: Prevent CVE-2025-29927 middleware bypass
function isMiddlewareBypassAttempt(request: NextRequest): boolean {
  const suspiciousHeaders = [
    'x-middleware-subrequest',
    'x-middleware-invoke',
    'x-invoke-path',
    'x-invoke-query'
  ]
  
  return suspiciousHeaders.some(header => 
    request.headers.has(header) && 
    request.headers.get(header) !== null
  )
}

// ✅ Security: Rate limiting tracking (simple in-memory for demo)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const current = rateLimitMap.get(ip)
  
  if (!current || now - current.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return true
  }
  
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  current.count++
  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  
  // 🚨 Critical Security: Block middleware bypass attempts
  if (isMiddlewareBypassAttempt(request)) {
    console.error(`🚨 Middleware bypass attempt detected from IP: ${ip}, Path: ${pathname}`)
    return new NextResponse(
      JSON.stringify({ 
        error: "Forbidden", 
        message: "Invalid request headers detected",
        code: "MIDDLEWARE_BYPASS_ATTEMPT"
      }), 
      {
        status: 403,
        headers: { 
          "Content-Type": "application/json",
          "X-Security-Alert": "middleware-bypass-blocked"
        },
      }
    )
  }

  // ✅ Security: Rate limiting
  if (!checkRateLimit(ip)) {
    return new NextResponse(
      JSON.stringify({ 
        error: "Too Many Requests", 
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: 60
      }), 
      {
        status: 429,
        headers: { 
          "Content-Type": "application/json",
          "Retry-After": "60"
        },
      }
    )
  }

  // ✅ Security: Skip middleware for static assets and specific routes
  if (
    skipMiddlewareRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot|webp|avif)$/) ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image')
  ) {
    return NextResponse.next()
  }

  // ✅ Check if route is public
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // ✅ Check if route requires admin access
  const isAdminRoute = adminRoutes.some((route) => 
    pathname.startsWith(route)
  )

  if (isPublicRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  try {
    // ✅ Security: Enhanced token validation
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      // ✅ Security: Specify token age and secure settings
      maxAge: 24 * 60 * 60, // 24 hours
      secureCookie: process.env.NODE_ENV === 'production'
    })

    const isApiRoute = pathname.startsWith("/api/")

    // ✅ Authentication check
    if (!token || !token.sub) {
      if (isApiRoute) {
        return new NextResponse(
          JSON.stringify({ 
            error: "Unauthorized", 
            message: "Authentication required",
            code: "AUTH_REQUIRED"
          }), 
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      const url = new URL("/auth/login", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }

    // ✅ Authorization check for admin routes
    if (isAdminRoute) {
      const userRole = (token as any).role || 'user'
      if (!['admin', 'super_admin'].includes(userRole)) {
        if (isApiRoute) {
          return new NextResponse(
            JSON.stringify({ 
              error: "Forbidden", 
              message: "Insufficient permissions",
              code: "INSUFFICIENT_PERMISSIONS"
            }), 
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            }
          )
        }
        
        return NextResponse.redirect(new URL("/auth/access-denied", request.url))
      }
    }

    // ✅ Security: Add security headers to response
    const response = NextResponse.next()
    
    // Add user context headers for downstream use
    response.headers.set("x-user-id", token.sub)
    response.headers.set("x-user-email", token.email || "")
    response.headers.set("x-user-role", (token as any).role || "user")
    
    // Security headers
    response.headers.set("x-content-type-options", "nosniff")
    response.headers.set("x-frame-options", "DENY")
    response.headers.set("referrer-policy", "origin-when-cross-origin")
    
    return response

  } catch (error) {
    console.error('Middleware error:', error)
    
    // ✅ Security: Enhanced error handling
    if (process.env.NODE_ENV === "development") {
      console.warn('Development mode: Allowing request despite middleware error')
      return NextResponse.next()
    }
    
    // In production, redirect to login on error
    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Internal Server Error", 
          message: "Authentication service temporarily unavailable",
          code: "AUTH_SERVICE_ERROR"
        }), 
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }
    
    const url = new URL("/auth/error", request.url)
    return NextResponse.redirect(url)
  }
}

// ✅ Security: Comprehensive matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)",
  ],
}