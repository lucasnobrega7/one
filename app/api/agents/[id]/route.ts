import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { data: agent, error } = await supabase
      .from("agents")
      .select(`
        *,
        knowledge_bases (*),
        user:users (id, name, email)
      `)
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (error || !agent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
    }

    return NextResponse.json(agent)
  } catch (error: any) {
    console.error("Erro ao buscar agente:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const data = await req.json()
    
    // Verificar se o agente pertence ao usuário
    const { data: existingAgent, error: checkError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingAgent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
    }

    // Atualizar apenas os campos fornecidos
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.systemPrompt !== undefined) updateData.system_prompt = data.systemPrompt
    if (data.modelId !== undefined) updateData.model_id = data.modelId
    if (data.temperature !== undefined) updateData.temperature = Number.parseFloat(data.temperature.toString())
    if (data.isActive !== undefined) updateData.is_active = data.isActive
    if (data.knowledgeBaseId !== undefined) updateData.knowledge_base_id = data.knowledgeBaseId

    const { data: updatedAgent, error } = await supabase
      .from("agents")
      .update(updateData)
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .select(`
        *,
        knowledge_bases (*),
        user:users (id, name, email)
      `)
      .single()

    if (error) {
      console.error("Erro ao atualizar agente:", error)
      return NextResponse.json({ error: "Erro ao atualizar agente" }, { status: 500 })
    }

    return NextResponse.json(updatedAgent)
  } catch (error: any) {
    console.error("Erro ao atualizar agente:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    
    // Verificar se o agente pertence ao usuário
    const { data: existingAgent, error: checkError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingAgent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
    }

    // Deletar o agente (cascata removerá conversas e mensagens relacionadas)
    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", params.id)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Erro ao deletar agente:", error)
      return NextResponse.json({ error: "Erro ao deletar agente" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Agente deletado com sucesso",
      deletedAgentId: params.id 
    })
  } catch (error: any) {
    console.error("Erro ao deletar agente:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}