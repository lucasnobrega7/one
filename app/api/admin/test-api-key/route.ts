import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Função para verificar se o usuário é administrador
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  return session?.user?.role === "admin"
}

// Função para testar a chave da OpenAI
async function testOpenAI(apiKey: string) {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (response.ok) {
      return { success: true, message: "Conexão com a OpenAI estabelecida com sucesso" }
    } else {
      const error = await response.json()
      return { success: false, message: `Erro na API da OpenAI: ${error.error?.message || "Erro desconhecido"}` }
    }
  } catch (error) {
    return { success: false, message: `Erro ao conectar com a OpenAI: ${(error as Error).message}` }
  }
}

// Função para testar a chave da Cohere
async function testCohere(apiKey: string) {
  try {
    const response = await fetch("https://api.cohere.ai/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      return { success: true, message: "Conexão com a Cohere estabelecida com sucesso" }
    } else {
      const error = await response.json()
      return { success: false, message: `Erro na API da Cohere: ${error.message || "Erro desconhecido"}` }
    }
  } catch (error) {
    return { success: false, message: `Erro ao conectar com a Cohere: ${(error as Error).message}` }
  }
}

// Função para testar a chave do Pinecone
async function testPinecone(apiKey: string, environment: string) {
  try {
    if (!environment) {
      return { success: false, message: "Ambiente do Pinecone não configurado" }
    }

    const response = await fetch(`https://controller.${environment}.pinecone.io/actions/whoami`, {
      headers: {
        "Api-Key": apiKey,
      },
    })

    if (response.ok) {
      return { success: true, message: "Conexão com o Pinecone estabelecida com sucesso" }
    } else {
      const error = await response.json()
      return { success: false, message: `Erro na API do Pinecone: ${error.message || "Erro desconhecido"}` }
    }
  } catch (error) {
    return { success: false, message: `Erro ao conectar com o Pinecone: ${(error as Error).message}` }
  }
}

// Função para testar a URL do banco de dados Neon
async function testNeonDatabase(databaseUrl: string) {
  try {
    // Importar o pg dinamicamente para evitar problemas com SSR
    const { Pool } = await import("pg")

    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    // Testar a conexão
    const client = await pool.connect()
    await client.query("SELECT NOW()")
    client.release()
    await pool.end()

    return { success: true, message: "Conexão com o banco de dados Neon estabelecida com sucesso" }
  } catch (error) {
    return { success: false, message: `Erro ao conectar com o banco de dados Neon: ${(error as Error).message}` }
  }
}

// Função para testar a chave de API do Neon
async function testNeonApi(apiKey: string) {
  try {
    const response = await fetch("https://console.neon.tech/api/v2/projects", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    })

    if (response.ok) {
      return { success: true, message: "Conexão com a API do Neon estabelecida com sucesso" }
    } else {
      const error = await response.json()
      return { success: false, message: `Erro na API do Neon: ${error.message || "Erro desconhecido"}` }
    }
  } catch (error) {
    return { success: false, message: `Erro ao conectar com a API do Neon: ${(error as Error).message}` }
  }
}

// Função para testar as credenciais do Google OAuth
async function testGoogleOAuth(clientId: string, clientSecret: string) {
  try {
    // Verificar se as credenciais estão definidas
    if (!clientId || !clientSecret) {
      return { success: false, message: "Client ID ou Client Secret não configurados" }
    }

    // Não é possível testar diretamente sem um fluxo de autenticação,
    // mas podemos verificar se as credenciais têm o formato correto
    if (!clientId.endsWith(".apps.googleusercontent.com")) {
      return { success: false, message: "O formato do Client ID parece incorreto" }
    }

    return {
      success: true,
      message: "Credenciais do Google OAuth configuradas (não é possível testar diretamente)",
    }
  } catch (error) {
    return { success: false, message: `Erro ao verificar credenciais do Google OAuth: ${(error as Error).message}` }
  }
}

// Função para testar as credenciais do Supabase
async function testSupabase(url: string, anonKey: string) {
  try {
    if (!url || !anonKey) {
      return { success: false, message: "URL ou Anon Key do Supabase não configurados" }
    }

    const response = await fetch(`${url}/rest/v1/?apikey=${anonKey}`)

    if (response.ok) {
      return { success: true, message: "Conexão com o Supabase estabelecida com sucesso" }
    } else {
      return { success: false, message: `Erro na API do Supabase: Status ${response.status}` }
    }
  } catch (error) {
    return { success: false, message: `Erro ao conectar com o Supabase: ${(error as Error).message}` }
  }
}

export async function GET(req: NextRequest) {
  // Verificar se o usuário é administrador
  if (!(await isAdmin(req))) {
    return NextResponse.json({ success: false, message: "Acesso não autorizado" }, { status: 403 })
  }

  // Obter a chave a ser testada
  const key = req.nextUrl.searchParams.get("key")

  if (!key) {
    return NextResponse.json({ success: false, message: "Chave não especificada" }, { status: 400 })
  }

  try {
    let result

    switch (key) {
      case "OPENAI_API_KEY":
        result = await testOpenAI(process.env.OPENAI_API_KEY || "")
        break
      case "COHERE_API_KEY":
        result = await testCohere(process.env.COHERE_API_KEY || "")
        break
      case "PINECONE_API_KEY":
        result = await testPinecone(process.env.PINECONE_API_KEY || "", process.env.PINECONE_ENVIRONMENT || "")
        break
      case "NEON_NEON_NEON_DATABASE_URL":
        result = await testNeonDatabase(process.env.NEON_DATABASE_URL || "")
        break
      case "NEON_API_KEY":
        result = await testNeonApi(process.env.NEON_API_KEY || "")
        break
      case "GOOGLE_CLIENT_ID":
      case "GOOGLE_CLIENT_SECRET":
        result = await testGoogleOAuth(process.env.GOOGLE_CLIENT_ID || "", process.env.GOOGLE_CLIENT_SECRET || "")
        break
      case "NEXT_PUBLIC_SUPABASE_URL":
      case "NEXT_PUBLIC_SUPABASE_ANON_KEY":
        result = await testSupabase(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        )
        break
      default:
        result = {
          success: true,
          message: `Variável ${key} configurada (não é possível testar diretamente)`,
        }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`Erro ao testar a chave ${key}:`, error)
    return NextResponse.json(
      { success: false, message: `Erro ao testar a chave: ${(error as Error).message}` },
      { status: 500 },
    )
  }
}
