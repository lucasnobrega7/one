import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"
import { AgentCreateSchema, AgentUpdateSchema, UUIDSchema } from "@/lib/schemas"
import { z } from "zod"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const rawData = await req.json()
    
    // Validate request data
    try {
      const validatedData = AgentCreateSchema.parse({
        name: rawData.name,
        description: rawData.description,
        system_prompt: rawData.systemPrompt,
        model_id: rawData.modelId || 'gpt-3.5-turbo',
        temperature: rawData.temperature || 0.7,
        user_id: session.user.id,
        knowledge_base_id: rawData.knowledgeBaseId,
      })
      
      var data = validatedData
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ 
          error: "Dados inválidos", 
          details: validationError.errors 
        }, { status: 400 })
      }
      throw validationError
    }

    const supabase = createClient()
    const {
      name,
      description,
      system_prompt: systemPrompt,
      model_id: modelId,
      temperature,
      knowledge_base_id: knowledgeBaseId,
    } = data
    
    const {
      useKnowledgeBase,
      newKbName,
      newKbDescription,
    } = rawData

    let knowledgeBase = null

    // Se o usuário quer usar uma base de conhecimento
    if (useKnowledgeBase) {
      // Se selecionou uma base existente
      if (knowledgeBaseId) {
        const { data: existingKbs, error } = await supabase
          .from("knowledge_bases")
          .select("*")
          .eq("id", knowledgeBaseId)
          .single()

        if (error || !existingKbs) {
          return NextResponse.json({ error: "Base de conhecimento não encontrada" }, { status: 404 })
        }

        knowledgeBase = existingKbs
      }
      // Se está criando uma nova base
      else if (newKbName) {
        // Gerar um nome de índice único baseado no nome e timestamp
        const indexName = `${newKbName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

        const { data: newKb, error } = await supabase
          .from("knowledge_bases")
          .insert({
            id: uuidv4(),
            name: newKbName,
            description: newKbDescription,
            index_name: indexName,
            user_id: session.user.id,
          })
          .select()
          .single()

        if (error) {
          console.error("Erro ao criar base de conhecimento:", error)
          return NextResponse.json({ error: "Erro ao criar base de conhecimento" }, { status: 500 })
        }

        knowledgeBase = newKb
      }
    }

    // Criar o agente
    const { data: agent, error } = await supabase
      .from("agents")
      .insert({
        id: uuidv4(),
        name,
        description,
        system_prompt: systemPrompt,
        model_id: modelId,
        temperature,
        user_id: session.user.id,
        knowledge_base_id: knowledgeBase?.id || knowledgeBaseId,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar agente:", error)
      return NextResponse.json({ error: "Erro ao criar agente" }, { status: 500 })
    }

    return NextResponse.json(agent)
  } catch (error: any) {
    console.error("Erro ao criar agente:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { data: agentsList, error } = await supabase
      .from("agents")
      .select(`
        *,
        knowledge_bases (*)
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar agentes:", error)
      return NextResponse.json({ error: "Erro ao buscar agentes" }, { status: 500 })
    }

    return NextResponse.json(agentsList)
  } catch (error: any) {
    console.error("Erro ao buscar agentes:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const rawData = await req.json()
    
    // Validate ID
    try {
      UUIDSchema.parse(rawData.id)
    } catch {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }
    
    // Validate update data
    try {
      const validatedData = AgentUpdateSchema.parse({
        name: rawData.name,
        description: rawData.description,
        system_prompt: rawData.systemPrompt,
        model_id: rawData.modelId,
        temperature: rawData.temperature,
      })
      
      var data = validatedData
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ 
          error: "Dados inválidos", 
          details: validationError.errors 
        }, { status: 400 })
      }
      throw validationError
    }

    const supabase = createClient()
    const { 
      name, 
      description, 
      system_prompt: systemPrompt, 
      model_id: modelId, 
      temperature 
    } = data
    const id = rawData.id

    // Verificar se o agente pertence ao usuário
    const { data: existingAgent, error: checkError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingAgent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
    }

    // Atualizar o agente
    const { data: updatedAgent, error } = await supabase
      .from("agents")
      .update({
        name,
        description,
        system_prompt: systemPrompt,
        model_id: modelId,
        temperature,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
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
      return NextResponse.json({ error: "ID do agente não fornecido" }, { status: 400 })
    }

    // Validate ID
    try {
      UUIDSchema.parse(id)
    } catch {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Verificar se o agente pertence ao usuário
    const { data: existingAgent, error: checkError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingAgent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 })
    }

    // Deletar o agente
    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Erro ao deletar agente:", error)
      return NextResponse.json({ error: "Erro ao deletar agente" }, { status: 500 })
    }

    return NextResponse.json({ message: "Agente deletado com sucesso" })
  } catch (error: any) {
    console.error("Erro ao deletar agente:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}