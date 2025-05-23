import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

// Tipos para o sistema de conversas
interface ConversationFilters {
  agentId?: string
  status?: 'active' | 'resolved' | 'archived'
  limit?: number
  offset?: number
  search?: string
}

interface ConversationSummary {
  id: string
  title: string
  agentId: string
  agentName: string
  lastMessage: string
  lastMessageAt: string
  messageCount: number
  status: string
  visitorId?: string
  userId?: string
  createdAt: string
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get('agentId')
    const status = searchParams.get('status') as 'active' | 'resolved' | 'archived'
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const search = searchParams.get('search')

    const supabase = createClient()

    // Construir query para buscar conversas
    let query = supabase
      .from('conversations')
      .select(`
        id,
        title,
        status,
        visitor_id,
        created_at,
        updated_at,
        agents!inner (
          id,
          name,
          icon_url
        ),
        messages (
          content,
          created_at,
          role
        )
      `)
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (agentId && agentId !== 'all') {
      query = query.eq('agent_id', agentId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,messages.content.ilike.%${search}%`)
    }

    const { data: conversations, error } = await query

    if (error) {
      console.error("Erro ao buscar conversas:", error)
      return NextResponse.json({ error: "Erro ao buscar conversas" }, { status: 500 })
    }

    // Processar dados para o formato de resposta
    const conversationSummaries: ConversationSummary[] = (conversations || []).map(conv => {
      const messages = conv.messages || []
      const lastMessage = messages
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

      return {
        id: conv.id,
        title: conv.title || 'Conversa sem título',
        agentId: conv.agents.id,
        agentName: conv.agents.name,
        lastMessage: lastMessage?.content?.substring(0, 100) || 'Nenhuma mensagem',
        lastMessageAt: lastMessage?.created_at || conv.created_at,
        messageCount: messages.length,
        status: conv.status || 'active',
        visitorId: conv.visitor_id,
        userId: session.user.id,
        createdAt: conv.created_at
      }
    })

    return NextResponse.json({
      conversations: conversationSummaries,
      pagination: {
        limit,
        offset,
        hasMore: conversationSummaries.length === limit
      }
    })

  } catch (error: any) {
    console.error("Erro ao buscar conversas:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" }, 
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const data = await req.json()
    const { agentId, title, message, visitorId } = data

    if (!agentId || !message) {
      return NextResponse.json({ 
        error: "ID do agente e mensagem inicial são obrigatórios" 
      }, { status: 400 })
    }

    const supabase = createClient()

    // Verificar se o agente existe e pertence ao usuário
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, name')
      .eq('id', agentId)
      .eq('user_id', session.user.id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
    }

    // Criar nova conversa
    const conversationId = uuidv4()
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        id: conversationId,
        agent_id: agentId,
        user_id: session.user.id,
        visitor_id: visitorId || uuidv4(),
        title: title || message.substring(0, 50),
        status: 'active'
      })
      .select(`
        *,
        agents (id, name, icon_url)
      `)
      .single()

    if (convError) {
      console.error("Erro ao criar conversa:", convError)
      return NextResponse.json({ error: "Erro ao criar conversa" }, { status: 500 })
    }

    // Criar mensagem inicial
    const messageId = uuidv4()
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        id: messageId,
        conversation_id: conversationId,
        content: message,
        role: 'user',
        user_id: session.user.id,
        visitor_id: conversation.visitor_id
      })

    if (msgError) {
      console.error("Erro ao criar mensagem inicial:", msgError)
      return NextResponse.json({ error: "Erro ao criar mensagem inicial" }, { status: 500 })
    }

    return NextResponse.json({
      id: conversation.id,
      agentId: conversation.agent_id,
      agentName: conversation.agents.name,
      title: conversation.title,
      visitorId: conversation.visitor_id,
      status: conversation.status,
      createdAt: conversation.created_at,
      initialMessageId: messageId
    })

  } catch (error: any) {
    console.error("Erro ao criar conversa:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" }, 
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const data = await req.json()
    const { id, title, status } = data

    if (!id) {
      return NextResponse.json({ error: "ID da conversa é obrigatório" }, { status: 400 })
    }

    const supabase = createClient()

    // Verificar se a conversa existe e pertence ao usuário
    const { data: existingConv, error: checkError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (checkError || !existingConv) {
      return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 })
    }

    // Atualizar conversa
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (title !== undefined) updateData.title = title
    if (status !== undefined) updateData.status = status

    const { data: updatedConv, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select(`
        *,
        agents (id, name, icon_url)
      `)
      .single()

    if (error) {
      console.error("Erro ao atualizar conversa:", error)
      return NextResponse.json({ error: "Erro ao atualizar conversa" }, { status: 500 })
    }

    return NextResponse.json(updatedConv)

  } catch (error: any) {
    console.error("Erro ao atualizar conversa:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "ID da conversa não fornecido" }, { status: 400 })
    }

    // Verificar se a conversa pertence ao usuário
    const { data: existingConversation, error: checkError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingConversation) {
      return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 })
    }

    // Deletar a conversa (cascading vai deletar mensagens)
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Erro ao deletar conversa:", error)
      return NextResponse.json({ error: "Erro ao deletar conversa" }, { status: 500 })
    }

    return NextResponse.json({ message: "Conversa deletada com sucesso" })
  } catch (error: any) {
    console.error("Erro ao deletar conversa:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}