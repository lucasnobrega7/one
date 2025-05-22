import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/user-context"
import { supabase } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { message, conversationId, agentId } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 })
    }

    let conversation

    // Se não tiver conversationId, criar uma nova conversa
    if (!conversationId) {
      if (!agentId) {
        return NextResponse.json({ error: "ID do agente não fornecido" }, { status: 400 })
      }

      // Verificar se o agente existe
      const { data: agent, error: agentError } = await supabase.from("agents").select().eq("id", agentId).single()

      if (agentError || !agent) {
        return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
      }

      // Criar nova conversa
      const { data: newConversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          id: uuidv4(),
          agent_id: agentId,
          user_id: session.user.id,
        })
        .select()
        .single()

      if (convError) {
        console.error("Erro ao criar conversa:", convError)
        return NextResponse.json({ error: "Erro ao criar conversa" }, { status: 500 })
      }

      conversation = newConversation
    } else {
      // Buscar conversa existente
      const { data: existingConversation, error: convError } = await supabase
        .from("conversations")
        .select()
        .eq("id", conversationId)
        .single()

      if (convError || !existingConversation) {
        return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 })
      }

      // Verificar se o usuário tem acesso a esta conversa
      if (existingConversation.user_id !== session.user.id) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
      }

      conversation = existingConversation
    }

    // Salvar mensagem do usuário
    const { error: userMsgError } = await supabase.from("messages").insert({
      id: uuidv4(),
      conversation_id: conversation.id,
      content: message,
      role: "user",
    })

    if (userMsgError) {
      console.error("Erro ao salvar mensagem do usuário:", userMsgError)
      return NextResponse.json({ error: "Erro ao salvar mensagem" }, { status: 500 })
    }

    // Aqui você pode adicionar a lógica para gerar a resposta do agente
    // usando OpenAI, Cohere, ou outro serviço de IA

    // Por enquanto, vamos simular uma resposta
    const aiResponse = `Esta é uma resposta simulada para: "${message}"`

    // Salvar resposta do agente
    const { error: aiMsgError } = await supabase.from("messages").insert({
      id: uuidv4(),
      conversation_id: conversation.id,
      content: aiResponse,
      role: "assistant",
    })

    if (aiMsgError) {
      console.error("Erro ao salvar resposta do agente:", aiMsgError)
      return NextResponse.json({ error: "Erro ao salvar resposta" }, { status: 500 })
    }

    return NextResponse.json({
      conversationId: conversation.id,
      message: aiResponse,
    })
  } catch (error: any) {
    console.error("Erro no processamento do chat:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
