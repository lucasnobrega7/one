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
import { Logo } from "@/components/ui/logo"

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
            <Logo variant="light" size="sm" href="/dashboard" />
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
