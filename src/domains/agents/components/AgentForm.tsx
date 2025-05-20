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
import type { Agent, AgentModelName, AgentVisibility } from "../types/agent.types"
import { agentService } from "../services/agentService"
import { useToast } from "@/hooks/use-toast"

const agentFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  instructions: z.string().min(1, "Instruções são obrigatórias"),
  modelName: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4o", "claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]),
  temperature: z.number().min(0).max(1),
  visibility: z.enum(["public", "private", "organization"]),
  handle: z.string().optional(),
  includeSources: z.boolean().default(true),
})

type AgentFormValues = z.infer<typeof agentFormSchema>

interface AgentFormProps {
  agent?: Agent
  organizationId: string
  onSuccess?: (agent: Agent) => void
}

/**
 * Formulário para criação e edição de agentes
 */
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
          instructions: "Você é um assistente de IA útil.",
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
        // Atualizar agente existente
        result = await agentService.updateAgent({
          id: agent.id,
          ...values,
        })
        toast({
          title: "Agente atualizado",
          description: "Seu agente foi atualizado com sucesso.",
        })
      } else {
        // Criar novo agente
        result = await agentService.createAgent(organizationId, values)
        toast({
          title: "Agente criado",
          description: "Seu novo agente foi criado com sucesso.",
        })
      }

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao salvar agente",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{agent ? "Editar Agente" : "Criar Novo Agente"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <Input id="name" {...form.register("name")} placeholder="Meu Assistente IA" />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Um assistente de IA útil que pode responder perguntas sobre seu negócio."
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="instructions" className="text-sm font-medium">
              Instruções
            </label>
            <Textarea
              id="instructions"
              {...form.register("instructions")}
              placeholder="Você é um assistente de IA útil..."
              rows={5}
            />
            {form.formState.errors.instructions && (
              <p className="text-sm text-red-500">{form.formState.errors.instructions.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="modelName" className="text-sm font-medium">
                Modelo
              </label>
              <Select
                onValueChange={(value) => form.setValue("modelName", value as AgentModelName)}
                defaultValue={form.getValues("modelName")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo" />
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
                Temperatura
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
                Visibilidade
              </label>
              <Select
                onValueChange={(value) => form.setValue("visibility", value as AgentVisibility)}
                defaultValue={form.getValues("visibility")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a visibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Privado</SelectItem>
                  <SelectItem value="organization">Organização</SelectItem>
                  <SelectItem value="public">Público</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.visibility && (
                <p className="text-sm text-red-500">{form.formState.errors.visibility.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="handle" className="text-sm font-medium">
                Handle (opcional)
              </label>
              <Input id="handle" {...form.register("handle")} placeholder="meu-assistente" />
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
              Incluir fontes nas respostas
            </label>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : agent ? "Atualizar Agente" : "Criar Agente"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
