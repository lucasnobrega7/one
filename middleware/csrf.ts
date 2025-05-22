import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { nanoid } from "nanoid"

// CSRF protection middleware
export function csrfMiddleware(request: NextRequest) {
  // Skip for non-mutation methods
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return NextResponse.next()
  }

  // Skip for API routes that handle their own CSRF protection
  if (request.nextUrl.pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // Check CSRF token for mutation requests
  const csrfToken = request.headers.get("x-csrf-token")
  const csrfCookie = request.cookies.get("csrf-token")?.value

  if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie) {
    return new NextResponse(JSON.stringify({ error: "Invalid CSRF token" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  return NextResponse.next()
}

// Generate CSRF token for forms
export function generateCsrfToken(response: NextResponse): string {
  const token = nanoid(32)

  // Set CSRF token cookie (HTTP only, same-site)
  response.cookies.set("csrf-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  })

  return token
}
