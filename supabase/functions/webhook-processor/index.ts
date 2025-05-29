// Supabase Edge Function para processar webhooks
// Triggered by database events and forwards to N8N/FastAPI

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: any
  old_record?: any
  schema: string
}

interface N8NWorkflow {
  id: string
  workflow_id: string
  name: string
  webhook_url: string
  event_types: string[]
  is_active: boolean
}

// Configuração
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const API_BASE_URL = Deno.env.get('API_BASE_URL') || 'https://api.agentesdeconversao.com.br'
const N8N_BASE_URL = Deno.env.get('N8N_WEBHOOK_URL') || 'https://primary-em-atividade.up.railway.app'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Mapeamento de eventos da database para tipos de webhook
const EVENT_MAPPING: Record<string, string> = {
  'users_INSERT': 'user.registered',
  'agents_INSERT': 'agent.created',
  'conversations_INSERT': 'conversation.created',
  'messages_INSERT': 'conversation.message.added',
  'external_integrations_INSERT': 'integration.connected',
  'external_integrations_UPDATE': 'integration.updated'
}

// Função para determinar o tipo de evento baseado na tabela e operação
function getEventType(table: string, type: string, record: any): string | null {
  const key = `${table}_${type}`
  
  // Casos especiais
  if (table === 'external_integrations' && type === 'INSERT') {
    if (record.integration_type === 'whatsapp') {
      return 'integration.whatsapp.connected'
    } else if (record.integration_type === 'openai') {
      return 'integration.openai.connected'
    }
    return 'integration.connected'
  }
  
  if (table === 'user_onboarding_status' && type === 'UPDATE') {
    if (record.onboarding_completed === true) {
      return 'onboarding.completed'
    }
    return 'onboarding.step.completed'
  }
  
  return EVENT_MAPPING[key] || null
}

// Função para enviar webhook para N8N
async function sendToN8N(eventType: string, data: any): Promise<boolean> {
  try {
    // Buscar workflows ativas para este tipo de evento
    const { data: workflows, error } = await supabase
      .from('n8n_workflows')
      .select('*')
      .eq('is_active', true)
      .contains('event_types', [eventType])

    if (error) {
      console.error('Erro ao buscar workflows N8N:', error)
      return false
    }

    if (!workflows || workflows.length === 0) {
      console.log(`Nenhuma workflow N8N encontrada para evento: ${eventType}`)
      return true // Não é erro, apenas não há workflows configuradas
    }

    // Enviar para cada workflow
    const promises = workflows.map(async (workflow: N8NWorkflow) => {
      try {
        const payload = {
          event: eventType,
          timestamp: new Date().toISOString(),
          data: data
        }

        console.log(`Enviando para N8N workflow: ${workflow.name} (${workflow.webhook_url})`)

        const response = await fetch(workflow.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Supabase-EdgeFunction/1.0'
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`)
        }

        // Atualizar estatísticas de sucesso
        await supabase
          .from('n8n_workflows')
          .update({
            last_triggered: new Date().toISOString(),
            success_count: workflow.success_count + 1
          })
          .eq('id', workflow.id)

        console.log(`Webhook enviado com sucesso para ${workflow.name}`)
        return true

      } catch (error) {
        console.error(`Erro ao enviar webhook para ${workflow.name}:`, error)
        
        // Atualizar estatísticas de falha
        await supabase
          .from('n8n_workflows')
          .update({
            failure_count: workflow.failure_count + 1
          })
          .eq('id', workflow.id)

        return false
      }
    })

    const results = await Promise.all(promises)
    return results.some(result => result) // Sucesso se pelo menos um webhook foi enviado

  } catch (error) {
    console.error('Erro geral ao enviar para N8N:', error)
    return false
  }
}

// Função para enviar webhook para API FastAPI
async function sendToFastAPI(eventType: string, data: any): Promise<boolean> {
  try {
    const payload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data: data
    }

    console.log(`Enviando webhook para FastAPI: ${API_BASE_URL}/api/webhooks/incoming/supabase`)

    const response = await fetch(`${API_BASE_URL}/api/webhooks/incoming/supabase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Supabase-EdgeFunction/1.0'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    console.log('Webhook enviado com sucesso para FastAPI')
    return true

  } catch (error) {
    console.error('Erro ao enviar webhook para FastAPI:', error)
    return false
  }
}

// Função para criar evento de webhook no banco
async function createWebhookEvent(
  eventType: string,
  tableName: string,
  recordId: string,
  userId: string | null,
  data: any
): Promise<string | null> {
  try {
    const eventData = {
      event_type: eventType,
      event_source: 'supabase',
      table_name: tableName,
      record_id: recordId,
      user_id: userId,
      data: data,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const { data: event, error } = await supabase
      .from('webhook_events')
      .insert(eventData)
      .select('id')
      .single()

    if (error) {
      console.error('Erro ao criar evento de webhook:', error)
      return null
    }

    return event.id

  } catch (error) {
    console.error('Erro ao criar evento de webhook:', error)
    return null
  }
}

// Função para atualizar status do evento
async function updateEventStatus(
  eventId: string,
  status: 'processing' | 'completed' | 'failed',
  errorMessage?: string
): Promise<void> {
  try {
    const updateData: any = {
      status,
      processed_at: new Date().toISOString()
    }

    if (errorMessage) {
      updateData.error_message = errorMessage
    }

    await supabase
      .from('webhook_events')
      .update(updateData)
      .eq('id', eventId)

  } catch (error) {
    console.error('Erro ao atualizar status do evento:', error)
  }
}

// Função para processar payload do webhook
async function processWebhookPayload(payload: WebhookPayload): Promise<void> {
  const { type, table, record, schema } = payload
  
  // Determinar tipo de evento
  const eventType = getEventType(table, type, record)
  if (!eventType) {
    console.log(`Evento ignorado: ${table}_${type}`)
    return
  }

  // Extrair user_id do record
  const userId = record.user_id || record.id || null

  // Criar evento no banco
  const eventId = await createWebhookEvent(
    eventType,
    table,
    record.id,
    userId,
    record
  )

  if (!eventId) {
    console.error('Falha ao criar evento de webhook')
    return
  }

  // Atualizar status para processando
  await updateEventStatus(eventId, 'processing')

  try {
    // Preparar dados do webhook
    const webhookData = {
      event_id: eventId,
      table: table,
      type: type,
      record: record,
      user_id: userId
    }

    // Enviar para N8N e FastAPI em paralelo
    const [n8nSuccess, fastApiSuccess] = await Promise.all([
      sendToN8N(eventType, webhookData),
      sendToFastAPI(eventType, webhookData)
    ])

    // Determinar status final
    if (n8nSuccess || fastApiSuccess) {
      await updateEventStatus(eventId, 'completed')
      console.log(`Evento processado com sucesso: ${eventType} (${eventId})`)
    } else {
      await updateEventStatus(eventId, 'failed', 'Falha ao enviar para todos os destinos')
      console.error(`Falha ao processar evento: ${eventType} (${eventId})`)
    }

  } catch (error) {
    await updateEventStatus(eventId, 'failed', error.message)
    console.error(`Erro ao processar webhook: ${error.message}`)
  }
}

// Função para criar notificação do sistema
async function createSystemNotification(
  userId: string,
  type: 'success' | 'info' | 'warning' | 'error',
  title: string,
  message: string,
  actionUrl?: string
): Promise<void> {
  try {
    await supabase
      .from('system_notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        action_url: actionUrl,
        created_at: new Date().toISOString()
      })
    
    console.log(`Notificação criada para usuário ${userId}: ${title}`)

  } catch (error) {
    console.error('Erro ao criar notificação:', error)
  }
}

// Handler principal da Edge Function
serve(async (req) => {
  // Tratar CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse do payload
    const payload: WebhookPayload = await req.json()
    
    console.log('Webhook recebido:', {
      type: payload.type,
      table: payload.table,
      recordId: payload.record?.id
    })

    // Processar webhook em background (não bloquear resposta)
    processWebhookPayload(payload).catch(error => {
      console.error('Erro no processamento em background:', error)
    })

    // Responder imediatamente
    return new Response(
      JSON.stringify({
        status: 'received',
        message: 'Webhook aceito para processamento'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Erro na Edge Function:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Erro interno',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Casos específicos de processamento
async function handleUserRegistration(record: any): Promise<void> {
  if (record.id) {
    await createSystemNotification(
      record.id,
      'success',
      '🎉 Bem-vindo!',
      'Sua conta foi criada com sucesso. Vamos começar a configurar seu agente.',
      '/onboarding'
    )
  }
}

async function handleAgentCreation(record: any): Promise<void> {
  if (record.user_id) {
    await createSystemNotification(
      record.user_id,
      'success',
      '🤖 Agente Criado',
      `Seu agente "${record.name}" foi criado com sucesso!`,
      `/agents/${record.id}`
    )
  }
}

async function handleOnboardingCompletion(record: any): Promise<void> {
  if (record.user_id) {
    await createSystemNotification(
      record.user_id,
      'success',
      '🚀 Parabéns!',
      'Você completou o onboarding! Seu agente está pronto para uso.',
      '/dashboard'
    )
  }
}