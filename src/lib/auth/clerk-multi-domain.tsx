"use client"

import type React from "react"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

/**
 * Configuração do Clerk para múltiplos domínios
 */
export const clerkConfig = {
  // URLs principais
  dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dash.agentesdeconversao.com.br",
  loginUrl: process.env.NEXT_PUBLIC_LOGIN_URL || "https://login.agentesdeconversao.com.br",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.agentesdeconversao.com.br",
  docsUrl: process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.agentesdeconversao.com.br",

  // Rotas de autenticação
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignInUrl: "/dashboard",
  afterSignUpUrl: "/onboarding",
}

/**
 * Provider do Clerk com suporte a múltiplos domínios
 */
export function MultiDomainClerkProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDarkMode ? dark : undefined,
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/90",
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={`${clerkConfig.loginUrl}${clerkConfig.signInUrl}`}
      signUpUrl={`${clerkConfig.loginUrl}${clerkConfig.signUpUrl}`}
      afterSignInUrl={`${clerkConfig.dashboardUrl}${clerkConfig.afterSignInUrl}`}
      afterSignUpUrl={`${clerkConfig.dashboardUrl}${clerkConfig.afterSignUpUrl}`}
    >
      {children}
    </ClerkProvider>
  )
}
