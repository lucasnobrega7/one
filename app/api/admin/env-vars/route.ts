import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import fs from "fs"
import path from "path"

// Função para verificar se o usuário é administrador
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  return session?.user?.role === "admin"
}

// Função para ler as variáveis de ambiente do arquivo .env.local
function readEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env.local")
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8")
      const envVars: Record<string, string> = {}

      envContent.split("\n").forEach((line) => {
        // Ignorar linhas de comentário ou vazias
        if (line.trim() && !line.startsWith("#")) {
          const match = line.match(/^([^=]+)=(.*)$/)
          if (match) {
            const key = match[1].trim()
            const value = match[2].trim()
            // Remover aspas se existirem
            envVars[key] = value.replace(/^["']|["']$/g, "")
          }
        }
      })

      return envVars
    }
    return {}
  } catch (error) {
    console.error("Erro ao ler arquivo .env.local:", error)
    return {}
  }
}

// Função para escrever as variáveis de ambiente no arquivo .env.local
function writeEnvFile(variables: Record<string, string>) {
  try {
    const envPath = path.join(process.cwd(), ".env.local")

    // Ler o arquivo existente para preservar comentários
    let existingContent = ""
    if (fs.existsSync(envPath)) {
      existingContent = fs.readFileSync(envPath, "utf8")
    }

    // Extrair comentários e linhas vazias
    const comments: string[] = []
    existingContent.split("\n").forEach((line) => {
      if (line.trim() === "" || line.startsWith("#")) {
        comments.push(line)
      }
    })

    // Criar conteúdo do novo arquivo
    let newContent = comments.join("\n")
    if (newContent) newContent += "\n\n"

    // Adicionar variáveis
    Object.entries(variables).forEach(([key, value]) => {
      // Adicionar aspas se o valor contiver espaços ou caracteres especiais
      const formattedValue = value.includes(" ") || /[#;,\s]/.test(value) ? `"${value}"` : value
      newContent += `${key}=${formattedValue}\n`
    })

    fs.writeFileSync(envPath, newContent)
    return true
  } catch (error) {
    console.error("Erro ao escrever arquivo .env.local:", error)
    return false
  }
}

// Endpoint para obter as variáveis de ambiente
export async function GET(req: NextRequest) {
  // Verificar se o usuário é administrador
  if (!(await isAdmin(req))) {
    return NextResponse.json({ success: false, message: "Acesso não autorizado" }, { status: 403 })
  }

  try {
    const variables = readEnvFile()

    // Mascarar valores sensíveis para segurança
    const maskedVariables: Record<string, string> = {}
    Object.entries(variables).forEach(([key, value]) => {
      // Verificar se é uma variável sensível
      const isSensitive =
        key.includes("SECRET") || key.includes("KEY") || key.includes("PASSWORD") || key.includes("TOKEN")

      // Se for sensível, mostrar apenas que existe um valor
      if (isSensitive && value) {
        maskedVariables[key] = value
      } else {
        maskedVariables[key] = value
      }
    })

    return NextResponse.json({ success: true, variables: maskedVariables })
  } catch (error) {
    console.error("Erro ao obter variáveis de ambiente:", error)
    return NextResponse.json({ success: false, message: "Erro ao obter variáveis de ambiente" }, { status: 500 })
  }
}

// Endpoint para atualizar as variáveis de ambiente
export async function POST(req: NextRequest) {
  // Verificar se o usuário é administrador
  if (!(await isAdmin(req))) {
    return NextResponse.json({ success: false, message: "Acesso não autorizado" }, { status: 403 })
  }

  try {
    const { variables } = await req.json()

    // Validar os dados recebidos
    if (!variables || typeof variables !== "object") {
      return NextResponse.json({ success: false, message: "Dados inválidos" }, { status: 400 })
    }

    // Ler as variáveis existentes
    const existingVariables = readEnvFile()

    // Mesclar as variáveis existentes com as novas
    const updatedVariables = { ...existingVariables, ...variables }

    // Escrever as variáveis atualizadas no arquivo
    const success = writeEnvFile(updatedVariables)

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Variáveis de ambiente atualizadas com sucesso",
      })
    } else {
      return NextResponse.json({ success: false, message: "Erro ao atualizar variáveis de ambiente" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao atualizar variáveis de ambiente:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar variáveis de ambiente" }, { status: 500 })
  }
}
