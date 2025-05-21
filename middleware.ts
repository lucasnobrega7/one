import { authMiddleware } from "@clerk/nextjs";

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
    console.error("Erro no middleware de autenticação:", err);
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
