import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter dados do corpo da requisição
    const { companyName, industry, useCase } = await request.json()

    // Criar cliente Supabase
    const supabase = await createClient()

    // Atualizar perfil do usuário
    const { error } = await supabase.from("user_profiles").upsert({
      user_id: session.user.id,
      company_name: companyName,
      industry,
      use_case: useCase,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Erro ao salvar dados de onboarding:", error)
      return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro no onboarding:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
