"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUp, Search, ChevronDown } from "lucide-react"

interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      label: "Research",
      href: "/research",
      children: [
        { label: "Overview", href: "/research" },
        { label: "Index", href: "/research/index" },
      ],
    },
    {
      label: "API",
      href: "/api",
      children: [
        { label: "Overview", href: "/api" },
        { label: "Documentation", href: "/api/docs" },
        { label: "Examples", href: "/api/examples" },
        { label: "Pricing", href: "/api/pricing" },
      ],
    },
    {
      label: "Agents",
      href: "/agents",
      children: [
        { label: "Overview", href: "/agents" },
        { label: "Features", href: "/agents/features" },
        { label: "Examples", href: "/agents/examples" },
      ],
    },
    {
      label: "Safety",
      href: "/safety",
      children: [
        { label: "Overview", href: "/safety" },
        { label: "Standards", href: "/safety/standards" },
      ],
    },
    {
      label: "Company",
      href: "/about",
      children: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Charter", href: "/charter" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM14.5 21.5C14.5 22.881 13.381 24 12 24C10.619 24 9.5 22.881 9.5 21.5C9.5 20.119 10.619 19 12 19C13.381 19 14.5 20.119 14.5 21.5ZM14.5 10.5C14.5 11.881 13.381 13 12 13C10.619 13 9.5 11.881 9.5 10.5C9.5 9.119 10.619 8 12 8C13.381 8 14.5 9.119 14.5 10.5ZM20 16C20 17.381 18.881 18.5 17.5 18.5C16.119 18.5 15 17.381 15 16C15 14.619 16.119 13.5 17.5 13.5C18.881 13.5 20 14.619 20 16ZM22.5 21.5C22.5 22.881 21.381 24 20 24C18.619 24 17.5 22.881 17.5 21.5C17.5 20.119 18.619 19 20 19C21.381 19 22.5 20.119 22.5 21.5ZM22.5 10.5C22.5 11.881 21.381 13 20 13C18.619 13 17.5 11.881 17.5 10.5C17.5 9.119 18.619 8 20 8C21.381 8 22.5 9.119 22.5 10.5Z"
                  fill="white"
                />
              </svg>
              <span className="font-medium">Agentes de Conversão</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <Link href={item.href} className="flex items-center text-sm hover:opacity-70 transition-opacity">
                    {item.label}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Link>
                  <div className="absolute left-0 mt-2 w-48 bg-black border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {item.children?.map((child) => (
                      <Link key={child.href} href={child.href} className="block px-4 py-2 text-sm hover:bg-white/5">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-sm hover:opacity-70 transition-opacity hidden md:flex">
              <Search className="h-4 w-4" />
            </button>
            <Link href="/login" className="text-sm hover:opacity-70 transition-opacity">
              Entrar
            </Link>
            <Link href="/signup" className="text-sm bg-white text-black px-3 py-1 hover:bg-white/90 transition-colors">
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-black pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-20">
            <div className="flex flex-col">
              <span className="font-bold text-sm mb-4">Research</span>
              <Link href="/research" className="text-sm hover:underline mb-2">
                Overview
              </Link>
              <Link href="/research/index" className="text-sm hover:underline">
                Index
              </Link>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm mb-4">API</span>
              <Link href="/api" className="text-sm hover:underline mb-2">
                Overview
              </Link>
              <Link href="/api/docs" className="text-sm hover:underline mb-2">
                Documentation
              </Link>
              <Link href="/api/examples" className="text-sm hover:underline mb-2">
                Examples
              </Link>
              <Link href="/api/pricing" className="text-sm hover:underline">
                Pricing
              </Link>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm mb-4">Agents</span>
              <Link href="/agents" className="text-sm hover:underline mb-2">
                Overview
              </Link>
              <Link href="/agents/features" className="text-sm hover:underline mb-2">
                Features
              </Link>
              <Link href="/agents/examples" className="text-sm hover:underline">
                Examples
              </Link>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm mb-4">Safety</span>
              <Link href="/safety" className="text-sm hover:underline mb-2">
                Overview
              </Link>
              <Link href="/safety/standards" className="text-sm hover:underline">
                Standards
              </Link>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm mb-4">Company</span>
              <Link href="/about" className="text-sm hover:underline mb-2">
                About
              </Link>
              <Link href="/blog" className="text-sm hover:underline mb-2">
                Blog
              </Link>
              <Link href="/careers" className="text-sm hover:underline mb-2">
                Careers
              </Link>
              <Link href="/charter" className="text-sm hover:underline">
                Charter
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between">
            <div>
              <div className="text-sm mb-2">Agentes de Conversão © 2025</div>
              <Link href="/terms" className="text-sm hover:underline">
                Termos & Políticas
              </Link>
            </div>
            <div className="flex space-x-6 mt-6 md:mt-0">
              <Link href="https://twitter.com" className="text-sm hover:underline">
                Twitter
              </Link>
              <Link href="https://youtube.com" className="text-sm hover:underline">
                YouTube
              </Link>
              <Link href="https://github.com" className="text-sm hover:underline">
                GitHub
              </Link>
              <Link href="https://linkedin.com" className="text-sm hover:underline">
                LinkedIn
              </Link>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <Link href="#top" className="text-sm hover:underline flex items-center">
              Voltar ao topo <ArrowUp className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="h-64 mt-10 openai-gradient-lines"></div>
        </div>
      </footer>
    </div>
  )
}
