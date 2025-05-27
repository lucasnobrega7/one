"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const router = useRouter()
  const { signUp, signIn, signInWithProvider } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos de serviço para continuar.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta")
      }

      // Login automático após o registro bem-sucedido
      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        throw new Error(signInError.message)
      }

      // Redirecionar para o onboarding
      router.push("/onboarding")
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao criar sua conta. Por favor, tente novamente.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para a página inicial
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM14.5 21.5C14.5 22.881 13.381 24 12 24C10.619 24 9.5 22.881 9.5 21.5C9.5 20.119 10.619 19 12 19C13.381 19 14.5 20.119 14.5 21.5ZM14.5 10.5C14.5 11.881 13.381 13 12 13C10.619 13 9.5 11.881 9.5 10.5C9.5 9.119 10.619 8 12 8C13.381 8 14.5 9.119 14.5 10.5ZM20 16C20 17.381 18.881 18.5 17.5 18.5C16.119 18.5 15 17.381 15 16C15 14.619 16.119 13.5 17.5 13.5C18.881 13.5 20 14.619 20 16ZM22.5 21.5C22.5 22.881 21.381 24 20 24C18.619 24 17.5 22.881 17.5 21.5C17.5 20.119 18.619 19 20 19C21.381 19 22.5 20.119 22.5 21.5ZM22.5 10.5C22.5 11.881 21.381 13 20 13C18.619 13 17.5 11.881 17.5 10.5C17.5 9.119 18.619 8 20 8C21.381 8 22.5 9.119 22.5 10.5Z"
                  fill="white"
                />
              </svg>
            </Link>
            <h1 className="text-3xl font-normal mb-2">Criar sua conta</h1>
            <p className="text-white/70">Junte-se a nós e comece a construir com IA avançada.</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium mb-2">
                Nome completo
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border border-white/20 px-3 py-2 focus:outline-none focus:border-white"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border border-white/20 px-3 py-2 focus:outline-none focus:border-white"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium mb-2">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-white/20 px-3 py-2 focus:outline-none focus:border-white"
                placeholder="Mínimo 8 caracteres"
                minLength={8}
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="terms" className="text-sm text-white/70 leading-relaxed">
                  Eu concordo com os{" "}
                  <Link href="/terms" className="underline hover:no-underline">
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" className="underline hover:no-underline">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full bg-white text-black py-2 px-4 hover:bg-white/90 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70 text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="underline hover:no-underline">
                Entrar
              </Link>
            </p>
          </div>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-black px-4 text-sm text-white/50">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/5"
                onClick={() => signInWithProvider("google")}
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/5"
                onClick={() => signInWithProvider("github")}
              >
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
