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
    <html lang="pt-BR" className={`${inter.className} dark`} suppressHydrationWarning>
      <body className="bg-black text-white min-h-screen">
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              <GlobalErrorHandler>
                <main className="flex-1">
                  {children}
                </main>
              </GlobalErrorHandler>

            <footer className="border-t border-gray-800 bg-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
                      <span className="text-xl font-semibold">Agentes de Conversão</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Transforme suas conversas em conversões com IA
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Produto</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><Link href="#" className="hover:text-white transition-colors">Recursos</Link></li>
                      <li><Link href="#" className="hover:text-white transition-colors">Preços</Link></li>
                      <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Empresa</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><Link href="#" className="hover:text-white transition-colors">Sobre</Link></li>
                      <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                      <li><Link href="#" className="hover:text-white transition-colors">Contato</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Suporte</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><Link href="#" className="hover:text-white transition-colors">Documentação</Link></li>
                      <li><Link href="#" className="hover:text-white transition-colors">Ajuda</Link></li>
                      <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400 text-sm">
                    © 2024 Agentes de Conversão. Todos os direitos reservados.
                  </p>
                  <p className="text-gray-400 text-sm mt-4 md:mt-0">
                    Powered by{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      className="font-bold hover:text-white transition-colors"
                      rel="noreferrer"
                    >
                      Supabase
                    </a>
                  </p>
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
