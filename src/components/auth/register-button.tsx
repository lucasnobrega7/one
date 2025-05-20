"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSignUp } from "@clerk/nextjs"

interface RegisterButtonProps {
  redirectUrl?: string
  mode?: "redirect" | "modal"
  className?: string
  children?: React.ReactNode
}

export function RegisterButton({
  redirectUrl = "/dashboard",
  mode = "redirect",
  className,
  children,
}: RegisterButtonProps) {
  const router = useRouter()
  const { signUp, isLoaded } = useSignUp()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    if (!isLoaded) return

    setIsLoading(true)

    try {
      if (mode === "redirect") {
        // Redirecionar para a página de registro do Clerk
        await signUp.create({
          strategy: "oauth_google",
          redirectUrl: `${window.location.origin}/sso-callback?redirect=${redirectUrl}`,
        })
      } else {
        // Redirecionar para a página de registro personalizada
        router.push("/sign-up")
      }
    } catch (error) {
      console.error("Erro ao iniciar registro:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleRegister} disabled={isLoading || !isLoaded} className={className}>
      {isLoading ? "Carregando..." : children || "Registrar"}
    </Button>
  )
}
