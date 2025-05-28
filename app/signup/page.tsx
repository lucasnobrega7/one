'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function SignupRedirect() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://login.agentesdeconversao.ai/signup'
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#46B2E0] mx-auto" />
        <h2 className="text-xl font-semibold text-white">Redirecionando...</h2>
        <p className="text-gray-400">
          Você será redirecionado para o dashboard em instantes.
        </p>
      </div>
    </div>
  )
}