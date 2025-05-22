import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/db"
import { getServerSession } from "@/lib/user-context"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const data = await req.json()
    const {
      name,
      description,
      systemPrompt,
      modelId,
      temperature,
      useKnowledgeBase,
      knowledgeBaseId,
      newKbName,
      newKbDescription,
    } = data

    let knowledgeBase = null

    // Se o usuário quer usar uma base de conhecimento
    if (useKnowledgeBase) {
      // Se selecionou uma base existente
      if (knowledgeBaseId) {
        const { data: existingKbs, error } = await supabase
          .from("knowledge_bases")
          .select()
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
        temperature: Number.parseFloat(temperature.toString()),
        user_id: session.user.id,
        knowledge_base_id: knowledgeBase?.id,
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
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

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
