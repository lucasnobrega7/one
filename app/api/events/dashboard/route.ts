import { NextRequest } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"

interface DashboardEvent {
  type: 'conversation_started' | 'message_received' | 'agent_responded' | 'user_joined' | 'system_update';
  data: any;
  timestamp: string;
  user_id?: string;
}

// Store para manter conexões ativas
const activeConnections = new Map<string, {
  controller: ReadableStreamDefaultController;
  encoder: TextEncoder;
  userId: string;
}>()

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = session.user.id!
    const connectionId = `${userId}_${Date.now()}`

    // Criar stream para Server-Sent Events
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        
        // Armazenar conexão
        activeConnections.set(connectionId, {
          controller,
          encoder,
          userId,
        })

        // Enviar evento inicial
        const initEvent = {
          type: 'connection_established',
          data: {
            connectionId,
            timestamp: new Date().toISOString(),
            user_id: userId,
          },
          timestamp: new Date().toISOString(),
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(initEvent)}\n\n`)
        )

        // Configurar heartbeat para manter conexão viva
        const heartbeat = setInterval(() => {
          try {
            const heartbeatEvent = {
              type: 'heartbeat',
              data: { timestamp: new Date().toISOString() },
              timestamp: new Date().toISOString(),
            }
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(heartbeatEvent)}\n\n`)
            )
          } catch (error) {
            console.log(`Connection ${connectionId} closed, clearing heartbeat`)
            clearInterval(heartbeat)
            activeConnections.delete(connectionId)
          }
        }, 30000) // 30 seconds

        // Cleanup quando a conexão fechar
        req.signal.addEventListener('abort', () => {
          clearInterval(heartbeat)
          activeConnections.delete(connectionId)
          try {
            controller.close()
          } catch (error) {
            // Connection already closed
          }
        })
      },
      
      cancel() {
        activeConnections.delete(connectionId)
      }
    })

    // Iniciar monitoramento de atividade para este usuário
    startActivityMonitoring(userId)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })

  } catch (error) {
    console.error("Erro ao estabelecer conexão SSE:", error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// Função para monitorar atividade do usuário
async function startActivityMonitoring(userId: string) {
  const supabase = createClient()
  
  // Simular eventos periódicos (em produção, isso seria baseado em triggers do DB)
  const activityInterval = setInterval(async () => {
    try {
      // Buscar atividade recente
      const [conversationsRes, messagesRes, agentsRes] = await Promise.all([
        // Conversas recentes
        supabase
          .from("conversations")
          .select("*")
          .eq("user_id", userId)
          .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
          .limit(5),
        
        // Mensagens recentes
        supabase
          .from("messages")
          .select("*, conversations!inner(user_id)")
          .eq("conversations.user_id", userId)
          .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
          .limit(10),
        
        // Status dos agentes
        supabase
          .from("agents")
          .select("id, name, is_active")
          .eq("user_id", userId)
      ])

      // Preparar eventos para envio
      const events: DashboardEvent[] = []

      // Novas conversas
      if (conversationsRes.data && conversationsRes.data.length > 0) {
        conversationsRes.data.forEach(conv => {
          events.push({
            type: 'conversation_started',
            data: {
              conversation_id: conv.id,
              title: conv.title,
              agent_id: conv.agent_id,
              created_at: conv.created_at,
            },
            timestamp: conv.created_at,
            user_id: userId,
          })
        })
      }

      // Novas mensagens
      if (messagesRes.data && messagesRes.data.length > 0) {
        messagesRes.data.forEach(msg => {
          events.push({
            type: msg.role === 'user' ? 'message_received' : 'agent_responded',
            data: {
              message_id: msg.id,
              conversation_id: msg.conversation_id,
              content_preview: msg.content.substring(0, 100) + '...',
              role: msg.role,
              created_at: msg.created_at,
            },
            timestamp: msg.created_at,
            user_id: userId,
          })
        })
      }

      // Enviar eventos para todas as conexões ativas deste usuário
      if (events.length > 0) {
        broadcastToUser(userId, events)
      }

      // Enviar estatísticas atualizadas a cada 2 minutos
      if (Math.random() < 0.1) { // 10% de chance a cada check
        const statsEvent: DashboardEvent = {
          type: 'system_update',
          data: {
            stats: {
              active_conversations: conversationsRes.data?.length || 0,
              total_agents: agentsRes.data?.length || 0,
              recent_messages: messagesRes.data?.length || 0,
            }
          },
          timestamp: new Date().toISOString(),
          user_id: userId,
        }
        broadcastToUser(userId, [statsEvent])
      }

    } catch (error) {
      console.error("Erro no monitoramento de atividade:", error)
    }
  }, 10000) // Check a cada 10 segundos

  // Cleanup após 1 hora de inatividade
  setTimeout(() => {
    clearInterval(activityInterval)
  }, 60 * 60 * 1000)
}

// Função para broadcast de eventos para um usuário específico
function broadcastToUser(userId: string, events: DashboardEvent[]) {
  for (const [connectionId, connection] of activeConnections.entries()) {
    if (connection.userId === userId) {
      try {
        events.forEach(event => {
          connection.controller.enqueue(
            connection.encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          )
        })
      } catch (error) {
        console.log(`Connection ${connectionId} error, removing:`, error.message)
        activeConnections.delete(connectionId)
      }
    }
  }
}

// Função para broadcast global (para eventos do sistema)
export function broadcastGlobal(event: DashboardEvent) {
  for (const [connectionId, connection] of activeConnections.entries()) {
    try {
      connection.controller.enqueue(
        connection.encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
      )
    } catch (error) {
      console.log(`Connection ${connectionId} error, removing:`, error.message)
      activeConnections.delete(connectionId)
    }
  }
}

// Endpoint para trigger manual de eventos (para webhooks externos)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { event, target_user } = await req.json()

    if (!event || !event.type) {
      return new Response('Invalid event format', { status: 400 })
    }

    const dashboardEvent: DashboardEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      user_id: target_user || session.user.id,
    }

    if (target_user) {
      broadcastToUser(target_user, [dashboardEvent])
    } else {
      broadcastGlobal(dashboardEvent)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error("Erro ao enviar evento manual:", error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}