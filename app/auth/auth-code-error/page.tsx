import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            ❌ Erro de Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Houve um problema ao processar sua autenticação.
          </p>
          <p className="text-sm text-gray-500">
            Tente fazer login novamente ou entre em contato com o suporte se o problema persistir.
          </p>
          <Link href="/auth/login">
            <Button className="w-full">
              Voltar para Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}