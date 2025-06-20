import type React from "react"
import { ThemeProvider } from "@/components/common/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import SupabaseProvider from "@/components/supabase-provider"
import { GlobalErrorHandler } from "@/components/error-handler-global"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { ClaudeMemoryProvider } from "@/components/claude-memory-silent"
import { Inter } from "next/font/google"
import "./globals.css"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Agentes de Conversão - IA para seu negócio",
  description: "Transforme suas conversas em conversões com agentes de IA personalizados",
}

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
      <body className="bg-black text-white min-h-screen font-sans antialiased">
        <ErrorBoundary>
          <SupabaseProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              <ClaudeMemoryProvider>
                <GlobalErrorHandler>
                  {/* Main Container - removing restrictive wrapper for OpenAI-style layout */}
                  <div className="flex flex-col min-h-screen">
                    <main className="flex-1 relative">
                      {children}
                    </main>
                  </div>
                </GlobalErrorHandler>

                <Toaster />
                <SonnerToaster 
                  theme="dark"
                  position="top-right"
                  richColors
                  closeButton
                />
              </ClaudeMemoryProvider>
            </ThemeProvider>
          </SupabaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
