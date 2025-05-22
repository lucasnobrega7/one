import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/user-context"
import { supabase } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar bases de conhecimento existentes
    const { data: existingBases, error } = await supabase.from("knowledge_bases").select()

    if (error) {
      console.error("Erro ao buscar bases de conhecimento:", error)
      return NextResponse.json({ error: "Erro ao buscar bases de conhecimento" }, { status: 500 })
    }

    // Se não houver bases de conhecimento, criar uma padrão
    if (existingBases.length === 0) {
      const { data: defaultBase, error: insertError } = await supabase
        .from("knowledge_bases")
        .insert({
          id: uuidv4(),
          name: "Base de Conhecimento Padrão",
          description: "Base de conhecimento padrão usando o índice agentesdeconversao",
          index_name: "agentesdeconversao",
        })
        .select()
        .single()

      if (insertError) {
        console.error("Erro ao criar base de conhecimento padrão:", insertError)
        return NextResponse.json({ error: "Erro ao criar base de conhecimento padrão" }, { status: 500 })
      }

      return NextResponse.json([defaultBase])
    }

    return NextResponse.json(existingBases)
  } catch (error: any) {
    console.error("Erro ao buscar bases de conhecimento:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Nome não fornecido" }, { status: 400 })
    }

    // Usar o índice existente para todas as bases de conhecimento
    const indexName = "agentesdeconversao"

    const { data: knowledgeBase, error } = await supabase
      .from("knowledge_bases")
      .insert({
        id: uuidv4(),
        name,
        description,
        index_name: indexName,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar base de conhecimento:", error)
      return NextResponse.json({ error: "Erro ao criar base de conhecimento" }, { status: 500 })
    }

    return NextResponse.json(knowledgeBase)
  } catch (error: any) {
    console.error("Erro ao criar base de conhecimento:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
