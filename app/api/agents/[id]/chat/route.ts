import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"
import { openai } from "@/lib/ai-client"

// Tipos customizados para nossa API
interface ChatMessage {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt?: string
  sources?: any[]
  metadata?: Record<string, any>
}

interface ChatRequest {
  message: string
  conversationId?: string
  visitorId?: string
  streaming?: boolean
  context?: string
  temperature?: number
  maxTokens?: number
  useKnowledgeBase?: boolean
}

interface ChatResponse {
  answer: string
  messageId: string
  conversationId: string
  visitorId?: string
  sources?: any[]
  metadata?: Record<string, any>
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agentId = params.id
    const session = await auth()
    
    // Permitir acesso público a agentes ou exigir autenticação baseado na configuração
    const supabase = createClient()
    
    const data: ChatRequest = await req.json()
    const {
      message,
      conversationId,
      visitorId = uuidv4(),
      streaming = false,
      context,
      temperature,
      maxTokens,
      useKnowledgeBase = true
    } = data

    // Buscar o agente
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select(`
        *,
        knowledge_bases (
          id,
          name,
          description,
          index_name
        )
      `)
      .eq("id", agentId)
      .eq("is_active", true)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: "Agente não encontrado ou inativo" }, { status: 404 })
    }

    // Verificar permissões se necessário
    if (session?.user && agent.user_id !== session.user.id) {
      // Aqui podemos implementar lógica de permissões públicas vs privadas
      // Por enquanto, permitir acesso apenas ao próprio usuário
      return NextResponse.json({ error: "Acesso não autorizado a este agente" }, { status: 403 })
    }

    // Gerar ou usar conversationId existente
    const finalConversationId = conversationId || uuidv4()

    // Buscar ou criar conversa
    let conversation
    if (conversationId) {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single()
      
      conversation = existingConv
    }

    if (!conversation) {
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          id: finalConversationId,
          agent_id: agentId,
          user_id: session?.user?.id,
          visitor_id: visitorId,
          title: message.substring(0, 100),
          metadata: {
            userAgent: req.headers.get('user-agent'),
            ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            context
          }
        })
        .select()
        .single()

      if (convError) {
        console.error("Erro ao criar conversa:", convError)
        return NextResponse.json({ error: "Erro ao criar conversa" }, { status: 500 })
      }

      conversation = newConv
    }

    // Buscar mensagens anteriores da conversa
    const { data: previousMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", finalConversationId)
      .order("created_at", { ascending: true })
      .limit(10) // Últimas 10 mensagens para contexto

    // Salvar mensagem do usuário
    const userMessageId = uuidv4()
    const { error: userMsgError } = await supabase
      .from("messages")
      .insert({
        id: userMessageId,
        conversation_id: finalConversationId,
        content: message,
        role: "user",
        user_id: session?.user?.id,
        visitor_id: visitorId
      })

    if (userMsgError) {
      console.error("Erro ao salvar mensagem do usuário:", userMsgError)
      return NextResponse.json({ error: "Erro ao salvar mensagem" }, { status: 500 })
    }

    // Preparar contexto para IA
    let knowledgeContext = ""
    let searchSources: any[] = []
    
    if (useKnowledgeBase && agent.knowledge_bases) {
      try {
        // Buscar conhecimento relevante na base
        const searchUrl = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/knowledge`)
        searchUrl.searchParams.set('action', 'search')
        searchUrl.searchParams.set('query', message)
        searchUrl.searchParams.set('knowledgeBaseIds', agent.knowledge_bases.id)
        searchUrl.searchParams.set('limit', '5')

        const searchResponse = await fetch(searchUrl.toString(), {
          headers: {
            'Cookie': req.headers.get('cookie') || ''
          }
        })

        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          searchSources = searchData.results || []
          
          if (searchSources.length > 0) {
            knowledgeContext = `\n\nContexto relevante da base de conhecimento "${agent.knowledge_bases.name}":\n\n`
            searchSources.forEach((source, index) => {
              knowledgeContext += `${index + 1}. Fonte: ${source.documentName}\n${source.content}\n\n`
            })
            knowledgeContext += `\nUse essas informações como contexto para responder à pergunta do usuário.`
          }
        }
      } catch (searchError) {
        console.error("Erro ao buscar na base de conhecimento:", searchError)
        // Fallback para contexto simples
        knowledgeContext = `\nContexto da base de conhecimento "${agent.knowledge_bases.name}": ${agent.knowledge_bases.description || ""}`
      }
    }

    // Construir prompt do sistema
    const systemPrompt = `${agent.system_prompt || "Você é um assistente útil."}${knowledgeContext}

Instruções importantes:
- Responda sempre em português brasileiro
- Seja helpful, informativo e educado
- Use o contexto fornecido quando relevante
- Se não souber algo, admita e sugira onde buscar a informação`

    // Construir histórico de mensagens
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt }
    ]

    // Adicionar mensagens anteriores
    if (previousMessages) {
      previousMessages.forEach(msg => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })
      })
    }

    // Adicionar mensagem atual
    messages.push({ role: 'user', content: message })

    // Configurar parâmetros da IA
    const aiConfig = {
      model: agent.model_id || "gpt-3.5-turbo",
      temperature: temperature ?? agent.temperature ?? 0.7,
      max_tokens: maxTokens ?? agent.max_tokens ?? 1000,
    }

    if (streaming) {
      // Implementar streaming response
      const stream = await openai.chat.completions.create({
        ...aiConfig,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        stream: true,
      })

      // Configurar streaming response
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            let fullResponse = ""
            
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || ''
              if (content) {
                fullResponse += content
                
                // Enviar chunk para cliente
                const sseData = `data: ${JSON.stringify({ 
                  content, 
                  type: 'content',
                  messageId: uuidv4() 
                })}\n\n`
                
                controller.enqueue(encoder.encode(sseData))
              }
            }

            // Salvar resposta completa no banco
            const assistantMessageId = uuidv4()
            await supabase
              .from("messages")
              .insert({
                id: assistantMessageId,
                conversation_id: finalConversationId,
                content: fullResponse,
                role: "assistant",
                agent_id: agentId,
                metadata: {
                  model: aiConfig.model,
                  temperature: aiConfig.temperature,
                  tokens_used: fullResponse.length / 4 // Estimativa
                }
              })

            // Enviar dados finais
            const finalData = `data: ${JSON.stringify({
              type: 'done',
              messageId: assistantMessageId,
              conversationId: finalConversationId,
              visitorId
            })}\n\n`
            
            controller.enqueue(encoder.encode(finalData))
            controller.close()

          } catch (error) {
            console.error("Erro no streaming:", error)
            const errorData = `data: ${JSON.stringify({ 
              type: 'error', 
              error: 'Erro interno do servidor' 
            })}\n\n`
            controller.enqueue(encoder.encode(errorData))
            controller.close()
          }
        }
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })

    } else {
      // Resposta normal (não streaming)
      const completion = await openai.chat.completions.create({
        ...aiConfig,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
      })

      const assistantResponse = completion.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta."

      // Salvar resposta do assistente
      const assistantMessageId = uuidv4()
      const { error: assistantMsgError } = await supabase
        .from("messages")
        .insert({
          id: assistantMessageId,
          conversation_id: finalConversationId,
          content: assistantResponse,
          role: "assistant",
          agent_id: agentId,
          metadata: {
            model: aiConfig.model,
            temperature: aiConfig.temperature,
            usage: completion.usage
          }
        })

      if (assistantMsgError) {
        console.error("Erro ao salvar resposta do assistente:", assistantMsgError)
      }

      // Atualizar estatísticas do agente
      await supabase
        .from("agents")
        .update({
          query_count: (agent.query_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq("id", agentId)

      const response: ChatResponse = {
        answer: assistantResponse,
        messageId: assistantMessageId,
        conversationId: finalConversationId,
        visitorId,
        sources: searchSources.map(source => ({
          id: source.id,
          name: source.documentName,
          content: source.content,
          score: source.score,
          knowledgeBase: source.knowledgeBaseName
        })),
        metadata: {
          model: aiConfig.model,
          tokensUsed: completion.usage?.total_tokens,
          processingTime: Date.now(),
          sourcesFound: searchSources.length,
          knowledgeBaseUsed: agent.knowledge_bases?.name
        }
      }

      return NextResponse.json(response)
    }

  } catch (error: any) {
    console.error("Erro no chat:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" }, 
      { status: 500 }
    )
  }
}

// Endpoint para buscar histórico de conversa
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const agentId = params.id

    if (!conversationId) {
      return NextResponse.json({ error: "ID da conversa é obrigatório" }, { status: 400 })
    }

    const supabase = createClient()
    
    // Buscar mensagens da conversa
    const { data: messages, error } = await supabase
      .from("messages")
      .select(`
        *,
        agents (name, icon_url)
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Erro ao buscar mensagens:", error)
      return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 })
    }

    return NextResponse.json({
      conversationId,
      messages: messages || []
    })

  } catch (error: any) {
    console.error("Erro ao buscar conversa:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" }, 
      { status: 500 }
    )
  }
}