import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/db"
import { Permission, Role } from "@/lib/auth/permissions"
import { v4 as uuidv4 } from "uuid"

// Atualizar roles de um usuário
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar autenticação
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Verificar permissão
    if (!session.user.permissions.includes(Permission.EditUser)) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const userId = params.id
    const { roles } = await request.json()

    // Validar roles
    if (!Array.isArray(roles) || !roles.every((role) => Object.values(Role).includes(role))) {
      return NextResponse.json({ error: "Roles inválidos" }, { status: 400 })
    }

    // Remover roles existentes
    const { error: deleteError } = await supabase.from("user_roles").delete().eq("user_id", userId)

    if (deleteError) {
      console.error("Erro ao remover roles existentes:", deleteError)
      return NextResponse.json({ error: "Erro ao atualizar roles" }, { status: 500 })
    }

    // Adicionar novos roles
    const rolesToInsert = roles.map((role) => ({
      id: uuidv4(),
      user_id: userId,
      role,
    }))

    const { error: insertError } = await supabase.from("user_roles").insert(rolesToInsert)

    if (insertError) {
      console.error("Erro ao inserir novos roles:", insertError)
      return NextResponse.json({ error: "Erro ao atualizar roles" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar roles:", error)
    return NextResponse.json({ error: "Erro ao atualizar roles" }, { status: 500 })
  }
}

// Obter roles de um usuário
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar autenticação
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Verificar permissão
    if (!session.user.permissions.includes(Permission.ViewUsers)) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const userId = params.id

    // Buscar roles do usuário
    const { data: userRolesList, error } = await supabase.from("user_roles").select().eq("user_id", userId)

    if (error) {
      console.error("Erro ao buscar roles:", error)
      return NextResponse.json({ error: "Erro ao buscar roles" }, { status: 500 })
    }

    const roles = userRolesList.map((ur) => ur.role)

    return NextResponse.json({ roles })
  } catch (error) {
    console.error("Erro ao buscar roles:", error)
    return NextResponse.json({ error: "Erro ao buscar roles" }, { status: 500 })
  }
}
