import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { validateCSRFMiddleware } from "@/lib/security/csrf"

// Define public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/auth/forgot-password", "/auth/reset-password", "/auth/error"]

// Define routes that should be completely skipped by middleware
const skipMiddlewareRoutes = ["/api/auth", "/api/debug-session", "/api/health", "/_next", "/favicon.ico"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for NextAuth routes and static assets
  if (
    skipMiddlewareRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Validate CSRF token for mutation requests
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const valid = await validateCSRFMiddleware(request)
    if (!valid) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid CSRF token" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      )
    }
  }

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if the path is an API route
  const isApiRoute = pathname.startsWith("/api/")

  // Verify authentication token
  let token
  try {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
  } catch (error) {
    console.error("Error getting token in middleware:", error)

    // For API routes, return 401 Unauthorized
    if (isApiRoute) {
      return new NextResponse(JSON.stringify({ error: "Authentication error" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // For other routes, redirect to login with error
    const url = new URL("/login", request.url)
    url.searchParams.set("error", "AuthenticationError")
    return NextResponse.redirect(url)
  }

  // If not authenticated and trying to access protected route or API
  if (!token) {
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

  return NextResponse.next()
}

// Configure the matcher for the middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
