import type { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DocsLayoutProps {
  children: ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 border-r bg-gray-50 p-4 md:block">
        <h2 className="mb-4 text-lg font-semibold">Documentação</h2>
        <nav className="space-y-1">
          <SidebarLink href="/docs">Visão Geral</SidebarLink>
          <SidebarLink href="/docs/api-reference">Referência da API</SidebarLink>
          <SidebarLink href="/docs/webhooks">Webhooks</SidebarLink>
          <SidebarLink href="/docs/http-tools">Ferramentas HTTP</SidebarLink>
          <SidebarLink href="/docs/n8n-integration">Integração N8N</SidebarLink>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  )
}

interface SidebarLinkProps {
  href: string
  children: ReactNode
  className?: string
}

function SidebarLink({ href, children, className }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        className,
      )}
    >
      {children}
    </Link>
  )
}
