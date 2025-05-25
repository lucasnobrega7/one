import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from '@supabase/ssr'
import type { Database } from "@/types/supabase"

// Define public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/auth/forgot-password", "/auth/reset-password", "/auth/error", "/unauthorized", "/about", "/example", "/research", "/safety", "/notes"]

// Define routes that should be completely skipped by middleware
const skipMiddlewareRoutes = ["/api/auth", "/api/debug-session", "/api/health", "/_next", "/favicon.ico"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Skip middleware for NextAuth routes and static assets
  if (
    skipMiddlewareRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return response
  }

  // Create Supabase client for middleware
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (isPublicRoute) {
    return response
  }

  // Temporary: Allow all routes for troubleshooting
  if (process.env.NODE_ENV === "production") {
    return response
  }

  // Check if the path is an API route
  const isApiRoute = pathname.startsWith("/api/")

  try {
    // Get user from Supabase
    const { data: { user }, error } = await supabase.auth.getUser()

    // If not authenticated and trying to access protected route or API
    if (!user || error) {
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
  } catch (middlewareError) {
    console.error("Middleware error:", middlewareError)
    // In case of middleware error, allow the request to proceed
    return response
  }

  return response
}

// Configure the matcher for the middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
