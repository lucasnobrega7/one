"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulação de envio de email de recuperação
      // Em produção, você implementaria a lógica real de envio de email
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (error) {
      setError("Ocorreu um erro ao processar sua solicitação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-[--openai-gray-200] py-4">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <Logo variant="default" size="md" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="w-full max-w-md">
          {success ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-8">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="sohne-heading text-3xl font-normal mb-4 text-[--openai-gray-900]">Email enviado</h1>
              <p className="text-[--openai-gray-600] mb-8 leading-relaxed">
                Enviamos um email com instruções para redefinir sua senha. Por favor, verifique sua caixa de entrada.
              </p>
              <Link
                href="/auth/login"
                className="btn-openai-primary-light inline-flex items-center"
              >
                Voltar para o login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h1 className="sohne-heading text-3xl font-normal mb-4 text-[--openai-gray-900]">Esqueceu sua senha?</h1>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Não se preocupe. Informe seu email e enviaremos instruções para redefinir sua senha.
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-[--openai-gray-700]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-[--openai-gray-300] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[--openai-blue] focus:border-transparent text-[--openai-gray-900] placeholder-[--openai-gray-400]"
                    placeholder="seu@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-openai-primary-light w-full flex items-center justify-center"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Enviar instruções
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-[--openai-gray-600] text-sm">
                  Lembrou sua senha?{" "}
                  <Link href="/auth/login" className="text-[--openai-blue] hover:underline">
                    Voltar para o login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
