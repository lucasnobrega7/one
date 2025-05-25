const { createClient } = require("@supabase/supabase-js")
const bcrypt = require("bcryptjs")

async function createUserDirect() {
  const supabaseUrl = "https://faccixlabriqwxkxqprw.supabase.co"
  const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2NpeGxhYnJpcXd4a3hxcHJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAyNzEyMiwiZXhwIjoyMDYzNjAzMTIyfQ.ZTY8KZxF_B2Isx5P4OKqRnryDSIeXGH4GK5hEX6nC7E"

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Criar usuário diretamente na autenticação do Supabase (não nas tabelas customizadas)
    console.log("Criando usuário via Supabase Auth...")
    
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: "lucas@agentesdeconversao.com.br",
      password: "Alegria2025$%",
      email_confirm: true,
      user_metadata: {
        name: "Lucas (Admin)"
      }
    })

    if (authError) {
      console.log("Erro ao criar usuário auth:", authError)
      
      // Se usuário já existe, vamos resetar a senha
      console.log("Tentando atualizar usuário existente...")
      
      const { data: updateUser, error: updateError } = await supabase.auth.admin.updateUserById(
        "292c2e73-aed7-4f8f-a74f-89467499bcd7", // ID do usuário que criamos antes
        {
          password: "Alegria2025$%",
          email_confirm: true
        }
      )
      
      console.log("Usuário atualizado:", updateUser)
      console.log("Erro de atualização:", updateError)
    } else {
      console.log("Usuário auth criado:", authUser)
    }

    console.log("✅ Teste concluído!")
    
  } catch (error) {
    console.error("Erro:", error)
  }
}

createUserDirect()