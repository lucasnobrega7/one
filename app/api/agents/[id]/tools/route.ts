import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

interface AgentTool {
  id?: string;
  type: 'http' | 'form' | 'lead_capture' | 'search' | 'calculator' | 'webhook';
  name: string;
  description?: string;
  config: Record<string, any>;
  is_active?: boolean;
}

export async function GET(
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

    // Verificar se o agente pertence ao usuário
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .eq("user_id", session.user.id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
    }

    // Buscar ferramentas do agente
    const { data: tools, error } = await supabase
      .from("agent_tools")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Erro ao buscar ferramentas" }, { status: 500 })
    }

    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name,
      },
      tools: tools || [],
      available_types: [
        {
          type: 'http',
          name: 'API HTTP',
          description: 'Integração com APIs externas',
          fields: [
            { name: 'url', type: 'text', required: true, label: 'URL da API' },
            { name: 'method', type: 'select', required: true, label: 'Método HTTP', options: ['GET', 'POST', 'PUT', 'DELETE'] },
            { name: 'headers', type: 'json', required: false, label: 'Headers' },
            { name: 'auth_type', type: 'select', required: false, label: 'Autenticação', options: ['none', 'bearer', 'basic'] },
            { name: 'auth_token', type: 'password', required: false, label: 'Token de Autenticação' },
          ]
        },
        {
          type: 'search',
          name: 'Busca Web',
          description: 'Permite ao agente buscar informações na internet',
          fields: [
            { name: 'search_engine', type: 'select', required: true, label: 'Motor de Busca', options: ['google', 'bing', 'duckduckgo'] },
            { name: 'max_results', type: 'number', required: false, label: 'Máximo de Resultados' },
            { name: 'safe_search', type: 'boolean', required: false, label: 'Busca Segura' },
          ]
        },
        {
          type: 'calculator',
          name: 'Calculadora',
          description: 'Permite ao agente realizar cálculos matemáticos',
          fields: [
            { name: 'precision', type: 'number', required: false, label: 'Precisão Decimal' },
            { name: 'allow_functions', type: 'boolean', required: false, label: 'Permitir Funções Avançadas' },
          ]
        },
        {
          type: 'lead_capture',
          name: 'Captura de Leads',
          description: 'Coleta informações de contato dos usuários',
          fields: [
            { name: 'required_fields', type: 'multiselect', required: true, label: 'Campos Obrigatórios', options: ['name', 'email', 'phone', 'company'] },
            { name: 'optional_fields', type: 'multiselect', required: false, label: 'Campos Opcionais', options: ['address', 'website', 'notes'] },
            { name: 'webhook_url', type: 'text', required: false, label: 'URL do Webhook para envio' },
          ]
        },
        {
          type: 'form',
          name: 'Formulário Customizado',
          description: 'Cria formulários dinâmicos para coleta de dados',
          fields: [
            { name: 'form_fields', type: 'json', required: true, label: 'Campos do Formulário' },
            { name: 'submit_url', type: 'text', required: false, label: 'URL de Envio' },
            { name: 'success_message', type: 'text', required: false, label: 'Mensagem de Sucesso' },
          ]
        },
        {
          type: 'webhook',
          name: 'Webhook',
          description: 'Envia dados para URLs externas',
          fields: [
            { name: 'url', type: 'text', required: true, label: 'URL do Webhook' },
            { name: 'method', type: 'select', required: true, label: 'Método HTTP', options: ['POST', 'PUT'] },
            { name: 'headers', type: 'json', required: false, label: 'Headers' },
            { name: 'payload_template', type: 'textarea', required: false, label: 'Template do Payload' },
          ]
        }
      ]
    })

  } catch (error: any) {
    console.error("Erro ao buscar ferramentas:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
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
    const toolData: AgentTool = await req.json()

    // Verificar se o agente pertence ao usuário
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .eq("user_id", session.user.id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
    }

    // Validar dados da ferramenta
    if (!toolData.type || !toolData.name || !toolData.config) {
      return NextResponse.json({ 
        error: "Tipo, nome e configuração são obrigatórios" 
      }, { status: 400 })
    }

    // Validar configuração específica por tipo
    const validationResult = validateToolConfig(toolData.type, toolData.config)
    if (!validationResult.valid) {
      return NextResponse.json({ 
        error: `Configuração inválida: ${validationResult.error}` 
      }, { status: 400 })
    }

    // Criar ferramenta
    const { data: tool, error } = await supabase
      .from("agent_tools")
      .insert({
        id: uuidv4(),
        agent_id: agentId,
        type: toolData.type,
        name: toolData.name,
        description: toolData.description,
        config: toolData.config,
        is_active: toolData.is_active !== false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar ferramenta:", error)
      return NextResponse.json({ error: "Erro ao criar ferramenta" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Ferramenta criada com sucesso",
      tool
    }, { status: 201 })

  } catch (error: any) {
    console.error("Erro ao criar ferramenta:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(
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
    const { toolId, ...updates } = await req.json()

    if (!toolId) {
      return NextResponse.json({ error: "ID da ferramenta não fornecido" }, { status: 400 })
    }

    // Verificar se a ferramenta pertence ao agente do usuário
    const { data: tool, error: toolError } = await supabase
      .from("agent_tools")
      .select("*, agents!inner(user_id)")
      .eq("id", toolId)
      .eq("agent_id", agentId)
      .single()

    if (toolError || !tool || tool.agents.user_id !== session.user.id) {
      return NextResponse.json({ error: "Ferramenta não encontrada" }, { status: 404 })
    }

    // Atualizar ferramenta
    const { data: updatedTool, error } = await supabase
      .from("agent_tools")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", toolId)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar ferramenta:", error)
      return NextResponse.json({ error: "Erro ao atualizar ferramenta" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Ferramenta atualizada com sucesso",
      tool: updatedTool
    })

  } catch (error: any) {
    console.error("Erro ao atualizar ferramenta:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(
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
    const { searchParams } = new URL(req.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json({ error: "ID da ferramenta não fornecido" }, { status: 400 })
    }

    // Verificar se a ferramenta pertence ao agente do usuário
    const { data: tool, error: toolError } = await supabase
      .from("agent_tools")
      .select("*, agents!inner(user_id)")
      .eq("id", toolId)
      .eq("agent_id", agentId)
      .single()

    if (toolError || !tool || tool.agents.user_id !== session.user.id) {
      return NextResponse.json({ error: "Ferramenta não encontrada" }, { status: 404 })
    }

    // Deletar ferramenta
    const { error } = await supabase
      .from("agent_tools")
      .delete()
      .eq("id", toolId)

    if (error) {
      console.error("Erro ao deletar ferramenta:", error)
      return NextResponse.json({ error: "Erro ao deletar ferramenta" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Ferramenta deletada com sucesso"
    })

  } catch (error: any) {
    console.error("Erro ao deletar ferramenta:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

// Função para validar configuração das ferramentas
function validateToolConfig(type: string, config: Record<string, any>): { valid: boolean; error?: string } {
  switch (type) {
    case 'http':
      if (!config.url) return { valid: false, error: 'URL é obrigatória' }
      if (!config.method) return { valid: false, error: 'Método HTTP é obrigatório' }
      try {
        new URL(config.url)
      } catch {
        return { valid: false, error: 'URL inválida' }
      }
      break

    case 'search':
      if (!config.search_engine) return { valid: false, error: 'Motor de busca é obrigatório' }
      if (!['google', 'bing', 'duckduckgo'].includes(config.search_engine)) {
        return { valid: false, error: 'Motor de busca inválido' }
      }
      break

    case 'lead_capture':
      if (!config.required_fields || !Array.isArray(config.required_fields)) {
        return { valid: false, error: 'Campos obrigatórios devem ser um array' }
      }
      if (config.required_fields.length === 0) {
        return { valid: false, error: 'Pelo menos um campo obrigatório deve ser especificado' }
      }
      break

    case 'webhook':
      if (!config.url) return { valid: false, error: 'URL do webhook é obrigatória' }
      if (!config.method) return { valid: false, error: 'Método HTTP é obrigatório' }
      try {
        new URL(config.url)
      } catch {
        return { valid: false, error: 'URL do webhook inválida' }
      }
      break
  }

  return { valid: true }
}