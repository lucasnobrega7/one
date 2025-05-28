import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-400">
            Você não tem permissão para acessar esta página
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <p className="text-gray-300">
                Entre em contato com um administrador se acredita que isso é um erro.
              </p>
              
              <div className="space-y-3">
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Link href="/dashboard">Voltar ao Dashboard</Link>
                </Button>

                <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
                  <Link href="/">Ir para Página Inicial</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
