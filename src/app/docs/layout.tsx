import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export const metadata: Metadata = {
  title: "Documentação da API | Agentes de Conversão",
  description: "Documentação completa da API Agentes de Conversão",
}

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Agentes de Conversão</span>
            </Link>
            <nav className="flex gap-6">
              <Link href="/docs" className="flex items-center text-sm font-medium">
                Documentação
              </Link>
              <Link href="/docs/api" className="flex items-center text-sm font-medium">
                API
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/sign-in">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Registrar</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pr-6">
            <div className="space-y-4">
              <div className="py-2">
                <h4 className="mb-2 text-sm font-semibold">Introdução</h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  <Link
                    href="/docs"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Visão Geral
                  </Link>
                  <Link
                    href="/docs/authentication"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Autenticação
                  </Link>
                </div>
              </div>
              <div className="py-2">
                <h4 className="mb-2 text-sm font-semibold">Agentes</h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  <Link
                    href="/docs/agents/create"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Criar Agente
                  </Link>
                  <Link
                    href="/docs/agents/query"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Consultar Agente
                  </Link>
                  <Link
                    href="/docs/agents/get"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Obter Agente
                  </Link>
                  <Link
                    href="/docs/agents/update"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Atualizar Agente
                  </Link>
                  <Link
                    href="/docs/agents/delete"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Excluir Agente
                  </Link>
                </div>
              </div>
              <div className="py-2">
                <h4 className="mb-2 text-sm font-semibold">Datastores</h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  <Link
                    href="/docs/datastores/create"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Criar Datastore
                  </Link>
                  <Link
                    href="/docs/datastores/query"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Consultar Datastore
                  </Link>
                </div>
              </div>
              <div className="py-2">
                <h4 className="mb-2 text-sm font-semibold">Datasources</h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  <Link
                    href="/docs/datasources/create"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    Criar Datasource
                  </Link>
                </div>
              </div>
              <div className="py-2">
                <h4 className="mb-2 text-sm font-semibold">Referência</h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  <Link
                    href="/docs/api"
                    className="flex w-full items-center rounded-md p-2 hover:bg-muted hover:text-foreground"
                  >
                    API OpenAPI
                  </Link>
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            <div className="space-y-2">{children}</div>
          </div>
        </main>
      </div>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Agentes de Conversão. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Termos
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
