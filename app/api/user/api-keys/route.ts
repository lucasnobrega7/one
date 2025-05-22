import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/user-context"
import { supabase } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

// Gerar API key
function generateApiKey() {
  return `ak_${crypto.randomBytes(24).toString("hex")}`
}

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { data: apiKeys, error } = await supabase
      .from("api_keys")
      .select()
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar API keys:", error)
      return NextResponse.json({ error: "Erro ao buscar API keys" }, { status: 500 })
    }

    // Ocultar a chave completa, mostrando apenas os primeiros e últimos caracteres
    const maskedKeys = apiKeys.map((key) => ({
      ...key,
      key: `${key.key.substring(0, 5)}...${key.key.substring(key.key.length - 5)}`,
    }))

    return NextResponse.json(maskedKeys)
  } catch (error: any) {
    console.error("Erro ao buscar API keys:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, expiresInDays } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Nome não fornecido" }, { status: 400 })
    }

    // Gerar API key
    const apiKey = generateApiKey()

    // Calcular data de expiração
    let expiresAt = null
    if (expiresInDays) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiresInDays)
    }

    // Salvar API key
    const { data: key, error } = await supabase
      .from("api_keys")
      .insert({
        id: uuidv4(),
        user_id: session.user.id,
        name,
        key: apiKey,
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar API key:", error)
      return NextResponse.json({ error: "Erro ao criar API key" }, { status: 500 })
    }

    // Retornar a chave completa apenas na criação
    return NextResponse.json({
      ...key,
      fullKey: apiKey, // Apenas na criação retornamos a chave completa
    })
  } catch (error: any) {
    console.error("Erro ao criar API key:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const keyId = searchParams.get("id")

    if (!keyId) {
      return NextResponse.json({ error: "ID da chave não fornecido" }, { status: 400 })
    }

    // Verificar se a chave pertence ao usuário
    const { data: key, error: checkError } = await supabase
      .from("api_keys")
      .select()
      .eq("id", keyId)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !key) {
      return NextResponse.json({ error: "API key não encontrada" }, { status: 404 })
    }

    // Excluir a chave
    const { error } = await supabase.from("api_keys").delete().eq("id", keyId)

    if (error) {
      console.error("Erro ao excluir API key:", error)
      return NextResponse.json({ error: "Erro ao excluir API key" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro ao excluir API key:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
