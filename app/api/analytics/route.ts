import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30' // dias
    const agentId = searchParams.get('agentId') // opcional

    // Calcular data de início
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Query base para filtrar por usuário
    let agentsQuery = supabase
      .from("agents")
      .select("*")
      .eq("user_id", session.user.id)

    if (agentId) {
      agentsQuery = agentsQuery.eq("id", agentId)
    }

    const { data: agents, error: agentsError } = await agentsQuery

    if (agentsError) {
      return NextResponse.json({ error: "Erro ao buscar agentes" }, { status: 500 })
    }

    if (!agents || agents.length === 0) {
      return NextResponse.json({
        overview: {
          totalAgents: 0,
          totalConversations: 0,
          totalMessages: 0,
          avgMessagesPerConversation: 0,
          activeConversations: 0
        },
        timeSeries: [],
        topAgents: [],
        conversationStats: []
      })
    }

    const agentIds = agents.map(agent => agent.id)

    // Buscar conversações
    const { data: conversations, error: conversationsError } = await supabase
      .from("conversations")
      .select("*")
      .in("agent_id", agentIds)
      .gte("created_at", startDate.toISOString())

    if (conversationsError) {
      return NextResponse.json({ error: "Erro ao buscar conversações" }, { status: 500 })
    }

    const conversationIds = conversations?.map(conv => conv.id) || []

    // Buscar mensagens
    let messagesQuery = supabase
      .from("messages")
      .select("*")
      .gte("created_at", startDate.toISOString())

    if (conversationIds.length > 0) {
      messagesQuery = messagesQuery.in("conversation_id", conversationIds)
    }

    const { data: messages, error: messagesError } = await messagesQuery

    if (messagesError) {
      return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 })
    }

    // Calcular métricas
    const totalAgents = agents.length
    const totalConversations = conversations?.length || 0
    const totalMessages = messages?.length || 0
    const avgMessagesPerConversation = totalConversations > 0 ? totalMessages / totalConversations : 0

    // Conversações ativas (com mensagens nos últimos 7 dias)
    const activeDate = new Date()
    activeDate.setDate(activeDate.getDate() - 7)
    const activeConversations = conversations?.filter(conv => {
      return messages?.some(msg => 
        msg.conversation_id === conv.id && 
        new Date(msg.created_at) >= activeDate
      )
    }).length || 0

    // Gerar série temporal
    const timeSeries = generateTimeSeries(conversations || [], messages || [], parseInt(period))

    // Top agentes por conversações
    const agentStats = agents.map(agent => {
      const agentConversations = conversations?.filter(conv => conv.agent_id === agent.id) || []
      const agentMessages = messages?.filter(msg => 
        agentConversations.some(conv => conv.id === msg.conversation_id)
      ) || []

      return {
        id: agent.id,
        name: agent.name,
        conversations: agentConversations.length,
        messages: agentMessages.length,
        avgMessagesPerConversation: agentConversations.length > 0 
          ? agentMessages.length / agentConversations.length 
          : 0
      }
    }).sort((a, b) => b.conversations - a.conversations)

    // Estatísticas de conversação
    const conversationStats = conversations?.map(conv => {
      const convMessages = messages?.filter(msg => msg.conversation_id === conv.id) || []
      const agent = agents.find(a => a.id === conv.agent_id)
      
      return {
        id: conv.id,
        agentName: agent?.name || 'Agente Desconhecido',
        messageCount: convMessages.length,
        lastActivity: convMessages.length > 0 
          ? new Date(Math.max(...convMessages.map(msg => new Date(msg.created_at).getTime())))
          : new Date(conv.created_at),
        duration: calculateConversationDuration(convMessages),
        userMessages: convMessages.filter(msg => msg.role === 'user').length,
        assistantMessages: convMessages.filter(msg => msg.role === 'assistant').length
      }
    }).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()) || []

    return NextResponse.json({
      overview: {
        totalAgents,
        totalConversations,
        totalMessages,
        avgMessagesPerConversation: Math.round(avgMessagesPerConversation * 100) / 100,
        activeConversations
      },
      timeSeries,
      topAgents: agentStats.slice(0, 5),
      conversationStats: conversationStats.slice(0, 20),
      period: parseInt(period)
    })

  } catch (error: any) {
    console.error("Erro ao gerar analytics:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

function generateTimeSeries(conversations: any[], messages: any[], days: number) {
  const series = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayConversations = conversations.filter(conv => 
      conv.created_at.startsWith(dateStr)
    ).length

    const dayMessages = messages.filter(msg => 
      msg.created_at.startsWith(dateStr)
    ).length

    series.push({
      date: dateStr,
      conversations: dayConversations,
      messages: dayMessages
    })
  }

  return series
}

function calculateConversationDuration(messages: any[]): number {
  if (messages.length < 2) return 0

  const sortedMessages = messages.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const firstMessage = new Date(sortedMessages[0].created_at)
  const lastMessage = new Date(sortedMessages[sortedMessages.length - 1].created_at)

  return Math.round((lastMessage.getTime() - firstMessage.getTime()) / 1000 / 60) // minutos
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { eventType, agentId, conversationId, metadata } = await req.json()

    if (!eventType) {
      return NextResponse.json({ error: "Tipo de evento não fornecido" }, { status: 400 })
    }

    const supabase = createClient()

    // Registrar evento personalizado para analytics
    const { error } = await supabase
      .from("analytics_events")
      .insert({
        user_id: session.user.id,
        event_type: eventType,
        agent_id: agentId,
        conversation_id: conversationId,
        metadata: metadata || {},
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error("Erro ao registrar evento:", error)
      return NextResponse.json({ error: "Erro ao registrar evento" }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Erro ao registrar evento de analytics:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}