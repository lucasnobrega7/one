import type { Metadata } from "next"
import { Key } from "lucide-react"
import ApiKeyManager from "@/components/features/admin/api-key-manager"

export const metadata: Metadata = {
  title: "Gerenciamento de API Keys | Agentes de Conversão",
  description: "Gerencie as chaves de API e variáveis de ambiente do sistema",
}

export default function ApiKeysPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <Key className="w-8 h-8 text-[#46B2E0]" />
          Gerenciamento de API Keys
        </h1>
        <p className="text-white/70 mb-8">
          Gerencie as chaves de API e variáveis de ambiente necessárias para o funcionamento do sistema. As alterações
          feitas aqui afetarão o funcionamento de todo o sistema.
        </p>
      </div>
      <ApiKeyManager />
    </div>
  )
}
