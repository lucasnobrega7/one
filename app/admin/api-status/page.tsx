import { ApiChecker } from "@/components/api-checker"

export default function ApiStatusPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Status das APIs</h1>
      <p className="text-gray-600 mb-8">
        Esta página verifica o status de todas as APIs configuradas no sistema. Use-a para diagnosticar problemas de
        conexão ou configuração.
      </p>

      <ApiChecker />
    </div>
  )
}
