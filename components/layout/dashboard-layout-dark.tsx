"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  ChevronDown,
  User,
  Workflow,
  Zap,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  active?: boolean
  badge?: string
}

export function DashboardLayoutDark({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

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
      label: "Flow Builder",
      href: "/dashboard/flows",
      icon: Workflow,
      active: pathname.startsWith("/dashboard/flows"),
      badge: "Novo",
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

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="lg:flex relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}

        {/* Sidebar */}
        <div className="lg:w-64 lg:flex lg:flex-col lg:fixed lg:inset-y-0">
          {/* Desktop sidebar */}
          <div className="hidden lg:flex lg:flex-col lg:flex-1">
            <aside className="flex-1 flex flex-col bg-[#111111]/90 backdrop-blur-xl border-r border-gray-800/50">
              <div className="flex items-center h-16 px-4 border-b border-gray-800/50">
                <Link href="/dashboard" className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#39ff14] to-green-500 flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    Agentes de Conversão
                  </span>
                </Link>
              </div>

              {/* 87% Margin Badge */}
              <div className="px-4 pt-4">
                <div className="bg-gradient-to-r from-[#39ff14]/20 to-green-500/20 border border-[#39ff14]/30 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[#39ff14] font-bold text-lg">87%</div>
                      <div className="text-gray-400 text-sm">Margem Líquida</div>
                    </div>
                    <div className="text-[#39ff14]">
                      <Zap className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 py-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                      ${
                        item.active
                          ? "bg-gradient-to-r from-[#39ff14]/20 to-green-500/20 text-[#39ff14] border-l-2 border-[#39ff14] shadow-lg shadow-[#39ff14]/10"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      {item.label}
                    </div>
                    {item.badge && (
                      <Badge className="bg-[#39ff14] text-black text-xs px-2 py-1">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>

              {/* User section in sidebar */}
              <div className="p-4 border-t border-gray-800/50">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#39ff14] to-green-500 flex items-center justify-center">
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata?.full_name || user.email || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-black" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuário"}
                    </div>
                    <div className="text-gray-400 text-xs truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Mobile sidebar */}
          <aside
            className={`
              fixed top-0 left-0 z-50 h-full w-64 bg-[#111111]/95 backdrop-blur-xl border-r border-gray-800/50
              transform transition-transform duration-300 ease-in-out 
              lg:hidden
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
              <Link href="/dashboard" className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#39ff14] to-green-500 flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">
                  Agentes de Conversão
                </span>
              </Link>
              <button 
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50" 
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                        ${
                          item.active
                            ? "bg-gradient-to-r from-[#39ff14]/20 to-green-500/20 text-[#39ff14] border-l-2 border-[#39ff14]"
                            : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <Badge className="bg-[#39ff14] text-black text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>

        {/* Main Content Area */}
        <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
          {/* Header */}
          <header className="bg-[#111111]/90 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center min-w-0">
                <button 
                  className="text-gray-400 hover:text-white mr-4 lg:hidden transition-colors p-2 rounded-lg hover:bg-gray-800/50" 
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                  Dashboard
                </h1>
              </div>

              {/* User menu - desktop only, mobile uses sidebar */}
              <div className="relative flex-shrink-0 hidden lg:block">
                <button
                  className="flex items-center space-x-3 text-sm focus:outline-none p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#39ff14] to-green-500 flex items-center justify-center">
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata?.full_name || user.email || "User"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-black" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-white font-medium text-sm">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuário"}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {user?.email}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 py-2 bg-[#111111]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 z-50">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-3" />
                        Perfil
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-3" />
                        Configurações
                      </div>
                    </Link>
                    <div className="border-t border-gray-800/50 my-2"></div>
                    <button
                      onClick={() => {
                        signOut()
                        setUserMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-3" />
                        Sair
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0A0A0A] to-[#111111]">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayoutDark