"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Agent } from "./types/agent"
import { agentService } from "./services/agent-service"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/hooks/use-current-user"
import { PlusIcon, SearchIcon } from "lucide-react"

export default function AgentListPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useCurrentUser()

  useEffect(() => {
    const fetchAgents = async () => {
      if (!user?.organizationId) return

      setIsLoading(true)
      try {
        const data = await agentService.getAgents(user.organizationId)
        setAgents(data)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch agents",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [user?.organizationId, toast])

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agents</h1>
        <Button onClick={() => router.push("/agents/create")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search agents..."
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
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No agents found</h2>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "Try a different search term" : "Create your first agent to get started"}
          </p>
          {!searchQuery && (
            <Button onClick={() => router.push("/agents/create")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {agent.iconUrl && (
                    <img
                      src={agent.iconUrl || "/placeholder.svg"}
                      alt={agent.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  {agent.name}
                </CardTitle>
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
                  Settings
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
