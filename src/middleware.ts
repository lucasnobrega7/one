import { authMiddleware } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Domínios da aplicação
const dashboardDomain = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dash.agentesdeconversao.com.br"
const loginDomain = process.env.NEXT_PUBLIC_LOGIN_URL || "https://login.agentesdeconversao.com.br"
const apiDomain = process.env.NEXT_PUBLIC_API_URL || "https://api.agentesdeconversao.com.br"
const docsDomain = process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.agentesdeconversao.com.br"

// Middleware para redirecionamento baseado no domínio
function domainMiddleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { pathname } = url
  const hostname = request.headers.get("host") || ""

  // Verificar se estamos no domínio de login
  if (hostname.includes("login.agentesdeconversao.com.br")) {
    // Se tentar acessar rotas protegidas no domínio de login, redireciona para o dashboard
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/agents") || pathname.startsWith("/datastores")) {
      return NextResponse.redirect(new URL(pathname, dashboardDomain))
    }
    return NextResponse.next()
  }

  // Verificar se estamos no domínio do dashboard
  if (hostname.includes("dash.agentesdeconversao.com.br")) {
    // Se tentar acessar rotas de autenticação no domínio do dashboard, redireciona para login
    if (pathname === "/sign-in" || pathname === "/sign-up") {
      return NextResponse.redirect(new URL(pathname, loginDomain))
    }
    return NextResponse.next()
  }

  // Verificar se estamos no domínio da API
  if (hostname.includes("api.agentesdeconversao.com.br")) {
    // Permitir apenas rotas de API
    if (!pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/api/docs", apiDomain))
    }
    return NextResponse.next()
  }

  // Verificar se estamos no domínio da documentação
  if (hostname.includes("docs.agentesdeconversao.com.br")) {
    // Permitir apenas rotas de documentação
    if (!pathname.startsWith("/docs")) {
      return NextResponse.redirect(new URL("/docs", docsDomain))
    }
    return NextResponse.next()
  }

  // Para outros domínios, comportamento padrão
  return NextResponse.next()
}

// Middleware de autenticação do Clerk
const clerkMiddleware = authMiddleware({
  // Rotas que podem ser acessadas sem autenticação
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/about",
    "/pricing",
    "/api/webhooks/clerk",
    "/api/public(.*)",
    "/docs(.*)",
  ],

  // Rotas que sempre podem ser acessadas e não têm informações de autenticação
  ignoredRoutes: ["/api/public(.*)", "/_next(.*)", "/favicon.ico", "/docs(.*)"],
})

// Middleware composto
export default function middleware(request: NextRequest) {
  // Primeiro aplicamos o middleware de domínio
  const domainResponse = domainMiddleware(request)

  // Se o middleware de domínio retornar uma resposta diferente de next(), retornamos essa resposta
  if (domainResponse.status !== 200) {
    return domainResponse
  }

  // Caso contrário, aplicamos o middleware de autenticação
  return clerkMiddleware(request)
}

export const config = {
  // Corresponde a todos os caminhos de requisição, exceto os que começam com:
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
