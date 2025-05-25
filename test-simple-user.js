const { createClient } = require("@supabase/supabase-js")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")

async function createSimpleUser() {
  const supabaseUrl = "https://faccixlabriqwxkxqprw.supabase.co"
  const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2NpeGxhYnJpcXd4a3hxcHJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAyNzEyMiwiZXhwIjoyMDYzNjAzMTIyfQ.ZTY8KZxF_B2Isx5P4OKqRnryDSIeXGH4GK5hEX6nC7E"

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Primeiro, vamos verificar a estrutura da tabela users
    console.log("Verificando tabelas existentes...")
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.log("Erro ao buscar tabelas:", tablesError)
    } else {
      console.log("Tabelas disponíveis:", tables?.map(t => t.table_name))
    }

    // Verificar se usuário já existe
    console.log("Verificando usuário existente...")
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "lucas@agentesdeconversao.com.br")
      .single()

    console.log("Usuário existente:", existingUser)
    console.log("Erro de busca:", findError)

    if (!existingUser) {
      // Criar usuário simples apenas na tabela users
      console.log("Criando usuário...")
      const hashedPassword = await bcrypt.hash("Alegria2025$%", 10)
      
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          email: "lucas@agentesdeconversao.com.br",
          password: hashedPassword,
          name: "Lucas (Admin)"
        })
        .select()
        
      console.log("Usuário criado:", newUser)
      console.log("Erro de criação:", createError)
    } else {
      // Atualizar senha
      console.log("Atualizando senha do usuário existente...")
      const hashedPassword = await bcrypt.hash("Alegria2025$%", 10)
      
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ password: hashedPassword })
        .eq("id", existingUser.id)
        .select()
        
      console.log("Usuário atualizado:", updatedUser)
      console.log("Erro de atualização:", updateError)
    }

  } catch (error) {
    console.error("Erro geral:", error)
  }
}

createSimpleUser()