'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

interface SubdomainConfig {
  key: string
  label: string
  href: string
  icon: React.ElementType
  description: string
  external?: boolean
}

interface UnifiedNavigationProps {
  currentSubdomain?: 'lp' | 'login' | 'dash' | 'docs' | 'api'
  showMobileMenu?: boolean
  onMobileMenuToggle?: (open: boolean) => void
}

const subdomains: SubdomainConfig[] = [
  {
    key: 'lp',
    label: 'Home',
    href: process.env.NODE_ENV === 'production' 
      ? 'https://lp.agentesdeconversao.ai' 
      : 'http://localhost:3000',
    icon: Home,
    description: 'Landing page e marketing',
    external: true
  },
  {
    key: 'dash',
    label: 'Dashboard',
    href: process.env.NODE_ENV === 'production' 
      ? 'https://dash.agentesdeconversao.ai' 
      : 'http://localhost:3000/dashboard',
    icon: MessageSquare,
    description: 'Painel principal da aplicação',
    external: process.env.NODE_ENV === 'production'
  },
  {
    key: 'docs',
    label: 'Documentação',
    href: process.env.NODE_ENV === 'production' 
      ? 'https://docs.agentesdeconversao.ai' 
      : 'http://localhost:3000/docs',
    icon: FileText,
    description: 'Guias e referência da API',
    external: process.env.NODE_ENV === 'production'
  }
]

export function UnifiedNavigation({ 
  currentSubdomain = 'dash',
  showMobileMenu = false,
  onMobileMenuToggle 
}: UnifiedNavigationProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const handleSubdomainNavigation = (subdomain: SubdomainConfig) => {
    // Preservar contexto antes da navegação
    if (typeof window !== 'undefined') {
      const context = {
        currentPath: pathname,
        timestamp: Date.now(),
        user: session?.user?.email,
        subdomain: currentSubdomain
      }
      
      // Armazenar contexto no localStorage para recuperação posterior
      localStorage.setItem('nav-context', JSON.stringify(context))
      
      // Navegação com transição suave
      if (subdomain.external) {
        window.location.href = subdomain.href
      }
    }
  }

  return (
    <nav className="bg-[#0e0e10] border-b border-[#27272a] sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href={subdomains.find(s => s.key === 'lp')?.href || '/'}
              className="flex items-center"
            >
              <Logo variant="light" size="sm" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {subdomains.map((subdomain) => {
                const isActive = currentSubdomain === subdomain.key
                
                return (
                  <Link
                    key={subdomain.key}
                    href={subdomain.href}
                    onClick={() => handleSubdomainNavigation(subdomain)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      isActive
                        ? "bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 text-white border border-[#27272a]"
                        : "text-white/70 hover:text-white hover:bg-[#27272a]/30"
                    )}
                  >
                    <subdomain.icon className="w-4 h-4" />
                    {subdomain.label}
                    {subdomain.external && (
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full hover:bg-[#27272a]/30"
                  >
                    <Avatar className="h-8 w-8 border border-[#27272a]">
                      <AvatarImage 
                        src={session.user.image || ""} 
                        alt={session.user.name || "User"} 
                      />
                      <AvatarFallback className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link 
                      href={process.env.NODE_ENV === 'production' 
                        ? 'https://dash.agentesdeconversao.ai/dashboard/profile' 
                        : '/dashboard/profile'
                      }
                    >
                      <User className="h-4 w-4 mr-2" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      href={process.env.NODE_ENV === 'production' 
                        ? 'https://dash.agentesdeconversao.ai/dashboard/settings' 
                        : '/dashboard/settings'
                      }
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ 
                      callbackUrl: process.env.NODE_ENV === 'production' 
                        ? 'https://lp.agentesdeconversao.ai' 
                        : '/' 
                    })}
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href={process.env.NODE_ENV === 'production' 
                  ? 'https://login.agentesdeconversao.ai' 
                  : '/auth/login'
                }
                className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Entrar
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-[#27272a]/30"
              onClick={() => onMobileMenuToggle?.(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-[#27272a] mt-4">
              {subdomains.map((subdomain) => {
                const isActive = currentSubdomain === subdomain.key
                
                return (
                  <Link
                    key={subdomain.key}
                    href={subdomain.href}
                    onClick={() => {
                      handleSubdomainNavigation(subdomain)
                      onMobileMenuToggle?.(false)
                    }}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 text-white"
                        : "text-white/70 hover:text-white hover:bg-[#27272a]/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <subdomain.icon className="w-5 h-5" />
                      <div>
                        <div className="flex items-center gap-2">
                          {subdomain.label}
                          {subdomain.external && (
                            <ExternalLink className="w-4 h-4 opacity-50" />
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {subdomain.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}