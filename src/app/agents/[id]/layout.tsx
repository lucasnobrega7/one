"use client"

import type React from "react"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const agentId = params.id as string

  const tabs = [
    {
      value: "chat",
      label: "Chat",
      href: `/agents/${agentId}/chat`,
    },
    {
      value: "settings",
      label: "Configurações",
      href: `/agents/${agentId}/settings`,
    },
    {
      value: "flow",
      label: "Editor de Fluxo",
      href: `/agents/${agentId}/flow`,
    },
    {
      value: "analytics",
      label: "Analytics",
      href: `/agents/${agentId}/analytics`,
    },
  ]

  const getCurrentTab = () => {
    const path = pathname
    const tab = tabs.find((tab) => path.includes(tab.value))
    return tab?.value || "chat"
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="p-1">
        <Tabs value={getCurrentTab()} className="w-full">
          <TabsList className="w-full justify-start">
            {tabs.map((tab) => (
              <Link key={tab.value} href={tab.href} className="w-full">
                <TabsTrigger value={tab.value} className="w-full">
                  {tab.label}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
      </Card>
      {children}
    </div>
  )
}
