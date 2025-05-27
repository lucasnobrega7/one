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
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  active?: boolean
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Desktop-first navigation calculation
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
      label: "AgentStudio",
      href: "/dashboard/studio",
      icon: Workflow,
      active: pathname.startsWith("/dashboard/studio"),
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
    <div className="min-h-screen bg-gray-50">
      {/* Desktop-first layout: sidebar + main */}
      <div className="lg:flex">
        {/* Mobile backdrop - only show on smaller screens */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}

        {/* Sidebar - Desktop First Approach */}
        <div className="lg:w-64 lg:flex lg:flex-col lg:fixed lg:inset-y-0">
          {/* Desktop sidebar - always visible on lg+ */}
          <div className="hidden lg:flex lg:flex-col lg:flex-1">
            <aside className="flex-1 flex flex-col bg-white border-r border-gray-200">
              <div className="flex items-center h-16 px-4 border-b border-gray-200">
                <Link href="/dashboard" className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                    <Workflow className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    Agentes de Conversão
                  </span>
                </Link>
              </div>

              <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                      ${
                        item.active
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>

          {/* Mobile sidebar - slide out on mobile only */}
          <aside
            className={`
              fixed top-0 left-0 z-50 h-full w-64 bg-white 
              transform transition-transform duration-200 ease-in-out 
              lg:hidden
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link href="/dashboard" className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                  <Workflow className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Agentes de Conversão
                </span>
              </Link>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors" 
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
                        flex items-center px-4 py-2 rounded-md transition-colors duration-150
                        ${
                          item.active
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>

        {/* Main Content Area - Desktop First */}
        <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
          {/* Header - responsive design */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center min-w-0">
                <button 
                  className="text-gray-500 hover:text-gray-700 mr-4 lg:hidden transition-colors" 
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  Dashboard
                </h1>
              </div>

              {/* User menu - responsive */}
              <div className="relative flex-shrink-0">
                <button
                  className="flex items-center space-x-2 text-sm focus:outline-none p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata?.full_name || user.email || "User"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <span className="hidden sm:inline-block text-gray-700 font-medium max-w-24 truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuário"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Perfil
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Configurações
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        signOut()
                        setUserMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content - responsive container */}
          <main className="flex-1 overflow-y-auto">
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

export default DashboardLayout