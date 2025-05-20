"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSignIn } from "@clerk/nextjs"

interface LoginButtonProps {
  redirectUrl?: string
  mode?: "redirect" | "modal"
  className?: string
  children?: React.ReactNode
}

export function LoginButton({ redirectUrl = "/dashboard", mode = "redirect", className, children }: LoginButtonProps) {
  const router = useRouter()
  const { signIn, isLoaded } = useSignIn()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!isLoaded) return

    setIsLoading(true)

    try {
      if (mode === "redirect") {
        // Redirecionar para a página de login do Clerk
        await signIn.create({
          strategy: "oauth_google",
          redirectUrl: `${window.location.origin}/sso-callback?redirect=${redirectUrl}`,
        })
      } else {
        // Redirecionar para a página de login personalizada
        router.push("/sign-in")
      }
    } catch (error) {
      console.error("Erro ao iniciar login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogin} disabled={isLoading || !isLoaded} className={className}>
      {isLoading ? "Carregando..." : children || "Entrar"}
    </Button>
  )
}
