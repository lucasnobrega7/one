"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { createClient } from '@/lib/database/supabase-utils/client'
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Loader2, ArrowRight } from "lucide-react"

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      // Try Supabase auth first
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        // Fallback to NextAuth credentials
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        })

        if (result?.error) {
          setError("Email ou senha incorretos")
          setIsLoading(false)
          return
        }
      }

      // Successful login
      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Try Supabase OAuth first
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${callbackUrl}`
        }
      })

      if (error) {
        // Fallback to NextAuth
        await signIn("google", { callbackUrl })
      }
    } catch (error) {
      setError("Ocorreu um erro ao fazer login com Google. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 py-4 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM14.5 21.5C14.5 22.881 13.381 24 12 24C10.619 24 9.5 22.881 9.5 21.5C9.5 20.119 10.619 19 12 19C13.381 19 14.5 20.119 14.5 21.5ZM14.5 10.5C14.5 11.881 13.381 13 12 13C10.619 13 9.5 11.881 9.5 10.5C9.5 9.119 10.619 8 12 8C13.381 8 14.5 9.119 14.5 10.5ZM20 16C20 17.381 18.881 18.5 17.5 18.5C16.119 18.5 15 17.381 15 16C15 14.619 16.119 13.5 17.5 13.5C18.881 13.5 20 14.619 20 16ZM22.5 21.5C22.5 22.881 21.381 24 20 24C18.619 24 17.5 22.881 17.5 21.5C17.5 20.119 18.619 19 20 19C21.381 19 22.5 20.119 22.5 21.5ZM22.5 10.5C22.5 11.881 21.381 13 20 13C18.619 13 17.5 11.881 17.5 10.5C17.5 9.119 18.619 8 20 8C21.381 8 22.5 9.119 22.5 10.5Z"
                fill="currentColor"
              />
            </svg>
            <span className="font-medium text-xl">Agentes de Conversão</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Entrar na sua conta</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Bem-vindo de volta! Por favor, entre com suas credenciais.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex gap-3 text-red-800 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                placeholder="seu@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className={`mt-1 block w-full rounded-md border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19.99 10.187c0-.82-.069-1.417-.216-2.037H10.2v3.698h5.62c-.113.92-.725 2.303-2.084 3.233l-.02.124 3.028 2.292.21.02c1.926-1.738 3.037-4.296 3.037-7.33z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.2 19.931c2.753 0 5.064-.886 6.753-2.414l-3.218-2.436c-.862.587-2.017.997-3.536.997-2.697 0-4.983-1.778-5.8-4.228l-.12.01-3.148 2.38-.041.112c1.677 3.256 5.122 5.48 9.11 5.48z"
                        fill="#34A853"
                      />
                      <path
                        d="M4.4 11.85c-.21-.618-.329-1.28-.329-1.968 0-.688.119-1.35.318-1.968l-.005-.132L1.2 5.365l-.108.047C.438 6.68 0 8.386 0 10.182s.437 3.502 1.092 4.77l3.308-2.502z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.2 3.958c1.917 0 3.208.807 3.943 1.482l2.878-2.746C15.253 1.023 12.953 0 10.199 0 6.212 0 2.766 2.223 1.09 5.48l3.342 2.536C5.247 5.766 7.534 3.958 10.2 3.958z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continuar com Google
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta?{" "}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
