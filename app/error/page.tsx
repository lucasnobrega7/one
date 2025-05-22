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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Erro de Autenticação</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {error ? `Erro: ${error}` : "Ocorreu um erro durante a autenticação"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{errorDescription}</p>
        </div>

        <div className="mt-6 flex flex-col space-y-4">
          <Link
            href="/login"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Voltar para o login
          </Link>
          <Link
            href="/"
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}
