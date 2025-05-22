import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/user-context"
import { supabase } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const conversationId = params.id

    const { data: conversation, error } = await supabase
      .from("conversations")
      .select(`
        *,
        messages (*),
        agents (*)
      `)
      .eq("id", conversationId)
      .single()

    if (error || !conversation) {
      return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 })
    }

    // Verificar se o usuário tem acesso a esta conversa
    if (conversation.user_id !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Ordenar mensagens por data de criação
    if (conversation.messages) {
      conversation.messages.sort((a, b) => {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      })
    }

    return NextResponse.json(conversation)
  } catch (error: any) {
    console.error("Erro ao buscar conversa:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
