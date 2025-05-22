import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/user-context"
import { supabase } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { data: settings, error } = await supabase
      .from("user_settings")
      .select()
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      // Se não encontrar configurações, criar padrão
      if (error.code === "PGRST116") {
        const { data: newSettings, error: insertError } = await supabase
          .from("user_settings")
          .insert({
            user_id: session.user.id,
          })
          .select()
          .single()

        if (insertError) {
          console.error("Erro ao criar configurações:", insertError)
          return NextResponse.json({ error: "Erro ao criar configurações" }, { status: 500 })
        }

        return NextResponse.json(newSettings)
      }

      console.error("Erro ao buscar configurações:", error)
      return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 })
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error("Erro ao buscar configurações:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const updates = await req.json()
    const allowedFields = ["theme", "language", "notifications_enabled"]

    // Filtrar apenas campos permitidos
    const filteredUpdates = Object.keys(updates).reduce(
      (acc, key) => {
        if (allowedFields.includes(key)) {
          acc[key] = updates[key]
        }
        return acc
      },
      {} as Record<string, any>,
    )

    const { data: settings, error } = await supabase
      .from("user_settings")
      .update(filteredUpdates)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar configurações:", error)
      return NextResponse.json({ error: "Erro ao atualizar configurações" }, { status: 500 })
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error("Erro ao atualizar configurações:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
