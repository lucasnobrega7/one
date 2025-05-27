'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Shield, 
  Settings, 
  Database, 
  Key, 
  Activity,
  Globe,
  CheckCircle,
  Server
} from 'lucide-react'
import { AuthCheck } from '@/components/features/auth/auth-check'
import { UnifiedNavigation } from '@/components/navigation/unified-navigation'
import { cn } from '@/lib/utils'

interface AdminNavItem {
  label: string
  href: string
  icon: React.ElementType
  description: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const adminNavItems: AdminNavItem[] = [
    {
      label: 'Subdomínios',
      href: '/admin/subdomains',
      icon: Globe,
      description: 'Gerenciar subdomínios DNS'
    },
    {
      label: 'Chaves API',
      href: '/admin/api-keys',
      icon: Key,
      description: 'Gerenciar tokens de acesso'
    },
    {
      label: 'Status API',
      href: '/admin/api-status',
      icon: Activity,
      description: 'Monitor de APIs'
    },
    {
      label: 'Dashboard API',
      href: '/admin/api-dashboard',
      icon: Server,
      description: 'Painel de controle da API'
    },
    {
      label: 'Verificar Env',
      href: '/admin/env-check',
      icon: CheckCircle,
      description: 'Verificar variáveis de ambiente'
    },
    {
      label: 'Config Check',
      href: '/admin/config-check',
      icon: Settings,
      description: 'Verificar configurações'
    },
    {
      label: 'DB Check',
      href: '/admin/db-check',
      icon: Database,
      description: 'Status do banco de dados'
    }
  ]

  return (
    <AuthCheck requireRole="admin">
      <div className="min-h-screen bg-[#0e0e10] text-white">
        {/* Unified Navigation */}
        <UnifiedNavigation currentSubdomain="dash" />
        
        <div className="flex">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-[#1a1a1d] border-r border-[#27272a] min-h-screen">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-red-500" />
                <h2 className="text-lg font-semibold">Admin Panel</h2>
              </div>
              
              <nav className="space-y-2">
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-[#46B2E0]/20 to-[#8A53D2]/20 text-white border border-[#27272a]"
                          : "text-white/70 hover:text-white hover:bg-[#27272a]/30"
                      )}
                    >
                      <item.icon className={cn(
                        "w-4 h-4",
                        isActive ? "text-[#46B2E0]" : ""
                      )} />
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}