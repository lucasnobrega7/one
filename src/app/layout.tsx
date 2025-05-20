import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AnalyticsProvider } from "@/components/providers/analytics-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata = {
  title: "Agentes de Conversão",
  description: "Plataforma de criação e gerenciamento de agentes de conversação",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Carregando...</div>}>
          <ClerkProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <AnalyticsProvider>{children}</AnalyticsProvider>
            </ThemeProvider>
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  )
}
