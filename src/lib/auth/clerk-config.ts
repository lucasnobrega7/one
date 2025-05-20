export const clerkConfig = {
  // URL base para redirecionamentos de autenticação
  baseUrl: process.env.NEXT_PUBLIC_CLERK_BASE_URL || "https://accounts.agentesdeconversao.com.br",

  // URL para onde redirecionar após o login
  afterSignInUrl: "/dashboard",

  // URL para onde redirecionar após o registro
  afterSignUpUrl: "/dashboard",

  // URL para onde redirecionar após o logout
  afterSignOutUrl: "/",

  // Rotas públicas que não requerem autenticação
  publicRoutes: ["/", "/sign-in", "/sign-up", "/about", "/pricing", "/api/webhooks/clerk"],
}
