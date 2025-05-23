import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { query, knowledgeBaseId, topK = 5, threshold = 0.7 } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Query não fornecida" }, { status: 400 })
    }

    if (!knowledgeBaseId) {
      return NextResponse.json({ error: "ID da base de conhecimento não fornecido" }, { status: 400 })
    }

    // Verificar se a base de conhecimento existe e pertence ao usuário
    const { data: knowledgeBase, error: kbError } = await supabase
      .from("knowledge_bases")
      .select("*")
      .eq("id", knowledgeBaseId)
      .eq("user_id", session.user.id)
      .single()

    if (kbError || !knowledgeBase) {
      return NextResponse.json({ error: "Base de conhecimento não encontrada" }, { status: 404 })
    }

    // Por enquanto, vamos fazer uma busca textual simples
    // TODO: Implementar busca por embeddings/similarity search
    const { data: documents, error: docsError } = await supabase
      .from("documents")
      .select("*")
      .eq("knowledge_base_id", knowledgeBaseId)
      .textSearch("content", query)
      .limit(topK)

    if (docsError) {
      console.error("Erro na busca de documentos:", docsError)
      // Fallback para busca simples caso textSearch não funcione
      const { data: fallbackDocs, error: fallbackError } = await supabase
        .from("documents")
        .select("*")
        .eq("knowledge_base_id", knowledgeBaseId)
        .ilike("content", `%${query}%`)
        .limit(topK)

      if (fallbackError) {
        return NextResponse.json({ error: "Erro na busca" }, { status: 500 })
      }

      return NextResponse.json({
        results: fallbackDocs?.map(doc => ({
          id: doc.id,
          name: doc.name,
          content: doc.content,
          score: 0.8, // Score simulado
          metadata: doc.metadata,
          relevantChunk: extractRelevantChunk(doc.content, query)
        })) || [],
        query,
        totalResults: fallbackDocs?.length || 0
      })
    }

    // Processar resultados e calcular relevância
    const results = documents?.map(doc => ({
      id: doc.id,
      name: doc.name,
      content: doc.content,
      score: calculateSimpleScore(doc.content, query),
      metadata: doc.metadata,
      relevantChunk: extractRelevantChunk(doc.content, query)
    })).filter(result => result.score >= threshold) || []

    // Ordenar por score
    results.sort((a, b) => b.score - a.score)

    return NextResponse.json({
      results: results.slice(0, topK),
      query,
      totalResults: results.length
    })

  } catch (error: any) {
    console.error("Erro na busca semântica:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

function calculateSimpleScore(content: string, query: string): number {
  // Score simples baseado na frequência de termos
  const queryTerms = query.toLowerCase().split(/\s+/)
  const contentLower = content.toLowerCase()
  
  let matches = 0
  let totalTerms = queryTerms.length
  
  queryTerms.forEach(term => {
    if (contentLower.includes(term)) {
      matches++
    }
  })
  
  return matches / totalTerms
}

function extractRelevantChunk(content: string, query: string, chunkSize: number = 200): string {
  // Encontrar o primeiro trecho relevante do conteúdo
  const queryTerms = query.toLowerCase().split(/\s+/)
  const contentLower = content.toLowerCase()
  
  for (const term of queryTerms) {
    const index = contentLower.indexOf(term)
    if (index !== -1) {
      const start = Math.max(0, index - chunkSize / 2)
      const end = Math.min(content.length, index + chunkSize / 2)
      
      let chunk = content.substring(start, end)
      
      // Adicionar reticências se necessário
      if (start > 0) chunk = "..." + chunk
      if (end < content.length) chunk = chunk + "..."
      
      return chunk
    }
  }
  
  // Se não encontrar termos específicos, retornar o início
  return content.substring(0, chunkSize) + (content.length > chunkSize ? "..." : "")
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const knowledgeBaseId = searchParams.get('knowledgeBaseId')

    if (!knowledgeBaseId) {
      return NextResponse.json({ error: "ID da base de conhecimento não fornecido" }, { status: 400 })
    }

    const supabase = createClient()

    // Verificar se a base de conhecimento existe e pertence ao usuário
    const { data: knowledgeBase, error: kbError } = await supabase
      .from("knowledge_bases")
      .select("*")
      .eq("id", knowledgeBaseId)
      .eq("user_id", session.user.id)
      .single()

    if (kbError || !knowledgeBase) {
      return NextResponse.json({ error: "Base de conhecimento não encontrada" }, { status: 404 })
    }

    // Retornar estatísticas da base de conhecimento
    const { data: documents, error: docsError } = await supabase
      .from("documents")
      .select("id, name, metadata, created_at")
      .eq("knowledge_base_id", knowledgeBaseId)

    if (docsError) {
      return NextResponse.json({ error: "Erro ao buscar documentos" }, { status: 500 })
    }

    return NextResponse.json({
      knowledgeBase,
      documentCount: documents?.length || 0,
      documents: documents || []
    })

  } catch (error: any) {
    console.error("Erro ao buscar informações da base de conhecimento:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}