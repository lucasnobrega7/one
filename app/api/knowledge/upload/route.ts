import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/user-context"
import { supabase } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const knowledgeBaseId = formData.get("knowledgeBaseId") as string

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    if (!knowledgeBaseId) {
      return NextResponse.json({ error: "ID da base de conhecimento não fornecido" }, { status: 400 })
    }

    // Verificar se a base de conhecimento existe
    const { data: knowledgeBase, error: kbError } = await supabase
      .from("knowledge_bases")
      .select()
      .eq("id", knowledgeBaseId)
      .single()

    if (kbError || !knowledgeBase) {
      return NextResponse.json({ error: "Base de conhecimento não encontrada" }, { status: 404 })
    }

    // Ler o conteúdo do arquivo
    const fileContent = await file.text()
    const fileName = file.name

    // Salvar o documento na base de conhecimento
    const { data: document, error } = await supabase
      .from("knowledge_documents")
      .insert({
        id: uuidv4(),
        knowledge_base_id: knowledgeBaseId,
        title: fileName,
        content: fileContent,
        metadata: { fileName, fileType: file.type, fileSize: file.size },
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao salvar documento:", error)
      return NextResponse.json({ error: "Erro ao salvar documento" }, { status: 500 })
    }

    // Aqui você pode adicionar código para processar o documento e criar embeddings
    // usando o Pinecone ou outro serviço de vetorização

    return NextResponse.json({
      success: true,
      document,
      message: "Documento enviado com sucesso",
    })
  } catch (error: any) {
    console.error("Erro ao processar upload:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
