"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAgentsApi } from "../hooks/use-agents-api"
import type { Agent } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { listAgents, isLoading, error } = useAgentsApi()

  useEffect(() => {
    const fetchAgents = async () => {
      const data = await listAgents()
      setAgents(data)
    }

    fetchAgents()
  }, [listAgents])

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agentes</h1>
        <Button onClick={() => router.push("/agents/create")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Criar Agente
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar agentes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Erro ao carregar agentes</h2>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <Button onClick={() => listAgents()}>Tentar novamente</Button>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Nenhum agente encontrado</h2>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "Tente um termo de busca diferente" : "Crie seu primeiro agente para começar"}
          </p>
          {!searchQuery && (
            <Button onClick={() => router.push("/agents/create")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Criar Agente
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 line-clamp-2">{agent.description}</p>
                <div className="flex mt-4 space-x-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{agent.modelName}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      agent.visibility === "public" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {agent.visibility}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/agents/${agent.id}/chat`)}>
                  Chat
                </Button>
                <Button variant="outline" onClick={() => router.push(`/agents/${agent.id}/settings`)}>
                  Configurações
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
