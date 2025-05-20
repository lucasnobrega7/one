import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export function ApiDocsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentação da API</CardTitle>
        <CardDescription>Acesse a documentação completa da API Agentes de Conversão</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Nossa API permite que você integre os recursos da plataforma Agentes de Conversão diretamente em seus
          aplicativos e sistemas.
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Criar Agentes</span>
            <Link href="/docs/agents/create">
              <Button variant="ghost" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Docs
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Consultar Agentes</span>
            <Link href="/docs/agents/query">
              <Button variant="ghost" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Docs
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Gerenciar Datastores</span>
            <Link href="/docs/datastores/create">
              <Button variant="ghost" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Docs
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <Link href="/docs">
            <Button className="w-full">Acessar Documentação Completa</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
