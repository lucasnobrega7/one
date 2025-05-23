import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()

    // Buscar todos os webhooks do usuário
    const { data: webhooks, error } = await supabase
      .from("webhooks")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Erro ao buscar webhooks" }, { status: 500 })
    }

    return NextResponse.json(webhooks || [])

  } catch (error: any) {
    console.error("Erro ao buscar webhooks:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { name, url, events, secret, isActive = true } = await req.json()

    if (!name || !url || !events) {
      return NextResponse.json({ 
        error: "Nome, URL e eventos são obrigatórios" 
      }, { status: 400 })
    }

    // Validar URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 })
    }

    // Validar eventos
    const validEvents = [
      'conversation.created',
      'conversation.updated',
      'message.created',
      'agent.created',
      'agent.updated',
      'agent.deleted',
      'knowledge_base.updated'
    ]

    const invalidEvents = events.filter((event: string) => !validEvents.includes(event))
    if (invalidEvents.length > 0) {
      return NextResponse.json({ 
        error: `Eventos inválidos: ${invalidEvents.join(', ')}` 
      }, { status: 400 })
    }

    // Gerar secret se não fornecido
    const webhookSecret = secret || crypto.randomBytes(32).toString('hex')

    // Criar webhook
    const { data: webhook, error: createError } = await supabase
      .from("webhooks")
      .insert({
        id: uuidv4(),
        user_id: session.user.id,
        name,
        url,
        events,
        secret: webhookSecret,
        is_active: isActive,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error("Erro ao criar webhook:", createError)
      return NextResponse.json({ error: "Erro ao criar webhook" }, { status: 500 })
    }

    return NextResponse.json(webhook, { status: 201 })

  } catch (error: any) {
    console.error("Erro ao criar webhook:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { id, name, url, events, secret, isActive } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "ID do webhook não fornecido" }, { status: 400 })
    }

    // Verificar se o webhook pertence ao usuário
    const { data: existingWebhook, error: checkError } = await supabase
      .from("webhooks")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingWebhook) {
      return NextResponse.json({ error: "Webhook não encontrado" }, { status: 404 })
    }

    // Preparar dados para atualização
    const updateData: any = { updated_at: new Date().toISOString() }

    if (name !== undefined) updateData.name = name
    if (url !== undefined) {
      try {
        new URL(url)
        updateData.url = url
      } catch {
        return NextResponse.json({ error: "URL inválida" }, { status: 400 })
      }
    }
    if (events !== undefined) updateData.events = events
    if (secret !== undefined) updateData.secret = secret
    if (isActive !== undefined) updateData.is_active = isActive

    // Atualizar webhook
    const { data: updatedWebhook, error: updateError } = await supabase
      .from("webhooks")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (updateError) {
      console.error("Erro ao atualizar webhook:", updateError)
      return NextResponse.json({ error: "Erro ao atualizar webhook" }, { status: 500 })
    }

    return NextResponse.json(updatedWebhook)

  } catch (error: any) {
    console.error("Erro ao atualizar webhook:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "ID do webhook não fornecido" }, { status: 400 })
    }

    // Verificar se o webhook pertence ao usuário
    const { data: existingWebhook, error: checkError } = await supabase
      .from("webhooks")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingWebhook) {
      return NextResponse.json({ error: "Webhook não encontrado" }, { status: 404 })
    }

    // Deletar webhook
    const { error: deleteError } = await supabase
      .from("webhooks")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id)

    if (deleteError) {
      console.error("Erro ao deletar webhook:", deleteError)
      return NextResponse.json({ error: "Erro ao deletar webhook" }, { status: 500 })
    }

    return NextResponse.json({ message: "Webhook deletado com sucesso" })

  } catch (error: any) {
    console.error("Erro ao deletar webhook:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

// Função auxiliar para disparar webhooks (pode ser chamada de outros endpoints)
export async function triggerWebhook(
  userId: string,
  eventType: string,
  payload: any,
  supabase: any
) {
  try {
    // Buscar webhooks ativos que escutam este evento
    const { data: webhooks, error } = await supabase
      .from("webhooks")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .contains("events", [eventType])

    if (error || !webhooks || webhooks.length === 0) {
      return
    }

    // Disparar webhooks em paralelo
    const webhookPromises = webhooks.map(async (webhook: any) => {
      try {
        const body = JSON.stringify({
          event: eventType,
          timestamp: new Date().toISOString(),
          data: payload
        })

        // Gerar assinatura
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(body)
          .digest('hex')

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'User-Agent': 'Agentes-de-Conversao-Webhook/1.0'
          },
          body
        })

        // Registrar resultado
        await supabase
          .from("webhook_deliveries")
          .insert({
            webhook_id: webhook.id,
            event_type: eventType,
            payload: payload,
            status_code: response.status,
            response_body: await response.text().catch(() => ''),
            delivered_at: new Date().toISOString()
          })

      } catch (error) {
        console.error(`Erro ao disparar webhook ${webhook.id}:`, error)
        
        // Registrar falha
        await supabase
          .from("webhook_deliveries")
          .insert({
            webhook_id: webhook.id,
            event_type: eventType,
            payload: payload,
            status_code: 0,
            response_body: error instanceof Error ? error.message : 'Unknown error',
            delivered_at: new Date().toISOString()
          })
      }
    })

    await Promise.allSettled(webhookPromises)

  } catch (error) {
    console.error("Erro ao processar webhooks:", error)
  }
}