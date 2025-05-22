import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db"

export async function GET() {
  try {
    const result = await checkDatabaseConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          code: result.code,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Erro ao verificar conexão com banco de dados:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro desconhecido",
        details: "Erro ao executar verificação de conexão",
      },
      { status: 500 },
    )
  }
}
