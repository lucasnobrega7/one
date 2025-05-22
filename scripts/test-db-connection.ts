#!/usr/bin/env node

/**
 * Script para testar a conexão com o banco de dados
 */

// Importar dotenv para carregar variáveis de ambiente de arquivos .env
import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env" })

import { createClient } from "@supabase/supabase-js"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { checkDatabaseConnection } from "../lib/db"

async function testDatabaseConnection() {
  console.log("\n=== TESTE DE CONEXÃO COM O BANCO DE DADOS ===\n")

  // Verificar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Variáveis de ambiente do Supabase não configuradas!")
    process.exit(1)
  }

  // Testar conexão com o Supabase usando a chave anônima
  try {
    console.log("Testando conexão com o Supabase (chave anônima)...")
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.from("users").select("id").limit(1)

    if (error) throw error

    console.log("✅ Conexão com o Supabase (chave anônima) estabelecida com sucesso!")
    console.log(`   Encontrados ${data.length} usuários.`)
  } catch (error) {
    console.error("❌ Erro ao conectar com o Supabase (chave anônima):", error)
  }

  // Testar conexão com o Supabase usando a chave de serviço (se disponível)
  if (supabaseServiceKey) {
    try {
      console.log("\nTestando conexão com o Supabase (chave de serviço)...")
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
      const { data, error } = await supabaseAdmin.from("users").select("id").limit(1)

      if (error) throw error

      console.log("✅ Conexão com o Supabase (chave de serviço) estabelecida com sucesso!")
      console.log(`   Encontrados ${data.length} usuários.`)
    } catch (error) {
      console.error("❌ Erro ao conectar com o Supabase (chave de serviço):", error)
    }
  } else {
    console.log("\n⚠️ Chave de serviço do Supabase não configurada. Pulando teste com chave de serviço.")
  }

  // Testar conexão direta com o PostgreSQL
  const connectionString = process.env.NEON_NEON_DATABASE_URL || process.env.SUPABASE_DATABASE_URL

  if (connectionString) {
    try {
      console.log("\nTestando conexão direta com o PostgreSQL...")
      const client = postgres(connectionString)
      const db = drizzle(client)

      // Executar uma consulta simples
      const result = await client`SELECT 1 as test`

      console.log("✅ Conexão direta com o PostgreSQL estabelecida com sucesso!")
      console.log(`   Resultado do teste: ${JSON.stringify(result[0])}`)

      // Fechar a conexão
      await client.end()
    } catch (error) {
      console.error("❌ Erro ao conectar diretamente com o PostgreSQL:", error)
    }
  } else {
    console.log("\n⚠️ String de conexão com o PostgreSQL não configurada. Pulando teste de conexão direta.")
  }

  // Testar a função checkDatabaseConnection
  try {
    console.log("\nTestando a função checkDatabaseConnection...")
    const result = await checkDatabaseConnection()

    if (result.success) {
      console.log("✅ Função checkDatabaseConnection executada com sucesso!")
      console.log(`   Mensagem: ${result.message}`)
      if (result.data) {
        console.log(`   Dados: ${JSON.stringify(result.data)}`)
      }
    } else {
      console.error("❌ Função checkDatabaseConnection falhou!")
      console.error(`   Erro: ${result.error}`)
      console.error(`   Código: ${result.code}`)
    }
  } catch (error) {
    console.error("❌ Erro ao executar a função checkDatabaseConnection:", error)
  }

  console.log("\n=== FIM DO TESTE DE CONEXÃO ===\n")
}

// Executar o teste
testDatabaseConnection().catch((error) => {
  console.error("Erro não tratado:", error)
  process.exit(1)
})
