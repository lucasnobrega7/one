import type { ReactNode } from "react"
import Link from "next/link"

interface DocsLayoutProps {
  children: ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0e0e10] text-white">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-white/90 mb-4">Documentação</h3>
              <nav className="grid gap-1 py-2">
                <Link
                  href="/docs"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-[#1a1a1d] hover:text-white transition-all duration-200"
                >
                  Visão Geral
                </Link>
                <Link
                  href="/docs/api-reference"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-[#1a1a1d] hover:text-white transition-all duration-200"
                >
                  Referência da API
                </Link>
                <Link
                  href="/docs/http-tools"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-[#1a1a1d] hover:text-white transition-all duration-200"
                >
                  HTTP Tools
                </Link>
                <Link
                  href="/docs/webhooks"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-[#1a1a1d] hover:text-white transition-all duration-200"
                >
                  Webhooks
                </Link>
                <Link
                  href="/docs/n8n-integration"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-[#1a1a1d] hover:text-white transition-all duration-200"
                >
                  Integração com N8N
                </Link>
              </nav>
            </div>
          </div>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>
  )
}
