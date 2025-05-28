"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const error = searchParams?.get("error")

  useEffect(() => {
    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      Configuration: "Há um problema com a configuração do servidor.",
      AccessDenied: "Você não tem permissão para fazer login.",
      Verification: "O link de verificação pode ter sido usado ou é inválido.",
      Default: "Ocorreu um erro inesperado.",
      CredentialsSignin: "O email ou senha que você inseriu está incorreto.",
      OAuthSignin: "Erro no processo de login OAuth.",
      OAuthCallback: "Erro no processo de callback OAuth.",
      OAuthCreateAccount: "Não foi possível criar conta do provedor OAuth.",
      EmailCreateAccount: "Não foi possível criar conta do provedor de email.",
      Callback: "Erro no manipulador de callback.",
      OAuthAccountNotLinked: "Este email já está associado a outra conta.",
      EmailSignin: "Erro ao enviar o link de verificação por email.",
      SessionRequired: "Faça login para acessar esta página.",
    }

    setErrorMessage(error && errorMessages[error] ? errorMessages[error] : errorMessages.Default)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Erro de Autenticação
          </h2>
          <p className="text-gray-400">
            Algo deu errado durante o processo de login
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <p className="text-gray-300">
                {errorMessage}
              </p>
              
              <div className="space-y-3">
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Link href="/login">Voltar para Login</Link>
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
