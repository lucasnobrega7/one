'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center p-4">
      <h1 className="text-3xl font-bold">Ocorreu um erro</h1>
      <p className="text-muted-foreground">Não foi possível carregar esta página.</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Tentar novamente</Button>
        <Link href="/dashboard">
          <Button variant="outline">Ir para o Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Voltar para Home</Button>
        </Link>
      </div>
    </div>
  )
}