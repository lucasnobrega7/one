import { NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const formData = await req.formData()
    const file = formData.get('file') as File
    const knowledgeBaseId = formData.get('knowledgeBaseId') as string

    if (!file) {
      return NextResponse.json({ error: "Arquivo não fornecido" }, { status: 400 })
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

    // Validar tipo de arquivo
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Tipo de arquivo não suportado. Use TXT, PDF ou DOCX." 
      }, { status: 400 })
    }

    // Validar tamanho do arquivo (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "Arquivo muito grande. Tamanho máximo: 10MB" 
      }, { status: 400 })
    }

    try {
      // Ler conteúdo do arquivo
      let content = ""
      
      if (file.type === 'text/plain') {
        content = await file.text()
      } else {
        // Para PDF e DOCX, vamos simular o processamento por enquanto
        // TODO: Implementar extração real de texto usando bibliotecas apropriadas
        content = `Conteúdo extraído do arquivo ${file.name} (${file.type}). 
        
        NOTA: Este é um placeholder. O processamento real de PDF/DOCX será implementado com bibliotecas especializadas como pdf-parse ou mammoth.js.
        
        Arquivo: ${file.name}
        Tamanho: ${(file.size / 1024).toFixed(2)} KB
        Tipo: ${file.type}`
      }

      // Salvar documento na base de conhecimento
      const { data: document, error: docError } = await supabase
        .from("documents")
        .insert({
          id: uuidv4(),
          knowledge_base_id: knowledgeBaseId,
          name: file.name,
          content: content,
          metadata: {
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          },
        })
        .select()
        .single()

      if (docError) {
        console.error("Erro ao salvar documento:", docError)
        return NextResponse.json({ error: "Erro ao salvar documento" }, { status: 500 })
      }

      // TODO: Processar documento para embeddings
      // Isso será feito quando integrarmos com o LlamaIndex RAG service

      return NextResponse.json({
        document,
        message: "Documento processado com sucesso"
      })

    } catch (fileError) {
      console.error("Erro ao processar arquivo:", fileError)
      return NextResponse.json({ error: "Erro ao processar arquivo" }, { status: 500 })
    }

  } catch (error: any) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const knowledgeBaseId = searchParams.get('knowledgeBaseId')

    if (!knowledgeBaseId) {
      return NextResponse.json({ error: "ID da base de conhecimento não fornecido" }, { status: 400 })
    }

    // Verificar se a base de conhecimento pertence ao usuário
    const { data: knowledgeBase, error: kbError } = await supabase
      .from("knowledge_bases")
      .select("*")
      .eq("id", knowledgeBaseId)
      .eq("user_id", session.user.id)
      .single()

    if (kbError || !knowledgeBase) {
      return NextResponse.json({ error: "Base de conhecimento não encontrada" }, { status: 404 })
    }

    // Buscar documentos da base de conhecimento
    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .eq("knowledge_base_id", knowledgeBaseId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar documentos:", error)
      return NextResponse.json({ error: "Erro ao buscar documentos" }, { status: 500 })
    }

    return NextResponse.json(documents)
  } catch (error: any) {
    console.error("Erro ao buscar documentos:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}