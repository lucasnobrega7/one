'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-mobile'

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  const pathname = usePathname()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false)
    }
  }, [pathname, isDesktop])
  
  // Reset sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(isDesktop)
    setSidebarCollapsed(false)
  }, [isDesktop])
  
  // Toggle sidebar open/closed (for mobile)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  // Toggle sidebar collapsed/expanded (for desktop)
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && !isDesktop && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:z-auto",
          !sidebarOpen && !isDesktop ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <DashboardSidebar collapsed={isDesktop && sidebarCollapsed} />
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader 
          onToggleSidebar={isDesktop ? toggleSidebarCollapse : toggleSidebar} 
          className="sticky top-0 z-20"
        />
        
        <main className={cn(
          "flex-1 overflow-auto bg-background p-4 transition-all",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}