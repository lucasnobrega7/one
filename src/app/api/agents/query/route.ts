import { NextResponse } from "next/server"
import { agentService } from "@/domains/agents/services/agentService"
import { conversationService } from "@/domains/conversations/services/conversationService"
import { getCurrentUser } from "@/domains/auth/services/authService"

export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obter dados da requisição
    const data = await request.json()
    const { agentId, message, conversationId } = data

    if (!agentId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verificar se o agente existe
    const agent = await agentService.getAgentById(agentId)
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Criar ou obter conversa
    let conversation
    if (conversationId) {
      conversation = await conversationService.getConversationById(conversationId)
      if (!conversation || conversation.agentId !== agentId) {
        return NextResponse.json({ error: "Invalid conversation" }, { status: 400 })
      }
    } else {
      conversation = await conversationService.createConversation({
        agentId,
        userId: user.id,
      })
    }

    // Processar a consulta
    const result = await agentService.queryAgent({
      agentId,
      message,
      conversationId: conversation.id,
      includeHistory: true,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error querying agent:", error)
    return NextResponse.json({ error: "Failed to query agent" }, { status: 500 })
  }
}
