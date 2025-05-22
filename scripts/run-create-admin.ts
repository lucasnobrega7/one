import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Carregar variáveis de ambiente
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, "../.env.local") })
dotenv.config({ path: path.resolve(__dirname, "../.env") })

// Importar e executar o script de criação de admin
import("./create-super-admin.ts")
  .then(() => {
    console.log("Script executado com sucesso!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Erro ao executar script:", error)
    process.exit(1)
  })
