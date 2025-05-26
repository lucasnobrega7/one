import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// 🚀 Next.js 15: Async Request APIs support
type RouteHandler = (request: NextRequest) => Promise<NextResponse>

// ✅ Public routes configuration
const publicRoutes = new Set([
  "/", "/login", "/signup", "/auth/login", "/auth/signup", 
  "/auth/callback", "/auth/error", "/auth/forgot-password",
  "/about", "/docs", "/research", "/safety", "/api/auth",
  "/api/health", "/api/status"
])

// ✅ Skip middleware routes
const skipRoutes = new Set([
  "/api/auth", "/api/health", "/api/status", 
  "/_next", "/favicon.ico", "/public", "/.well-known"
])

// 🚨 CVE-2025-29927 Protection
function detectMiddlewareBypass(request: NextRequest): boolean {
  const dangerousHeaders = [
    'x-middleware-subrequest',
    'x-middleware-invoke', 
    'x-invoke-path',
    'x-invoke-query',
    'x-middleware-override'
  ]
  
  return dangerousHeaders.some(header => 
    request.headers.has(header)
  )
}

// ✅ Rate limiting with Map
const rateLimitStore = new Map<string, {
  count: number
  resetTime: number
}>()

function checkRateLimit(clientId: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 100
  
  const current = rateLimitStore.get(clientId)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

// 🚀 Main middleware with Next.js 15 features
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const clientId = request.ip ?? 
    request.headers.get('x-forwarded-for') ?? 
    request.headers.get('x-real-ip') ?? 
    'unknown'
  
  // 🚨 CRITICAL: Block bypass attempts immediately
  if (detectMiddlewareBypass(request)) {
    console.error(`🚨 Security Alert: Middleware bypass attempt from ${clientId}`)
    
    return new NextResponse(
      JSON.stringify({
        error: "Security Violation",
        message: "Request blocked for security reasons",
        code: "MIDDLEWARE_BYPASS_BLOCKED",
        timestamp: new Date().toISOString()
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Security-Event": "middleware-bypass-blocked",
          "X-Request-ID": crypto.randomUUID()
        }
      }
    )
  }

  // ✅ Rate limiting
  if (!checkRateLimit(clientId)) {
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: "Rate limit exceeded",
        retryAfter: 60
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "0"
        }
      }
    )
  }

  // ✅ Skip static assets and specific routes
  if (
    skipRoutes.has(pathname) ||
    [...skipRoutes].some(route => pathname.startsWith(route)) ||
    /\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot|webp|avif)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // ✅ Public route check
  const isPublicRoute = publicRoutes.has(pathname) || 
    [...publicRoutes].some(route => pathname.startsWith(`${route}/`))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 🚀 Next.js 15: Enhanced authentication
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      maxAge: 24 * 60 * 60, // 24 hours
      secureCookie: process.env.NODE_ENV === 'production'
    })

    const isApiRoute = pathname.startsWith("/api/")

    // ✅ Authentication required
    if (!token?.sub) {
      if (isApiRoute) {
        return new NextResponse(
          JSON.stringify({
            error: "Unauthorized",
            message: "Authentication required",
            code: "AUTH_REQUIRED"
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" }
          }
        )
      }

      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(loginUrl)
    }

    // ✅ Admin authorization
    if (pathname.startsWith("/admin")) {
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
              headers: { "Content-Type": "application/json" }
            }
          )
        }
        
        return NextResponse.redirect(new URL("/auth/access-denied", request.url))
      }
    }

    // ✅ Create response with security headers
    const response = NextResponse.next()
    
    // User context headers
    response.headers.set("x-user-id", token.sub)
    response.headers.set("x-user-email", token.email || "")
    response.headers.set("x-user-role", (token as any).role || "user")
    
    // Security headers
    response.headers.set("x-content-type-options", "nosniff")
    response.headers.set("x-frame-options", "DENY")
    response.headers.set("x-request-id", crypto.randomUUID())
    
    return response

  } catch (error) {
    console.error('Middleware authentication error:', error)
    
    // Development mode fallback
    if (process.env.NODE_ENV === "development") {
      console.warn('🚧 Dev mode: Bypassing auth error')
      return NextResponse.next()
    }
    
    // Production error handling
    const errorUrl = new URL(
      pathname.startsWith("/api/") ? "/api/auth/error" : "/auth/error", 
      request.url
    )
    
    return NextResponse.redirect(errorUrl)
  }
}

// ✅ Optimized matcher for Next.js 15
export const config = {
  matcher: [
    /*
     * Matcher otimizado para Next.js 15
     * Exclui: api/auth, _next/static, _next/image, arquivos estáticos
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot|webp|avif)$).*)"
  ]
}