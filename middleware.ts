import { authMiddleware } from "@clerk/nextjs";
import { logError } from "@/utils/error-logging";

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
    logError(err, { location: "middleware" });
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
