"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { createClient } from '@/lib/database/supabase-utils/client'
import { AlertCircle, Check } from "lucide-react"
import { AbstractBackground } from "@/components/visual/abstract-background"
import { OpenAIButton } from "@/components/visual/openai-button"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1) // 1: Form, 2: Welcome

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name }
        }
      })

      if (supabaseError) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })

        const responseData = await response.json()
        if (!response.ok) {
          throw new Error(responseData.message || "Erro ao criar conta")
        }

        await signIn("credentials", { redirect: false, email, password })
      }

      // Show welcome screen before dashboard
      setStep(2)
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao criar sua conta.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Contexto Imersivo - Background */}
      <div className="absolute inset-0 bg-black">
        <AbstractBackground 
          variant="particles" 
          density="low"
          className="opacity-30"
        />
      </div>      {/* Header Simples */}
      <header className="relative z-10 border-b border-white/10 py-4">
        <div className="container mx-auto px-6">
          <Link href="/" className="flex items-center text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded mr-3"></div>
            <span className="text-xl font-medium tracking-tight">Agentes de Conversão</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          {step === 1 ? (
            // Formulário de Registro (Contexto Imersivo)
            <div className="text-center mb-8">
              <h1 className="text-4xl font-normal text-white mb-4 tracking-tight">
                Crie seus primeiros agentes
              </h1>
              <p className="text-white/70 text-lg">
                Comece gratuitamente e transforme visitantes em clientes.
              </p>
            </div>
          ) : (
            // Welcome Screen (Transição para Funcional)
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-normal text-white mb-4">
                Conta criada!
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Pronto para criar seu primeiro agente conversacional...
              </p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {step === 1 && (
            <>
              {error && (
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                    Nome completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    placeholder="Seu nome"
                  />
                </div>                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                  />
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 mt-1 border border-white/30 bg-white/10 rounded focus:ring-blue-400 focus:ring-offset-0"
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-white/70">
                    Eu concordo com os{" "}
                    <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                      Termos de Serviço
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>

                <OpenAIButton
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                  showArrow
                >
                  {loading ? "Criando conta..." : "Criar conta"}
                </OpenAIButton>
              </form>              <div className="mt-8 text-center">
                <p className="text-white/70 text-sm">
                  Já tem uma conta?{" "}
                  <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 underline">
                    Entrar
                  </Link>
                </p>
              </div>

              {/* OAuth Providers */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-black px-4 text-sm text-white/50">Ou continue com</span>
                  </div>
                </div>

                <div className="mt-6">
                  <OpenAIButton
                    variant="outline"
                    onClick={async () => {
                      const supabase = createClient()
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
                        }
                      })
                      
                      if (error) {
                        signIn("google", { callbackUrl: "/dashboard" })
                      }
                    }}
                    className="w-full justify-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continuar com Google
                  </OpenAIButton>
                </div>
              </div>

              {/* Benefícios */}
              <div className="mt-12 border border-white/10 rounded-lg p-6 bg-white/5">
                <h3 className="text-lg font-medium text-white mb-4">Por que escolher Agentes de Conversão?</h3>
                <ul className="space-y-3">
                  {[
                    "Acesso a modelos de IA de última geração",
                    "Ferramentas para criar agentes conversacionais personalizados", 
                    "Bases de conhecimento para alimentar seus agentes",
                    "Suporte técnico especializado"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start text-white/80">
                      <Check className="h-5 w-5 mr-3 flex-shrink-0 text-green-400 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}