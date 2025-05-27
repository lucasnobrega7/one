import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// 🚀 Next.js 15: Configuração otimizada de rotas
const publicRoutes = new Set([
  "/", "/login", "/signup", "/auth/login", "/auth/signup", 
  "/auth/callback", "/auth/error", "/auth/forgot-password",
  "/about", "/docs", "/research", "/safety", "/api/auth",
  "/api/health", "/api/status"
])

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

// ✅ Rate limiting
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

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || request.nextUrl.hostname
  const clientId = request.ip ?? 
    request.headers.get('x-forwarded-for') ?? 
    request.headers.get('x-real-ip') ?? 
    'unknown'

  // 🎯 Subdomain routing logic
  // If accessing /dashboard routes, redirect to dash subdomain
  if (pathname.startsWith('/dashboard') && !host.includes('dash.agentesdeconversao.ai')) {
    const dashboardUrl = new URL(pathname, 'https://dash.agentesdeconversao.ai')
    dashboardUrl.search = request.nextUrl.search
    return NextResponse.redirect(dashboardUrl)
  }

  // If accessing /login or /auth routes, redirect to login subdomain  
  if ((pathname.startsWith('/login') || pathname.startsWith('/auth')) && !host.includes('login.agentesdeconversao.ai')) {
    const loginUrl = new URL(pathname, 'https://login.agentesdeconversao.ai')
    loginUrl.search = request.nextUrl.search
    return NextResponse.redirect(loginUrl)
  }

  // If accessing /docs routes, redirect to docs subdomain
  if (pathname.startsWith('/docs') && !host.includes('docs.agentesdeconversao.ai')) {
    const docsUrl = new URL(pathname, 'https://docs.agentesdeconversao.ai')
    docsUrl.search = request.nextUrl.search
    return NextResponse.redirect(docsUrl)
  }
  
  // 🚨 CRITICAL: Block bypass attempts
  if (detectMiddlewareBypass(request)) {
    console.error(`🚨 Security Alert: Middleware bypass attempt from ${clientId}`)
    
    return new NextResponse(
      JSON.stringify({
        error: "Security Violation",
        message: "Request blocked for security reasons",
        code: "MIDDLEWARE_BYPASS_BLOCKED"
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Security-Event": "middleware-bypass-blocked"
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
          "Retry-After": "60"
        }
      }
    )
  }

  // ✅ Skip static assets
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

    if (!token?.sub) {
      if (isApiRoute) {
        return new NextResponse(
          JSON.stringify({
            error: "Unauthorized",
            message: "Authentication required"
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
        return NextResponse.redirect(new URL("/auth/access-denied", request.url))
      }
    }

    // ✅ Response with security headers
    const response = NextResponse.next()
    
    response.headers.set("x-user-id", token.sub)
    response.headers.set("x-user-email", token.email || "")
    response.headers.set("x-user-role", (token as any).role || "user")
    response.headers.set("x-content-type-options", "nosniff")
    response.headers.set("x-frame-options", "DENY")
    
    return response

  } catch (error) {
    console.error('Middleware error:', error)
    
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next()
    }
    
    return NextResponse.redirect(new URL("/auth/error", request.url))
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot|webp|avif)$).*)"
  ]
}