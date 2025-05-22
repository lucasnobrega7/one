import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, Globe, Webhook } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentação | Agentes de Conversão",
  description: "Documentação completa para a plataforma Agentes de Conversão",
}

export default function DocsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentação</h1>
          <p className="text-muted-foreground mt-2">
            Bem-vindo à documentação completa da plataforma Agentes de Conversão.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/docs/api-reference">
            <Card className="h-full hover:bg-accent/50 transition-colors">
              <CardHeader>
                <FileText className="h-8 w-8 mb-2" />
                <CardTitle>Referência da API</CardTitle>
                <CardDescription>Documentação completa de todos os endpoints da API</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ver documentação</span>
                <ArrowRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/http-tools">
            <Card className="h-full hover:bg-accent/50 transition-colors">
              <CardHeader>
                <Globe className="h-8 w-8 mb-2" />
                <CardTitle>HTTP Tools</CardTitle>
                <CardDescription>Integre seus agentes com ferramentas externas via HTTP</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ver documentação</span>
                <ArrowRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/webhooks">
            <Card className="h-full hover:bg-accent/50 transition-colors">
              <CardHeader>
                <Webhook className="h-8 w-8 mb-2" />
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Configure webhooks para receber notificações de eventos</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ver documentação</span>
                <ArrowRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/n8n-integration">
            <Card className="h-full hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle>Integração com N8N</CardTitle>
                <CardDescription>Como integrar seus agentes com o N8N para automação</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ver integração</span>
                <ArrowRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
