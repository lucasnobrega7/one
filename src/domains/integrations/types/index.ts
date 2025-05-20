/**
 * Tipos relacionados ao domínio de integrações
 */

export type IntegrationType = "whatsapp" | "slack" | "discord" | "telegram" | "email" | "api"

export type IntegrationStatus = "active" | "inactive" | "pending" | "error"

export type WhatsAppProvider = "z-api" | "evolution-api" | "evolution-qr"

export interface Integration {
  id: string
  organizationId: string
  name: string
  type: IntegrationType
  status: IntegrationStatus
  config: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface WhatsAppIntegration extends Integration {
  type: "whatsapp"
  config: {
    provider: WhatsAppProvider
    instanceId?: string
    token?: string
    baseUrl?: string
    apiKey?: string
    webhookUrl: string
    phoneNumber?: string
  }
}

export interface SlackIntegration extends Integration {
  type: "slack"
  config: {
    botToken: string
    signingSecret: string
    appId: string
    clientId: string
    clientSecret: string
    workspaceId: string
    channels: string[]
  }
}

export interface WebhookConfig {
  url: string
  secret: string
  events: string[]
  active: boolean
}

export interface CreateIntegrationParams {
  name: string
  type: IntegrationType
  config: Record<string, any>
}

export interface UpdateIntegrationParams {
  id: string
  name?: string
  status?: IntegrationStatus
  config?: Record<string, any>
}
