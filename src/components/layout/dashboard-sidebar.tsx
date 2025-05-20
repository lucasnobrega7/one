"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/domains/auth/hooks/useAuth"
import { Home, MessageSquare, Database, FileText, Settings, Users, BarChart2, LogOut, Search, Plug } from "lucide-react"

/**
 * Sidebar do dashboard com navegação principal
 */
export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout, isLoggingOut } = useAuth()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <div className="flex h-screen flex-col border-r border-gray-800 bg-[#0e0e10] w-64">
      <div className="flex h-16 items-center border-b border-gray-800 px-4">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-[#46B2E0] via-[#8A53D2] to-[#E056A0] text-transparent bg-clip-text">
            AgentSaaS
          </span>
        </Link>
      </div>
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar..." className="pl-10 bg-[#1a1a1d] border-gray-800" />
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive("/dashboard") ? "bg-[#1a1a1d] text-white" : "text-gray-400 hover:bg-[#1a1a1d] hover:text-white"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/agents"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive("/agents") ? "bg-[#1a1a1d] text-white" : "text-gray-400 hover:bg-[#1a1a1d] hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Agentes</span>
          </Link>
          <Link
            href="/datastores"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive("/datastores") ? "bg-[#1a1a1d] text-white" : "text-gray-400 hover:bg-[#1a1a1d] hover:text-white"
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Datastores</span>
          </Link>
          <Link
            href="/datasources"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive("/datasources") ? "bg-[#1a1a1d] text-white" : "text-gray-400 hover:bg-[#1a1a1d] hover:text-white"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Datasources</span>
          </Link>
          <Link
            href="/integrations"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive("/integrations")
                ? "bg-[#1a1a1d] text-white"
                : "text-gray-400 hover:bg-[#1a1a1d] hover:text-white"
            }`}
          >
            <Plug className="h-4 w-4" />
            <span>Integrações</span>
          </Link>
          <Link
            href="/analytics"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive("/analytics") ? "bg-[#1a1a1d] text-white" : "text-gray-400 hover:bg-[#1a1a1d] hover:text-white"
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive("/settings") ? "bg-[#1a1a1d] text-white" : "text-gray-400 hover:bg-[#1a1a1d] hover:text-white"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Link>
          <Link
            href="/team"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive("/team") ? "bg-[#1a1a1d] text-white" : "text-gray-400 hover:bg-[#1a1a1d] hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Equipe</span>
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white"
          onClick={logout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
        </Button>
      </div>
    </div>
  )
}
