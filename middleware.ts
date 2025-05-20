import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define as rotas públicas que não precisam de autenticação
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/about",
  "/pricing",
  "/api/webhooks/clerk",
  "/api/public/(.*)",
  "/docs/(.*)",
])

// Define as rotas que devem ser ignoradas completamente
const ignoredRoutes = ["/_next/(.*)", "/favicon.ico", "/static/(.*)"]

export default clerkMiddleware(
  (auth, request) => {
    if (!isPublicRoute(request)) {
      auth().protect()
    }
  },
  { ignoredRoutes },
)

export const config = {
  matcher: [
    // Rotas que devem passar pelo middleware
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/",
  ],
}
