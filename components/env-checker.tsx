"use client"

import { useState, useEffect } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function EnvChecker() {
  const [missingVars, setMissingVars] = useState<string[]>([])
  const [invalidUrls, setInvalidUrls] = useState<string[]>([])

  useEffect(() => {
    const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    const urlVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXTAUTH_URL"]

    const missing: string[] = []
    const invalid: string[] = []

    // Check for missing variables
    requiredVars.forEach((varName) => {
      if (!process.env[varName]) {
        missing.push(varName)
      }
    })

    // Check for invalid URLs
    urlVars.forEach((varName) => {
      const url = process.env[varName]
      if (url) {
        try {
          new URL(url)
        } catch (e) {
          invalid.push(`${varName}: ${url}`)
        }
      }
    })

    setMissingVars(missing)
    setInvalidUrls(invalid)
  }, [])

  if (missingVars.length === 0 && invalidUrls.length === 0) {
    return (
      <Alert className="bg-green-500/10 border-green-500/30">
        <AlertTitle className="text-green-400">Todas as variáveis de ambiente estão configuradas</AlertTitle>
        <AlertDescription className="text-green-300">
          Todas as variáveis de ambiente necessárias foram detectadas e estão configuradas corretamente.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
      <AlertTitle className="text-red-400">Problemas de Configuração Detectados</AlertTitle>
      <AlertDescription>
        {missingVars.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold text-red-300">Variáveis Ausentes:</p>
            <ul className="list-disc pl-5 text-red-400/80">
              {missingVars.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        )}

        {invalidUrls.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold text-red-300">URLs Inválidas:</p>
            <ul className="list-disc pl-5 text-red-400/80">
              {invalidUrls.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
