"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import type { Agent } from "./types/agent"
import { agentService } from "./services/agent-service"
import { useToast } from "@/src/hooks/use-toast"
import { AgentForm } from "./components/agent-form"
import { useCurrentUser } from "@/src/hooks/use-current-user"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog"
import { TrashIcon } from "lucide-react"

export default function AgentSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useCurrentUser()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [isDeleting, setIsDeleting] = useState(false)

  const agentId = params?.id as string

  useEffect(() => {
    const fetchAgent = async () => {
      if (!agentId || !user?.organizationId) return

      setIsLoading(true)
      try {
        const data = await agentService.getAgentById(agentId)
        if (!data) {
          toast({
            title: "Error",
            description: "Agent not found",
            variant: "destructive",
          })
          router.push("/agents")
          return
        }

        // Check if user has access to this agent
        if (data.organizationId !== user.organizationId) {
          toast({
            title: "Error",
            description: "You do not have access to this agent",
            variant: "destructive",
          })
          router.push("/agents")
          return
        }

        setAgent(data)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch agent",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgent()
  }, [agentId, user?.organizationId, router, toast])

  const handleAgentUpdate = (updatedAgent: Agent) => {
    setAgent(updatedAgent)
    toast({
      title: "Success",
      description: "Agent updated successfully",
    })
  }

  const handleDeleteAgent = async () => {
    if (!agentId) return

    setIsDeleting(true)
    try {
      await agentService.deleteAgent(agentId)
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      })
      router.push("/agents")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete agent",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!agent) {
    return null
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{agent.name} Settings</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/agents/${agent.id}/chat`)}>
            Chat
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Agent
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the agent and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAgent}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          {user?.organizationId && (
            <AgentForm agent={agent} organizationId={user.organizationId} onSuccess={handleAgentUpdate} />
          )}
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Customize how your agent looks when deployed.</p>
              {/* Appearance settings form would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Configure tools that your agent can use.</p>
              {/* Tools configuration would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <CardTitle>Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Deploy your agent to various platforms.</p>
              {/* Deployment options would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
