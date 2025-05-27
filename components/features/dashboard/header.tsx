"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, User, Settings, LogOut } from "lucide-react"

export function DashboardHeader() {
  const { data: session } = // TODO: Replace with Supabase auth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await // TODO: Replace with supabase.auth.signOut({ callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold md:text-xl">
          {pathname === "/dashboard"
            ? "Dashboard"
            : pathname.startsWith("/dashboard/agents")
              ? "Agentes"
              : pathname.startsWith("/dashboard/knowledge")
                ? "Bases de Conhecimento"
                : pathname.startsWith("/dashboard/analytics")
                  ? "Analytics"
                  : pathname.startsWith("/dashboard/users")
                    ? "Usuários"
                    : pathname.startsWith("/dashboard/settings")
                      ? "Configurações"
                      : pathname.startsWith("/dashboard/help")
                        ? "Ajuda"
                        : "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Avatar"} />
                <AvatarFallback>
                  {session?.user?.name
                    ? session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
