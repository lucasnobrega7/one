import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define public routes that don't require authentication
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
  "/api/auth"
]

// Define routes that should be completely skipped by middleware
const skipMiddlewareRoutes = [
  "/api/auth", 
  "/api/health", 
  "/api/status", 
  "/_next", 
  "/favicon.ico",
  "/public"
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static assets and NextAuth routes
  if (
    skipMiddlewareRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  try {
    // Get NextAuth token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    // Check if the path is an API route
    const isApiRoute = pathname.startsWith("/api/")

    // If not authenticated and trying to access protected route
    if (!token) {
      // For API routes, return 401 Unauthorized
      if (isApiRoute) {
        return new NextResponse(
          JSON.stringify({ 
            error: "Unauthorized", 
            message: "Authentication required" 
          }), 
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      // For pages, redirect to login with callback URL
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }

    // Add user info to headers for downstream use
    const response = NextResponse.next()
    response.headers.set("x-user-id", token.sub || "")
    response.headers.set("x-user-email", token.email || "")
    response.headers.set("x-user-role", (token as any).role || "viewer")
    
    return response

  } catch (error) {
    // In development, allow all requests on error
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next()
    }
    
    // In production, redirect to login on error
    const url = new URL("/login", request.url)
    return NextResponse.redirect(url)
  }
}

// Configure the matcher for the middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
