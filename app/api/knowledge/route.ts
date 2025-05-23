import { NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const supabase = createClient()

    // Busca semântica nos documentos
    if (action === 'search') {
      const query = searchParams.get('query')
      const knowledgeBaseIds = searchParams.get('knowledgeBaseIds')?.split(',')
      const limit = parseInt(searchParams.get('limit') || '10')

      if (!query) {
        return NextResponse.json({ error: "Query é obrigatória para busca" }, { status: 400 })
      }

      // Buscar documentos com busca textual (preparado para embeddings futuros)
      let searchQuery = supabase
        .from('documents')
        .select(`
          id,
          name,
          content,
          metadata,
          knowledge_bases!inner (
            id,
            name,
            user_id
          )
        `)
        .eq('knowledge_bases.user_id', session.user.id)
        .textSearch('content', query)
        .limit(limit)

      if (knowledgeBaseIds && knowledgeBaseIds.length > 0) {
        searchQuery = searchQuery.in('knowledge_base_id', knowledgeBaseIds)
      }

      const { data: documents, error } = await searchQuery

      if (error) {
        console.error("Erro na busca:", error)
        return NextResponse.json({ error: "Erro na busca" }, { status: 500 })
      }

      // Processar resultados para formato padronizado
      const searchResults = (documents || []).map(doc => ({
        id: doc.id,
        content: doc.content.substring(0, 500) + '...', // Resumo
        documentName: doc.name,
        knowledgeBaseName: doc.knowledge_bases.name,
        score: 0.8, // Score simulado - implementar com pgvector
        metadata: doc.metadata,
        source: `${doc.knowledge_bases.name}/${doc.name}`
      }))

      return NextResponse.json({
        query,
        results: searchResults,
        totalResults: searchResults.length,
        searchTime: Date.now() - Date.now() // Placeholder
      })
    }

    // Buscar bases de conhecimento do usuário
    const { data: knowledgeBases, error } = await supabase
      .from("knowledge_bases")
      .select(`
        *,
        documents (*)
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar bases de conhecimento:", error)
      return NextResponse.json({ error: "Erro ao buscar bases de conhecimento" }, { status: 500 })
    }

    // Se não houver bases de conhecimento, criar uma padrão
    if (knowledgeBases.length === 0) {
      const { data: defaultBase, error: insertError } = await supabase
        .from("knowledge_bases")
        .insert({
          id: uuidv4(),
          name: "Base de Conhecimento Padrão",
          description: "Base de conhecimento padrão para seus agentes",
          index_name: `kb-${session.user.id}-${Date.now()}`,
          user_id: session.user.id,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Erro ao criar base de conhecimento padrão:", insertError)
        return NextResponse.json({ error: "Erro ao criar base de conhecimento padrão" }, { status: 500 })
      }

      return NextResponse.json([{ ...defaultBase, documents: [] }])
    }

    // Processar estatísticas das knowledge bases
    const processedBases = knowledgeBases.map(kb => ({
      ...kb,
      stats: {
        documentCount: kb.documents?.length || 0,
        totalSize: kb.documents?.reduce((sum, doc) => 
          sum + (doc.metadata?.size || 0), 0) || 0,
        lastUpdated: kb.documents?.length > 0 
          ? Math.max(...kb.documents.map(d => new Date(d.created_at).getTime()))
          : new Date(kb.created_at).getTime()
      }
    }))

    return NextResponse.json(processedBases)
  } catch (error: any) {
    console.error("Erro ao buscar bases de conhecimento:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Nome não fornecido" }, { status: 400 })
    }

    // Gerar um nome de índice único
    const indexName = `kb-${session.user.id}-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

    const { data: knowledgeBase, error } = await supabase
      .from("knowledge_bases")
      .insert({
        id: uuidv4(),
        name,
        description,
        index_name: indexName,
        user_id: session.user.id,
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

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { id, name, description } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 })
    }

    // Verificar se a base de conhecimento pertence ao usuário
    const { data: existingKb, error: checkError } = await supabase
      .from("knowledge_bases")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingKb) {
      return NextResponse.json({ error: "Base de conhecimento não encontrada" }, { status: 404 })
    }

    // Atualizar a base de conhecimento
    const { data: updatedKb, error } = await supabase
      .from("knowledge_bases")
      .update({
        name,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar base de conhecimento:", error)
      return NextResponse.json({ error: "Erro ao atualizar base de conhecimento" }, { status: 500 })
    }

    return NextResponse.json(updatedKb)
  } catch (error: any) {
    console.error("Erro ao atualizar base de conhecimento:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 })
    }

    // Verificar se a base de conhecimento pertence ao usuário
    const { data: existingKb, error: checkError } = await supabase
      .from("knowledge_bases")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingKb) {
      return NextResponse.json({ error: "Base de conhecimento não encontrada" }, { status: 404 })
    }

    // Deletar a base de conhecimento (cascading vai deletar documentos)
    const { error } = await supabase
      .from("knowledge_bases")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Erro ao deletar base de conhecimento:", error)
      return NextResponse.json({ error: "Erro ao deletar base de conhecimento" }, { status: 500 })
    }

    return NextResponse.json({ message: "Base de conhecimento deletada com sucesso" })
  } catch (error: any) {
    console.error("Erro ao deletar base de conhecimento:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}