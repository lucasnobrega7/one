"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Agent, AgentModelName, AgentVisibility } from "../types/agent"
import { agentService } from "../services/agent-service"
import { useToast } from "@/hooks/use-toast"

const agentFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  instructions: z.string().min(1, "Instructions are required"),
  modelName: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4o", "claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]),
  temperature: z.number().min(0).max(1),
  visibility: z.enum(["public", "private"]),
  handle: z.string().optional(),
  includeSources: z.boolean().default(true),
})

type AgentFormValues = z.infer<typeof agentFormSchema>

interface AgentFormProps {
  agent?: Agent
  organizationId: string
  onSuccess?: (agent: Agent) => void
}

export function AgentForm({ agent, organizationId, onSuccess }: AgentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: agent
      ? {
          name: agent.name,
          description: agent.description,
          instructions: agent.instructions,
          modelName: agent.modelName,
          temperature: agent.temperature,
          visibility: agent.visibility,
          handle: agent.handle,
          includeSources: agent.includeSources ?? true,
        }
      : {
          name: "",
          description: "",
          instructions: "You are a helpful AI assistant.",
          modelName: "gpt-4o",
          temperature: 0.7,
          visibility: "private",
          includeSources: true,
        },
  })

  const handleSubmit = async (values: AgentFormValues) => {
    setIsSubmitting(true)
    try {
      let result: Agent

      if (agent) {
        // Update existing agent
        result = await agentService.updateAgent({
          id: agent.id,
          ...values,
        })
        toast({
          title: "Agent updated",
          description: "Your agent has been updated successfully.",
        })
      } else {
        // Create new agent
        result = await agentService.createAgent(organizationId, values)
        toast({
          title: "Agent created",
          description: "Your new agent has been created successfully.",
        })
      }

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save agent",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{agent ? "Edit Agent" : "Create New Agent"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" {...form.register("name")} placeholder="My AI Assistant" />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="A helpful AI assistant that can answer questions about your business."
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="instructions" className="text-sm font-medium">
              Instructions
            </label>
            <Textarea
              id="instructions"
              {...form.register("instructions")}
              placeholder="You are a helpful AI assistant..."
              rows={5}
            />
            {form.formState.errors.instructions && (
              <p className="text-sm text-red-500">{form.formState.errors.instructions.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="modelName" className="text-sm font-medium">
                Model
              </label>
              <Select
                onValueChange={(value) => form.setValue("modelName", value as AgentModelName)}
                defaultValue={form.getValues("modelName")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.modelName && (
                <p className="text-sm text-red-500">{form.formState.errors.modelName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="temperature" className="text-sm font-medium">
                Temperature
              </label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                min="0"
                max="1"
                {...form.register("temperature", { valueAsNumber: true })}
              />
              {form.formState.errors.temperature && (
                <p className="text-sm text-red-500">{form.formState.errors.temperature.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="visibility" className="text-sm font-medium">
                Visibility
              </label>
              <Select
                onValueChange={(value) => form.setValue("visibility", value as AgentVisibility)}
                defaultValue={form.getValues("visibility")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.visibility && (
                <p className="text-sm text-red-500">{form.formState.errors.visibility.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="handle" className="text-sm font-medium">
                Handle (optional)
              </label>
              <Input id="handle" {...form.register("handle")} placeholder="my-assistant" />
              {form.formState.errors.handle && (
                <p className="text-sm text-red-500">{form.formState.errors.handle.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeSources"
              {...form.register("includeSources")}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="includeSources" className="text-sm font-medium">
              Include sources in responses
            </label>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : agent ? "Update Agent" : "Create Agent"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
