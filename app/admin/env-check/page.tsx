import type { Metadata } from "next"
import { CheckCircle } from "lucide-react"
import EnvChecker from "@/components/env-checker"

export const metadata: Metadata = {
  title: "Verificação de Ambiente | Agentes de Conversão",
  description: "Verifique se todas as variáveis de ambiente necessárias estão configuradas corretamente",
}

export default function EnvCheckPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-[#46B2E0]" />
          Verificação de Ambiente
        </h1>
        <p className="text-white/70 mb-8">
          Verifique se todas as variáveis de ambiente necessárias estão configuradas corretamente.
        </p>
      </div>
      <EnvChecker />
    </div>
  )
}

export const dynamic = 'force-dynamic'
