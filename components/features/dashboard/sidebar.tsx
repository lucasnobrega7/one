"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MessageSquare, Database, BarChart2, Users, Settings, HelpCircle } from "lucide-react"
import { Permission } from "@/lib/auth/permissions"
import { PermissionGate } from "@/components/features/auth/permission-gate"

interface SidebarItemProps {
  href: string
  icon: React.ElementType
  label: string
  permission?: Permission
}

function SidebarItem({ href, icon: Icon, label, permission }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  const item = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )

  if (permission) {
    return <PermissionGate permission={permission}>{item}</PermissionGate>
  }

  return item
}

export function DashboardSidebar() {
  return (
    <div className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-full bg-primary" />
        <span className="text-lg font-semibold">Agentes de Conversão</span>
      </div>

      <nav className="space-y-1">
        <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" permission={Permission.ViewDashboard} />

        <SidebarItem href="/dashboard/agents" icon={MessageSquare} label="Agentes" permission={Permission.ViewAgents} />

        <SidebarItem
          href="/dashboard/knowledge"
          icon={Database}
          label="Bases de Conhecimento"
          permission={Permission.ViewKnowledgeBases}
        />

        <SidebarItem
          href="/dashboard/analytics"
          icon={BarChart2}
          label="Analytics"
          permission={Permission.ViewAnalytics}
        />

        <SidebarItem href="/dashboard/users" icon={Users} label="Usuários" permission={Permission.ViewUsers} />

        <SidebarItem
          href="/dashboard/settings"
          icon={Settings}
          label="Configurações"
          permission={Permission.ManageSettings}
        />

        <SidebarItem href="/dashboard/help" icon={HelpCircle} label="Ajuda" />
      </nav>
    </div>
  )
}
