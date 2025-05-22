import { db } from "."
import { sql } from "drizzle-orm"
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  agents,
  knowledgeBases,
  conversations,
  messages,
} from "./schema"

export async function createInitialTables() {
  try {
    console.log("Criando tabelas iniciais...")

    // Criar tabela de usuários
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${users} (
        id VARCHAR(255) PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        email_verified TIMESTAMP,
        image TEXT,
        password TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Criar tabela de contas
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${accounts} (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES ${users}(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE(provider, provider_account_id)
      )
    `)

    // Criar tabela de sessões
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${sessions} (
        id VARCHAR(255) PRIMARY KEY,
        session_token TEXT NOT NULL UNIQUE,
        user_id VARCHAR(255) NOT NULL REFERENCES ${users}(id) ON DELETE CASCADE,
        expires TIMESTAMP NOT NULL
      )
    `)

    // Criar tabela de tokens de verificação
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${verificationTokens} (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires TIMESTAMP NOT NULL,
        UNIQUE(identifier, token)
      )
    `)

    // Criar tabela de bases de conhecimento
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${knowledgeBases} (
        id VARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        index_name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Criar tabela de agentes
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${agents} (
        id VARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        system_prompt TEXT,
        model_id TEXT,
        temperature DOUBLE PRECISION,
        user_id VARCHAR(255) NOT NULL REFERENCES ${users}(id) ON DELETE CASCADE,
        knowledge_base_id VARCHAR(255) REFERENCES ${knowledgeBases}(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Criar tabela de conversas
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${conversations} (
        id VARCHAR(255) PRIMARY KEY,
        agent_id VARCHAR(255) NOT NULL REFERENCES ${agents}(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL REFERENCES ${users}(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Criar tabela de mensagens
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${messages} (
        id VARCHAR(255) PRIMARY KEY,
        conversation_id VARCHAR(255) NOT NULL REFERENCES ${conversations}(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    console.log("Tabelas iniciais criadas com sucesso!")
  } catch (error) {
    console.error("Erro ao criar tabelas iniciais:", error)
    throw error
  }
}
