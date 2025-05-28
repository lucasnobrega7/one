"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSupabase } from '@/components/supabase-provider'
import { AuthCheck } from "@/components/features/auth/auth-check"
import { UnifiedNavigation } from "@/components/navigation/unified-navigation"
import { CrossDomainBreadcrumbs } from "@/components/navigation/cross-domain-breadcrumbs"
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
import { Logo } from "@/components/ui/logo"
import DashboardLayoutDark from "@/components/layout/dashboard-layout-dark"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  active?: boolean
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, supabase } = useSupabase()
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
      <DashboardLayoutDark>
        {children}
      </DashboardLayoutDark>
    </AuthCheck>
  )
}
