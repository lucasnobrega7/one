import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

interface AdvancedChatRequest {
  messages: Array<{ role: string; content: string }>;
  message?: string; // backward compatibility
  conversationId?: string;
  temperature?: number;
  maxTokens?: number;
  context_data?: Record<string, any>;
  system_prompt_override?: string;
  streaming?: boolean;
}

interface StreamEvent {
  event: 'progress' | 'answer' | 'source' | 'metadata' | 'done' | 'error';
  data: any;
  conversation_id?: string;
  message_id?: string;
  timestamp: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const agentId = params.id
    const requestData: AdvancedChatRequest = await req.json()
    
    // Suporte para formato antigo e novo
    const messages = requestData.messages || [{ role: 'user', content: requestData.message || '' }]
    const userMessage = messages[messages.length - 1]?.content

    if (!userMessage) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 })
    }

    // Verificar se o agente existe e pertence ao usuário
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .eq("user_id", session.user.id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
    }

    let conversation
    
    // Buscar ou criar conversa
    if (requestData.conversationId) {
      const { data: existingConversation, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", requestData.conversationId)
        .eq("user_id", session.user.id)
        .single()

      if (convError || !existingConversation) {
        return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 })
      }
      conversation = existingConversation
    } else {
      // Criar nova conversa
      const { data: newConversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          id: uuidv4(),
          agent_id: agentId,
          user_id: session.user.id,
          title: `Chat com ${agent.name}`,
          metadata: requestData.context_data || {},
        })
        .select()
        .single()

      if (convError) {
        return NextResponse.json({ error: "Erro ao criar conversa" }, { status: 500 })
      }
      conversation = newConversation
    }

    // Salvar mensagem do usuário
    const userMessageId = uuidv4()
    const { error: userMsgError } = await supabase.from("messages").insert({
      id: userMessageId,
      conversation_id: conversation.id,
      content: userMessage,
      role: "user",
      metadata: {
        context_data: requestData.context_data,
        timestamp: new Date().toISOString(),
      },
    })

    if (userMsgError) {
      return NextResponse.json({ error: "Erro ao salvar mensagem" }, { status: 500 })
    }

    // Configurar stream de resposta aprimorado
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        const messageId = uuidv4()
        
        try {
          // Evento de início
          const startEvent: StreamEvent = {
            event: 'progress',
            data: { status: 'started', progress: 0 },
            conversation_id: conversation.id,
            message_id: messageId,
            timestamp: new Date().toISOString(),
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(startEvent)}\n\n`))

          // Buscar contexto da base de conhecimento se disponível
          let sources: any[] = []
          if (agent.knowledge_base_id) {
            try {
              // Simular busca na base de conhecimento
              const { data: searchResults } = await supabase
                .from("documents")
                .select("*")
                .eq("knowledge_base_id", agent.knowledge_base_id)
                .textSearch("content", userMessage)
                .limit(3)

              sources = searchResults?.map(doc => ({
                score: 0.85,
                source: doc.name,
                datasource_id: agent.knowledge_base_id,
                datasource_name: "Base de Conhecimento",
                content_excerpt: doc.content.substring(0, 200) + "...",
                custom_id: doc.id,
              })) || []

              // Enviar fontes encontradas
              if (sources.length > 0) {
                for (const source of sources) {
                  const sourceEvent: StreamEvent = {
                    event: 'source',
                    data: source,
                    conversation_id: conversation.id,
                    message_id: messageId,
                    timestamp: new Date().toISOString(),
                  }
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(sourceEvent)}\n\n`))
                }
              }
            } catch (error) {
              console.warn('Erro ao buscar contexto:', error)
            }
          }

          // Simular progresso de processamento
          const progressEvent: StreamEvent = {
            event: 'progress',
            data: { status: 'processing', progress: 25 },
            conversation_id: conversation.id,
            message_id: messageId,
            timestamp: new Date().toISOString(),
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(progressEvent)}\n\n`))

          // Gerar resposta (aqui seria a integração com LLM real)
          const contextInfo = sources.length > 0 
            ? `\n\nBaseado nas informações encontradas: ${sources.map(s => s.content_excerpt).join('; ')}`
            : ''
          
          const systemPrompt = requestData.system_prompt_override || agent.system_prompt
          const fullResponse = `${systemPrompt}\n\nResposta para: "${userMessage}"${contextInfo}\n\nEsta é uma resposta em streaming aprimorada que considera o contexto fornecido e as configurações do agente.`
          
          // Simular streaming de tokens
          const words = fullResponse.split(' ')
          let currentResponse = ''
          
          for (let i = 0; i < words.length; i++) {
            currentResponse += (i > 0 ? ' ' : '') + words[i]
            
            const answerEvent: StreamEvent = {
              event: 'answer',
              data: words[i] + (i < words.length - 1 ? ' ' : ''),
              conversation_id: conversation.id,
              message_id: messageId,
              timestamp: new Date().toISOString(),
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(answerEvent)}\n\n`))
            
            // Simular delay realista
            await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
            
            // Atualizar progresso
            const progress = Math.round(((i + 1) / words.length) * 75) + 25
            if (progress % 10 === 0) {
              const progressEvent: StreamEvent = {
                event: 'progress',
                data: { status: 'generating', progress },
                conversation_id: conversation.id,
                message_id: messageId,
                timestamp: new Date().toISOString(),
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(progressEvent)}\n\n`))
            }
          }

          // Salvar resposta completa no banco
          await supabase.from("messages").insert({
            id: messageId,
            conversation_id: conversation.id,
            content: fullResponse,
            role: "assistant",
            metadata: {
              sources,
              model: agent.model_id,
              temperature: requestData.temperature || agent.temperature,
              context_data: requestData.context_data,
              processing_time: Date.now(),
            },
          })

          // Metadata final
          const metadataEvent: StreamEvent = {
            event: 'metadata',
            data: {
              model: agent.model_id,
              temperature: requestData.temperature || agent.temperature,
              tokens_used: words.length,
              sources_count: sources.length,
              processing_time: Date.now(),
            },
            conversation_id: conversation.id,
            message_id: messageId,
            timestamp: new Date().toISOString(),
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(metadataEvent)}\n\n`))

          // Evento final
          const doneEvent: StreamEvent = {
            event: 'done',
            data: { 
              conversation_id: conversation.id,
              message_id: messageId,
              complete: true,
            },
            conversation_id: conversation.id,
            message_id: messageId,
            timestamp: new Date().toISOString(),
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(doneEvent)}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          
          controller.close()
        } catch (error) {
          console.error('Erro no streaming:', error)
          const errorEvent: StreamEvent = {
            event: 'error',
            data: { 
              error: error instanceof Error ? error.message : 'Erro desconhecido',
              conversation_id: conversation.id,
            },
            conversation_id: conversation.id,
            message_id: messageId,
            timestamp: new Date().toISOString(),
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`))
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })

  } catch (error: any) {
    console.error("Erro no streaming do chat:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}