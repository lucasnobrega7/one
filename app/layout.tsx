import type React from "react"
import { ThemeProvider } from "@/components/common/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { AuthProvider } from "@/components/auth-provider"
import { GlobalErrorHandler } from "@/components/error-handler-global"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Inter } from "next/font/google"
import Link from "next/link"
import { auth } from "@/config/auth"
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
      <body className="bg-white text-slate-900 min-h-screen font-sans antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              <GlobalErrorHandler>
                {/* Main Container - removing restrictive wrapper for OpenAI-style layout */}
                <div className="flex flex-col min-h-screen">
                  <main className="flex-1 relative">
                    {children}
                  </main>
                </div>
              </GlobalErrorHandler>

            {/* Enhanced Footer with OpenAI-style container */}
            <footer className="w-full border-t border-surface-stroke bg-surface-base mt-auto">
              <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  <div className="space-y-6 md:col-span-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-accent-start to-accent-mid rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">A</span>
                      </div>
                      <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-accent-start to-accent-mid bg-clip-text text-transparent">
                          Agentes de Conversão
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed">
                      Transforme suas conversas em conversões com agentes de IA personalizados e inteligentes
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="font-semibold text-white text-lg">Produto</h3>
                    <ul className="space-y-4 text-gray-400">
                      <li><Link href="/dashboard" className="hover:text-accent-start transition-colors duration-200 text-base">Dashboard</Link></li>
                      <li><Link href="/api/pricing" className="hover:text-accent-start transition-colors duration-200 text-base">Preços</Link></li>
                      <li><Link href="/docs/api-reference" className="hover:text-accent-start transition-colors duration-200 text-base">API</Link></li>
                    </ul>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="font-semibold text-white text-lg">Empresa</h3>
                    <ul className="space-y-4 text-gray-400">
                      <li><Link href="/about" className="hover:text-accent-start transition-colors duration-200 text-base">Sobre</Link></li>
                      <li><Link href="/research" className="hover:text-accent-start transition-colors duration-200 text-base">Pesquisa</Link></li>
                      <li><Link href="/safety" className="hover:text-accent-start transition-colors duration-200 text-base">Segurança</Link></li>
                    </ul>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="font-semibold text-white text-lg">Suporte</h3>
                    <ul className="space-y-4 text-gray-400">
                      <li><Link href="/docs" className="hover:text-accent-start transition-colors duration-200 text-base">Documentação</Link></li>
                      <li><Link href="/dashboard/help" className="hover:text-accent-start transition-colors duration-200 text-base">Ajuda</Link></li>
                      <li><Link href="/api/status" className="hover:text-accent-start transition-colors duration-200 text-base">Status</Link></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-surface-stroke mt-16 pt-12 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400 text-base">
                    © 2024 Agentes de Conversão. Todos os direitos reservados.
                  </p>
                  <div className="flex items-center space-x-6 mt-6 md:mt-0">
                    <p className="text-gray-400 text-base">
                      Powered by{" "}
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        className="font-semibold hover:text-accent-start transition-colors duration-200"
                        rel="noreferrer"
                      >
                        Supabase
                      </a>
                    </p>
                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    <p className="text-gray-400 text-base">
                      <a
                        href="https://openrouter.ai"
                        target="_blank"
                        className="font-semibold hover:text-accent-start transition-colors duration-200"
                        rel="noreferrer"
                      >
                        OpenRouter AI
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </footer>
              <Toaster />
              <SonnerToaster 
                theme="dark"
                position="top-right"
                richColors
                closeButton
              />
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
