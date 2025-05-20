"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  MessageSquare,
  Database,
  FileText,
  BarChart,
  Settings,
  LogOut,
  Users,
  Zap,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Agents",
      icon: Zap,
      href: "/agents",
      active: pathname.startsWith("/agents"),
    },
    {
      label: "Knowledge Base",
      icon: Database,
      href: "/datastores",
      active: pathname.startsWith("/datastores"),
    },
    {
      label: "Documents",
      icon: FileText,
      href: "/datasources",
      active: pathname.startsWith("/datasources"),
    },
    {
      label: "Conversations",
      icon: MessageSquare,
      href: "/conversations",
      active: pathname.startsWith("/conversations"),
    },
    {
      label: "Integrations",
      icon: Users,
      href: "/integrations",
      active: pathname.startsWith("/integrations"),
    },
    {
      label: "Analytics",
      icon: BarChart,
      href: "/analytics",
      active: pathname.startsWith("/analytics"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname.startsWith("/settings"),
    },
  ]

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white border-r transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 border-b">
          <Link href="/dashboard">
            <div className="flex items-center">
              <span className="text-xl font-bold">AI Platform</span>
            </div>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", route.active ? "bg-secondary" : "hover:bg-secondary/50")}
                >
                  <route.icon className="mr-2 h-5 w-5" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
