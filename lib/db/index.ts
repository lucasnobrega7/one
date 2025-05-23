import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Configuração da conexão com o PostgreSQL
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL ou SUPABASE_URL deve ser definida")
}

// Criar conexão com postgres
const client = postgres(connectionString)

// Criar instância do Drizzle ORM
export const db = drizzle(client, { schema })

// Export schema for use in other files
export * from "./schema"