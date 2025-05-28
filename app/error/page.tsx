"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDescription, setErrorDescription] = useState<string>("")

  useEffect(() => {
    const errorParam = searchParams?.get("error")
    setError(errorParam)

    // Definir descrição do erro com base no código
    if (errorParam === "Configuration") {
      setErrorDescription("Há um problema com a configuração do servidor de autenticação.")
    } else if (errorParam === "AccessDenied") {
      setErrorDescription("Você não tem permissão para acessar este recurso.")
    } else if (errorParam === "Verification") {
      setErrorDescription("O link de verificação expirou ou já foi usado.")
    } else if (errorParam === "OAuthSignin") {
      setErrorDescription("Erro ao iniciar o fluxo de autenticação OAuth.")
    } else if (errorParam === "OAuthCallback") {
      setErrorDescription("Erro ao processar a resposta do provedor OAuth.")
    } else if (errorParam === "OAuthCreateAccount") {
      setErrorDescription("Não foi possível criar uma conta vinculada à sua conta OAuth.")
    } else if (errorParam === "EmailCreateAccount") {
      setErrorDescription("Não foi possível criar uma conta com este e-mail.")
    } else if (errorParam === "Callback") {
      setErrorDescription("Erro durante o processamento da autenticação.")
    } else if (errorParam === "OAuthAccountNotLinked") {
      setErrorDescription("Este e-mail já está associado a outra conta.")
    } else if (errorParam === "EmailSignin") {
      setErrorDescription("O e-mail não pôde ser enviado.")
    } else if (errorParam === "CredentialsSignin") {
      setErrorDescription("As credenciais fornecidas são inválidas.")
    } else if (errorParam === "SessionRequired") {
      setErrorDescription("Você precisa estar autenticado para acessar este recurso.")
    } else {
      setErrorDescription("Ocorreu um erro desconhecido durante a autenticação.")
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Erro de Autenticação
          </h2>
          <p className="text-gray-400">
            {error ? `Erro: ${error}` : "Ocorreu um erro durante a autenticação"}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {errorDescription}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-3 text-sm font-medium text-white transition-all"
            >
              Voltar para o login
            </Link>
            <Link
              href="/"
              className="inline-flex w-full justify-center rounded-lg border border-white/20 bg-transparent hover:bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
