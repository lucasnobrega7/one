"use client"

import { useState } from "react"
import Link from "next/link"
import Image from 'next/image'
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from '@/lib/utils'
import { useAuth } from "@/domains/auth/hooks/useAuth"
import {
  Home,
  MessageSquare,
  Database,
  FileText,
  Settings,
  Users,
  BarChart2,
  LogOut,
  Plug,
  Sparkles,
  Code,
  HelpCircle,
  CircleDot
} from "lucide-react"

interface DashboardSidebarProps {
  collapsed?: boolean
  className?: string
}

/**
 * Sidebar do dashboard com navegação principal
 */
export function DashboardSidebar({
  collapsed = false,
  className
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const { logout, isLoggingOut } = useAuth()
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  // Group toggle handler
  const toggleGroup = (groupName: string) => {
    setOpenGroup(openGroup === groupName ? null : groupName)
  }

  // Navigation items with support for nested groups
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home
    },
    {
      href: "/agents",
      label: "Agentes",
      icon: MessageSquare,
      badge: "7" // Optional badge
    },
    {
      href: "/datastores",
      label: "Datastores",
      icon: Database
    },
    {
      href: "/datasources",
      label: "Datasources",
      icon: FileText
    },
    {
      href: "/integrations",
      label: "Integrações",
      icon: Plug,
      badge: "Novo" // Text badge
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart2
    }
  ]

  // Additional navigation items for settings and admin
  const secondaryNavItems = [
    {
      href: "/settings",
      label: "Configurações",
      icon: Settings
    },
    {
      href: "/team",
      label: "Equipe",
      icon: Users
    },
    {
      href: "/help",
      label: "Ajuda & Suporte",
      icon: HelpCircle
    }
  ]

  return (
    <div className={cn(
      "flex h-screen flex-col border-r border-surface-stroke bg-sidebar-background transition-all duration-300 ease-in-out",
      collapsed ? "w-[70px]" : "w-64",
      className
    )}>
      <div className="flex h-16 items-center border-b border-surface-stroke px-4 gap-3">
        <Link href="/dashboard" className="flex items-center">
          {collapsed ? (
            <Image
              src="/logo-agentesdeconversao-black.svg"
              alt="AC"
              width={30}
              height={30}
              className="dark:hidden"
            />
          ) : (
            <Image
              src="/logo-agentesdeconversao-black.svg"
              alt="Agentes de Conversão"
              width={140}
              height={32}
              className="dark:hidden"
            />
          )}

          {collapsed ? (
            <Image
              src="/logo-agentesdeconversao-white.svg"
              alt="AC"
              width={30}
              height={30}
              className="hidden dark:block"
            />
          ) : (
            <Image
              src="/logo-agentesdeconversao-white.svg"
              alt="Agentes de Conversão"
              width={140}
              height={32}
              className="hidden dark:block"
            />
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive(item.href)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className={cn(
                  "ml-auto",
                  typeof item.badge === 'string' && isNaN(Number(item.badge))
                    ? "rounded-full px-1.5 py-0.5 text-xs bg-primary text-white" // Text badge
                    : "flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-xs text-primary" // Number badge
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {!collapsed && (
          <div className="my-6 mx-3">
            <Link
              href="/flow"
              className="flex items-center justify-between rounded-lg border border-surface-stroke bg-surface-raised px-3 py-3 text-sm transition-all hover:bg-surface-raised/80 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium">Criar fluxo</p>
                  <p className="text-xs text-muted-foreground">
                    Use nosso editor visual
                  </p>
                </div>
              </div>
              <CircleDot className="h-6 w-6 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>
        )}

        <Separator className="mx-2 my-4" />

        <div className="grid gap-1 px-2">
          {secondaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive(item.href)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-0"
          )}
          onClick={logout}
          disabled={isLoggingOut}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className={cn("h-5 w-5 shrink-0", collapsed ? "mr-0" : "mr-2")} />
          {!collapsed && (
            <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
          )}
        </Button>
      </div>
    </div>
  )
}
