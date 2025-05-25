import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getRedisClient } from "@/lib/cache/redis"

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 // 1 minute (in seconds)
const MAX_REQUESTS = {
  default: 60, // 60 requests per minute for most routes
  auth: 10, // 10 login/signup attempts per minute
  api: 30, // 30 API requests per minute
}

/**
 * Rate limiting middleware
 */
export async function rateLimitMiddleware(request: NextRequest) {
  // Skip in development mode
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  // Get client IP
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const path = request.nextUrl.pathname

  // Determine rate limit based on path
  let limit = MAX_REQUESTS.default
  let identifier = `rate-limit:${ip}:default`

  if (path.startsWith("/api/")) {
    limit = MAX_REQUESTS.api
    identifier = `rate-limit:${ip}:api`
  } else if (path.includes("/auth/") || path.includes("/login") || path.includes("/signup")) {
    limit = MAX_REQUESTS.auth
    identifier = `rate-limit:${ip}:auth`
  }

  try {
    const redis = getRedisClient()

    // Get current count
    const currentCount = await redis.get(identifier)
    const count = currentCount ? Number.parseInt(currentCount, 10) : 0

    if (count >= limit) {
      return new NextResponse(JSON.stringify({ error: "Too many requests, please try again later" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": RATE_LIMIT_WINDOW.toString(),
        },
      })
    }

    // Increment count
    if (count === 0) {
      // First request in window, set with expiry
      await redis.set(identifier, "1", "EX", RATE_LIMIT_WINDOW)
    } else {
      // Increment existing count
      await redis.incr(identifier)
    }

    // Add rate limit headers to response
    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", limit.toString())
    response.headers.set("X-RateLimit-Remaining", (limit - count - 1).toString())

    return response
  } catch (error) {
    // If Redis fails, allow the request to proceed
    return NextResponse.next()
  }
}
