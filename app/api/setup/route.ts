import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, agents } from "@/lib/db/schema"
import { MOCK_USER_ID, MOCK_USER_NAME } from "@/lib/user-context"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    // Verificar se o usuário de teste já existe
    const existingUsers = await db.select().from(users).where(eq(users.id, MOCK_USER_ID))
    const existingUser = existingUsers[0]

    if (existingUser) {
      return NextResponse.json({
        message: "Usuário de teste já existe",
        user: existingUser,
      })
    }

    // Criar usuário de teste
    const [user] = await db
      .insert(users)
      .values({
        id: MOCK_USER_ID,
        name: MOCK_USER_NAME,
        email: "usuario@teste.com",
        image: "https://ui-avatars.com/api/?name=Usuario+Teste",
      })
      .returning()

    // Criar agente de exemplo
    const [agent] = await db
      .insert(agents)
      .values({
        name: "Assistente de Vendas",
        description: "Qualifica leads e responde dúvidas sobre produtos",
        systemPrompt:
          "Você é um assistente de vendas especializado em qualificar leads e responder dúvidas sobre nossos produtos. Seja cordial, profissional e focado em converter o interesse em vendas.",
        modelId: "gpt-4o",
        temperature: 0.7,
        userId: user.id,
      })
      .returning()

    return NextResponse.json({
      message: "Configuração inicial concluída com sucesso",
      user,
      agent,
    })
  } catch (error: any) {
    console.error("Erro na configuração inicial:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
