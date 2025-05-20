"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { integrationService } from "../services/integrationService"
import type { Integration } from "../types/integration.types"

const whatsAppConfigSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  provider: z.enum(["twilio", "360dialog", "messagebird", "custom"]),
  apiKey: z.string().min(1, "API Key é obrigatória"),
  phoneNumber: z.string().min(1, "Número de telefone é obrigatório"),
  webhookUrl: z.string().url("URL de webhook inválida").optional().or(z.literal("")),
  welcomeMessage: z.string().optional(),
})

type WhatsAppConfigFormValues = z.infer<typeof whatsAppConfigSchema>

interface WhatsAppConfigFormProps {
  integration?: Integration
  organizationId: string
  onSuccess?: (integration: Integration) => void
}

export function WhatsAppConfigForm({ integration, organizationId, onSuccess }: WhatsAppConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<WhatsAppConfigFormValues>({
    resolver: zodResolver(whatsAppConfigSchema),
    defaultValues: integration
      ? {
          name: integration.name,
          provider: (integration.config as any).provider,
          apiKey: (integration.config as any).apiKey,
          phoneNumber: (integration.config as any).phoneNumber,
          webhookUrl: (integration.config as any).webhookUrl || "",
          welcomeMessage: (integration.config as any).welcomeMessage || "",
        }
      : {
          name: "WhatsApp Integration",
          provider: "twilio",
          apiKey: "",
          phoneNumber: "",
          webhookUrl: "",
          welcomeMessage: "Olá! Como posso ajudar?",
        },
  })

  const handleSubmit = async (values: WhatsAppConfigFormValues) => {
    setIsSubmitting(true)
    try {
      let result: Integration

      const config = {
        provider: values.provider,
        apiKey: values.apiKey,
        phoneNumber: values.phoneNumber,
        webhookUrl: values.webhookUrl,
        welcomeMessage: values.welcomeMessage,
      }

      if (integration) {
        // Atualizar integração existente
        result = await integrationService.updateIntegration({
          id: integration.id,
          name: values.name,
          config,
        })
        toast({
          title: "Integração atualizada",
          description: "Sua integração com WhatsApp foi atualizada com sucesso.",
        })
      } else {
        // Criar nova integração
        result = await integrationService.createIntegration(organizationId, {
          name: values.name,
          type: "whatsapp",
          config,
        })
        toast({
          title: "Integração criada",
          description: "Sua integração com WhatsApp foi criada com sucesso.",
        })
      }

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao salvar integração",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration ? "Editar Integração WhatsApp" : "Nova Integração WhatsApp"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome da Integração
            </label>
            <Input id="name" {...form.register("name")} placeholder="WhatsApp Business" />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="provider" className="text-sm font-medium">
              Provedor
            </label>
            <Select
              onValueChange={(value) => form.setValue("provider", value as any)}
              defaultValue={form.getValues("provider")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um provedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="360dialog">360dialog</SelectItem>
                <SelectItem value="messagebird">MessageBird</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.provider && (
              <p className="text-sm text-red-500">{form.formState.errors.provider.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              API Key
            </label>
            <Input id="apiKey" type="password" {...form.register("apiKey")} placeholder="Sua API Key" />
            {form.formState.errors.apiKey && (
              <p className="text-sm text-red-500">{form.formState.errors.apiKey.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Número de Telefone
            </label>
            <Input
              id="phoneNumber"
              {...form.register("phoneNumber")}
              placeholder="+5511999999999"
              className="placeholder:text-gray-400"
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-sm text-red-500">{form.formState.errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="webhookUrl" className="text-sm font-medium">
              URL de Webhook (opcional)
            </label>
            <Input
              id="webhookUrl"
              {...form.register("webhookUrl")}
              placeholder="https://seu-dominio.com/api/webhooks/whatsapp"
            />
            {form.formState.errors.webhookUrl && (
              <p className="text-sm text-red-500">{form.formState.errors.webhookUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="welcomeMessage" className="text-sm font-medium">
              Mensagem de Boas-Vindas (opcional)
            </label>
            <Textarea
              id="welcomeMessage"
              {...form.register("welcomeMessage")}
              placeholder="Olá! Como posso ajudar?"
              className="placeholder:text-gray-400"
            />
            {form.formState.errors.welcomeMessage && (
              <p className="text-sm text-red-500">{form.formState.errors.welcomeMessage.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="whatsAppConfigForm" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : integration ? "Atualizar" : "Criar"}
        </Button>
      </CardFooter>
    </Card>
  )
}
