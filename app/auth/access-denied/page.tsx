import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">Acesso Negado</h1>

        <p className="mb-6 text-center text-gray-600">
          Você não tem permissão para acessar esta página. Entre em contato com um administrador se acredita que isso é
          um erro.
        </p>

        <div className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">Voltar ao Dashboard</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/">Ir para Página Inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
