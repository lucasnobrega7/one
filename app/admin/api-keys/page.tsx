import type { Metadata } from "next"
import ApiKeyManager from "@/components/admin/api-key-manager"

export const metadata: Metadata = {
  title: "Gerenciamento de API Keys | Agentes de Conversão",
  description: "Gerencie as chaves de API e variáveis de ambiente do sistema",
}

export default function ApiKeysPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de API Keys</h1>
      <p className="text-muted-foreground mb-8">
        Gerencie as chaves de API e variáveis de ambiente necessárias para o funcionamento do sistema. As alterações
        feitas aqui afetarão o funcionamento de todo o sistema.
      </p>
      <ApiKeyManager />
    </div>
  )
}
