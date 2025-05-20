import type { WhatsAppIntegration } from "../types"

/**
 * Serviço para gerenciar integrações com WhatsApp
 */
export const whatsappService = {
  /**
   * Envia uma mensagem via WhatsApp
   */
  async sendMessage(integration: WhatsAppIntegration, to: string, message: string): Promise<boolean> {
    try {
      if (integration.status !== "active") {
        throw new Error("WhatsApp integration is not active")
      }

      // Implementação específica para cada provedor
      switch (integration.config.provider) {
        case "z-api":
          return await sendMessageViaZApi(integration, to, message)
        case "evolution-api":
          return await sendMessageViaEvolutionApi(integration, to, message)
        case "evolution-qr":
          return await sendMessageViaEvolutionQr(integration, to, message)
        default:
          throw new Error(`Unsupported WhatsApp provider: ${integration.config.provider}`)
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error)
      return false
    }
  },

  /**
   * Verifica o status da conexão com WhatsApp
   */
  async checkConnectionStatus(integration: WhatsAppIntegration): Promise<boolean> {
    try {
      // Implementação específica para cada provedor
      switch (integration.config.provider) {
        case "z-api":
          return await checkZApiStatus(integration)
        case "evolution-api":
          return await checkEvolutionApiStatus(integration)
        case "evolution-qr":
          return await checkEvolutionQrStatus(integration)
        default:
          throw new Error(`Unsupported WhatsApp provider: ${integration.config.provider}`)
      }
    } catch (error) {
      console.error("Error checking WhatsApp connection status:", error)
      return false
    }
  },
}

// Implementações específicas para cada provedor
async function sendMessageViaZApi(integration: WhatsAppIntegration, to: string, message: string): Promise<boolean> {
  const { instanceId, token } = integration.config

  if (!instanceId || !token) {
    throw new Error("Missing Z-API credentials")
  }

  const response = await fetch(`https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: to,
      message,
    }),
  })

  if (!response.ok) {
    throw new Error(`Z-API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.success === true
}

async function sendMessageViaEvolutionApi(
  integration: WhatsAppIntegration,
  to: string,
  message: string,
): Promise<boolean> {
  const { baseUrl, apiKey } = integration.config

  if (!baseUrl || !apiKey) {
    throw new Error("Missing Evolution API credentials")
  }

  const response = await fetch(`${baseUrl}/message/sendText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
    },
    body: JSON.stringify({
      number: to,
      textMessage: {
        text: message,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Evolution API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.status === "success"
}

async function sendMessageViaEvolutionQr(
  integration: WhatsAppIntegration,
  to: string,
  message: string,
): Promise<boolean> {
  // Implementação similar à Evolution API com ajustes específicos
  return sendMessageViaEvolutionApi(integration, to, message)
}

async function checkZApiStatus(integration: WhatsAppIntegration): Promise<boolean> {
  const { instanceId, token } = integration.config

  if (!instanceId || !token) {
    throw new Error("Missing Z-API credentials")
  }

  const response = await fetch(`https://api.z-api.io/instances/${instanceId}/token/${token}/status`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error(`Z-API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.connected === true
}

async function checkEvolutionApiStatus(integration: WhatsAppIntegration): Promise<boolean> {
  const { baseUrl, apiKey } = integration.config

  if (!baseUrl || !apiKey) {
    throw new Error("Missing Evolution API credentials")
  }

  const response = await fetch(`${baseUrl}/instance/connectionState`, {
    method: "GET",
    headers: {
      apikey: apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Evolution API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.state === "open"
}

async function checkEvolutionQrStatus(integration: WhatsAppIntegration): Promise<boolean> {
  // Implementação similar à Evolution API com ajustes específicos
  return checkEvolutionApiStatus(integration)
}
