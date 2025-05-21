import { authMiddleware } from "@clerk/nextjs";
// Using console error in middleware since it's outside the src directory
// and can't use the utility functions directly

const isPublicRoute = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/about",
  "/pricing",
  "/api/webhooks/clerk",
  "/api/public/(.*)",
  "/docs/(.*)",
];

const ignoredRoutes = ["/_next/(.*)", "/favicon.ico", "/static/(.*)"];

export default authMiddleware({
  publicRoutes: isPublicRoute,
  ignoredRoutes: ignoredRoutes,
  onError: (err, req) => {
    console.error("Middleware authentication error:", err);
    return new Response("Erro de autenticação", { status: 401 });
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
