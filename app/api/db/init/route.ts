import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"
import { createInitialTables } from "@/lib/db/migrations"

export async function GET() {
  try {
    // Verificar a conexão com o banco de dados
    const result = await db.execute(sql`SELECT NOW()`)

    // Criar tabelas iniciais
    await createInitialTables()

    return NextResponse.json({
      message: "Banco de dados inicializado com sucesso",
      timestamp: result.rows[0],
    })
  } catch (error: any) {
    console.error("Erro ao inicializar banco de dados:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
