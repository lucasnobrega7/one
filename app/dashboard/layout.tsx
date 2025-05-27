"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { AuthCheck } from "@/components/features/auth/auth-check"
import {
  Home,
  MessageSquare,
  Database,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  User,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  active?: boolean
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fechar sidebar ao mudar de rota em dispositivos móveis
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      label: "Agentes",
      href: "/dashboard/agents",
      icon: MessageSquare,
      active: pathname.startsWith("/dashboard/agents"),
    },
    {
      label: "Bases de Conhecimento",
      href: "/dashboard/knowledge",
      icon: Database,
      active: pathname.startsWith("/dashboard/knowledge"),
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart2,
      active: pathname.startsWith("/dashboard/analytics"),
    },
    {
      label: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
    },
    {
      label: "Ajuda",
      href: "/dashboard/help",
      icon: HelpCircle,
      active: pathname.startsWith("/dashboard/help"),
    },
  ]

  const getPageTitle = () => {
    const item = navItems.find((item) => item.active)
    return item?.label || "Dashboard"
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-[#0e0e10] text-white">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1a1a1d] border-r border-[#27272a] transform transition-all duration-300 ease-out md:translate-x-0 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-[#27272a] bg-gradient-to-r from-[#46B2E0]/5 to-[#8A53D2]/5">
            <Link href="/dashboard" className="flex items-center group">
              <div className="relative mr-3">
                <div className="absolute inset-0 bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10"
                >
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM14.5 21.5C14.5 22.881 13.381 24 12 24C10.619 24 9.5 22.881 9.5 21.5C9.5 20.119 10.619 19 12 19C13.381 19 14.5 20.119 14.5 21.5ZM14.5 10.5C14.5 11.881 13.381 13 12 13C10.619 13 9.5 11.881 9.5 10.5C9.5 9.119 10.619 8 12 8C13.381 8 14.5 9.119 14.5 10.5ZM20 16C20 17.381 18.881 18.5 17.5 18.5C16.119 18.5 15 17.381 15 16C15 14.619 16.119 13.5 17.5 13.5C18.881 13.5 20 14.619 20 16ZM22.5 21.5C22.5 22.881 21.381 24 20 24C18.619 24 17.5 22.881 17.5 21.5C17.5 20.119 18.619 19 20 19C21.381 19 22.5 20.119 22.5 21.5ZM22.5 10.5C22.5 11.881 21.381 13 20 13C18.619 13 17.5 11.881 17.5 10.5C17.5 9.119 18.619 8 20 8C21.381 8 22.5 9.119 22.5 10.5Z"
                    fill="url(#logoGradient)"
                  />
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#46B2E0" />
                      <stop offset="50%" stopColor="#8A53D2" />
                      <stop offset="100%" stopColor="#E056A0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-semibold text-white/90 group-hover:text-white transition-colors duration-200">
                Agentes de Conversão
              </span>
            </Link>
            <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white hover:from-[#46B2E0]/90 hover:to-[#8A53D2]/90 mb-6 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0"
            >
              <Link href="/dashboard/agents/new">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agente
              </Link>
            </Button>
          </div>

          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                      item.active 
                        ? "bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 text-white border border-[#27272a] shadow-lg" 
                        : "text-white/70 hover:bg-[#27272a]/30 hover:text-white hover:scale-[1.02] hover:shadow-md"
                    }`}
                  >
                    {item.active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#46B2E0]/10 to-[#8A53D2]/10"></div>
                    )}
                    <item.icon className={`h-5 w-5 mr-3 relative z-10 transition-colors duration-200 ${
                      item.active ? "text-[#46B2E0]" : "group-hover:text-[#46B2E0]"
                    }`} />
                    <span className="relative z-10 font-medium">{item.label}</span>
                    {item.active && (
                      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-[#46B2E0] to-[#8A53D2] rounded-l"></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <div className="md:ml-64">
          {/* Header */}
          <header className="bg-[#0e0e10] border-b border-[#27272a] sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <button 
                  className="text-white/70 hover:text-white mr-4 md:hidden p-2 rounded-lg hover:bg-[#27272a]/30 transition-all duration-200" 
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-white/90">{getPageTitle()}</h1>
                  <div className="ml-3 px-2 py-1 bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 rounded-full">
                    <span className="text-xs font-medium text-[#46B2E0]">Pro</span>
                  </div>
                </div>
              </div>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-[#27272a]/30 transition-all duration-200 group">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <Avatar className="h-8 w-8 relative z-10 border border-[#27272a]">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content - Enhanced container with better spacing */}
          <main className="px-4 py-8 sm:px-6 lg:px-8 bg-surface-base min-h-screen">
            <div className="max-w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
