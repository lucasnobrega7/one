"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useCurrentUser } from "@/domains/auth/hooks/useCurrentUser"
import { useAuth } from "@/domains/auth/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  HelpCircle,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  Search,
  MessageSquare,
  LayoutDashboard
} from "lucide-react"

interface DashboardHeaderProps {
  onToggleSidebar?: () => void
  className?: string
}

/**
 * Header do dashboard com perfil do usuário e notificações
 */
export function DashboardHeader({ onToggleSidebar, className }: DashboardHeaderProps) {
  const { user, isLoading } = useCurrentUser()
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname?.split('/').filter(Boolean) || []

    if (path.length === 0) return 'Dashboard'

    // Get the last part of the path and capitalize it
    const lastPart = path[path.length - 1]
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ')
  }

  return (
    <header className={cn(
      "h-16 px-4 border-b border-surface-stroke bg-surface-base flex items-center justify-between",
      className
    )}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <div className="hidden md:flex items-center gap-2">
          <Image
            src="/logo-agentesdeconversao-black.svg"
            alt="Agentes de Conversão"
            width={140}
            height={32}
            className="dark:hidden"
          />
          <Image
            src="/logo-agentesdeconversao-white.svg"
            alt="Agentes de Conversão"
            width={140}
            height={32}
            className="hidden dark:block"
          />
        </div>
      </div>

      <div className="flex items-center max-w-lg w-full px-2 mx-auto">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-10 bg-surface-raised"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              <span className="sr-only">Notificações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="text-sm text-center py-4 text-muted-foreground">
              Sem novas notificações
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (mounted) {
              setTheme(theme === 'dark' ? 'light' : 'dark')
            }
          }}
        >
          {mounted && theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Alternar tema</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.firstName || "User"} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
