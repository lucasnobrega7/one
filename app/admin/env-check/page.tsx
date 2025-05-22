import type { Metadata } from "next"
import EnvChecker from "@/components/env-checker"

export const metadata: Metadata = {
  title: "Verificação de Ambiente | Agentes de Conversão",
  description: "Verifique se todas as variáveis de ambiente necessárias estão configuradas corretamente",
}

export default function EnvCheckPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Verificação de Ambiente</h1>
      <EnvChecker />
    </div>
  )
}
