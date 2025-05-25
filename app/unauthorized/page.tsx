import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-destructive">Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar esta página.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Entre em contato com o administrador do sistema se você acredita que isso é um erro.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Voltar ao Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                Página Inicial
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}