import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center p-4">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground">Desculpe, não conseguimos encontrar o que você procura.</p>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button>Ir para o Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Voltar para Home</Button>
        </Link>
      </div>
    </div>
  )
}