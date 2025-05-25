import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { Role } from "../lib/auth/permissions"

// Função principal para criar o super administrador
async function createSuperAdmin() {
  // Configurações do Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://faccixlabriqwxkxqprw.supabase.co"
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2NpeGxhYnJpcXd4a3hxcHJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAyNzEyMiwiZXhwIjoyMDYzNjAzMTIyfQ.ZTY8KZxF_B2Isx5P4OKqRnryDSIeXGH4GK5hEX6nC7E"

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Erro: Variáveis de ambiente do Supabase não configuradas!")
    process.exit(1)
  }

  // Criar cliente Supabase com a chave de serviço
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Dados do usuário super-admin
  const userData = {
    email: "lucas@agentesdeconversao.com.br",
    password: "Alegria2025$%",
    name: "Lucas (Super Admin)",
  }

  try {
    console.log("Verificando se o usuário já existe...")

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", userData.email).single()

    let userId

    if (existingUser) {
      console.log(`Usuário com email ${userData.email} já existe. ID: ${existingUser.id}`)
      userId = existingUser.id

      // Atualizar senha e nome se o usuário já existir
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      await supabase
        .from("users")
        .update({
          password: hashedPassword,
          name: userData.name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      console.log("Informações do usuário atualizadas com sucesso.")
    } else {
      // Criar novo usuário
      console.log("Criando novo usuário super-admin...")

      userId = uuidv4()
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      await supabase.from("users").insert({
        id: userId,
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      console.log(`Usuário criado com sucesso. ID: ${userId}`)
    }

    // Remover roles existentes para o usuário
    console.log("Removendo roles existentes...")
    await supabase.from("user_roles").delete().eq("user_id", userId)

    // Adicionar todas as roles disponíveis
    console.log("Adicionando roles de super-admin...")
    const roles: Role[] = ['admin', 'manager', 'user', 'viewer']

    const rolesToInsert = roles.map((role) => ({
      id: uuidv4(),
      user_id: userId,
      role,
      created_at: new Date().toISOString(),
    }))

    await supabase.from("user_roles").insert(rolesToInsert)

    // Verificar se o usuário tem configurações
    console.log("Verificando configurações do usuário...")
    const { data: existingSettings } = await supabase.from("user_settings").select("id").eq("user_id", userId).single()

    if (!existingSettings) {
      // Criar configurações padrão para o usuário
      console.log("Criando configurações para o usuário...")
      await supabase.from("user_settings").insert({
        id: uuidv4(),
        user_id: userId,
        theme: "light",
        notifications_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    console.log("✅ Super-administrador criado/atualizado com sucesso!")
    console.log(`Email: ${userData.email}`)
    console.log("Roles atribuídas:", roles.join(", "))
  } catch (error) {
    console.error("Erro ao criar super-administrador:", error)
    process.exit(1)
  }
}

// Executar a função principal
createSuperAdmin()
