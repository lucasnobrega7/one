"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Bot, MessageSquare, Settings, ArrowRight, Database } from "lucide-react"
import Link from "next/link"
import { getCurrentUserName } from "@/lib/user-context"

type Agent = {
  id: string
  name: string
  description: string
  conversations?: any[]
  createdAt: string
  knowledgeBase?: {
    name: string
  } | null
}

export function AgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const userName = getCurrentUserName()

  useEffect(() => {
    async function loadAgents() {
      try {
        const response = await fetch("/api/agents")
        if (response.ok) {
          const data = await response.json()
          setAgents(data)
        } else {
          // Error loading agents
        }
      } catch (error) {
        // Error loading agents
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/20">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <span className="font-medium text-lg">Agentes de Conversão</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium underline">
                Dashboard
              </Link>
              <Link href="/agents" className="text-sm text-white hover:underline">
                Agentes
              </Link>
              <Link href="/knowledge" className="text-sm text-white hover:underline">
                Conhecimento
              </Link>
              <Link href="/analytics" className="text-sm text-white hover:underline">
                Analytics
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/70">{userName}</span>
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif mb-1">Seus Agentes</h1>
            <p className="text-white/70">Gerencie e monitore seus agentes conversacionais</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
              <Link href="/knowledge">
                <Database className="mr-2 h-4 w-4" />
                Bases de Conhecimento
              </Link>
            </Button>
            <Button className="bg-white text-black hover:bg-white/90" asChild>
              <Link href="/agents/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Agente
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="border-t border-white/20 pt-6">
                <div className="flex items-center text-xl mb-2">
                  <Bot className="mr-2 h-5 w-5 text-white" />
                  <h3 className="font-serif">{agent.name}</h3>
                </div>
                <p className="text-white/70 mb-4">{agent.description}</p>
                <div className="flex items-center justify-between text-sm text-white/50 mb-4">
                  <div className="flex items-center">
                    {agent.knowledgeBase && (
                      <span className="bg-white/10 text-white px-2 py-1 text-xs">KB: {agent.knowledgeBase.name}</span>
                    )}
                  </div>
                  <div>Criado em: {new Date(agent.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-black"
                    asChild
                  >
                    <Link href={`/agents/${agent.id}/edit`}>
                      <Settings className="mr-1 h-3 w-3" />
                      Editar
                    </Link>
                  </Button>
                  <Button size="sm" className="bg-white text-black hover:bg-white/90" asChild>
                    <Link href={`/agents/${agent.id}/chat`}>
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Conversar
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {agents.length === 0 && (
              <div className="col-span-full border border-dashed border-white/20 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <PlusCircle className="h-6 w-6 text-white/40" />
                </div>
                <h3 className="text-lg font-medium mb-2">Nenhum agente encontrado</h3>
                <p className="text-white/70 mb-4">Crie seu primeiro agente conversacional para começar</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                  <Link href="/agents/new">
                    Criar Agente
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
