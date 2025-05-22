import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db"

export async function GET() {
  try {
    const connectionStatus = await checkDatabaseConnection()

    if (connectionStatus.success) {
      return NextResponse.json({
        status: "online",
        message: connectionStatus.message,
        timestamp: connectionStatus.timestamp,
        environment: process.env.NODE_ENV,
        supabaseUrl: {
          defined: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        },
      })
    } else {
      return NextResponse.json(
        {
          status: "offline",
          error: connectionStatus.error,
          code: connectionStatus.code,
          environment: process.env.NODE_ENV,
          supabaseUrl: {
            defined: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
          },
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Erro desconhecido ao verificar status do banco de dados",
        environment: process.env.NODE_ENV,
      },
      { status: 500 },
    )
  }
}
