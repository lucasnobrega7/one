import { Activity } from "lucide-react"
import { ApiChecker } from "@/components/api-checker"

export default function ApiStatusPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#46B2E0]" />
          Status das APIs
        </h1>
        <p className="text-white/70 mb-8">
          Esta página verifica o status de todas as APIs configuradas no sistema. Use-a para diagnosticar problemas de
          conexão ou configuração.
        </p>
      </div>

      <ApiChecker />
    </div>
  )
}
