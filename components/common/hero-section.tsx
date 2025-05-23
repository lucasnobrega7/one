import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full"></div>
            <span className="font-medium text-lg">Agentes de Conversão</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/docs" className="text-sm text-white hover:underline">
              Documentação
            </Link>
            <Link href="/pricing" className="text-sm text-white hover:underline">
              Preços
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-black"
              asChild
            >
              <Link href="/auth/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-20">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white">
              Agentes de IA para conversão
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Transforme seu conhecimento em agentes conversacionais inteligentes para aumentar suas taxas de conversão
              e engajamento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" className="border border-white bg-white text-black hover:bg-white/90" asChild>
                <Link href="/auth/signup">Começar Gratuitamente</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border border-white text-white hover:bg-white hover:text-black"
                asChild
              >
                <Link href="/demo">Ver Demonstração</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-black">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="border-t border-white/20 pt-12">
                <h3 className="text-2xl font-serif mb-4 underline">
                  Agentes humanizados que vendem de verdade.
                </h3>
                <Link href="/about" className="text-sm text-white underline hover:no-underline">
                  Saiba mais sobre nós
                </Link>
              </div>
              <div className="border-t border-white/20 pt-12">
                <h3 className="text-2xl font-serif mb-4 underline">Pesquisa pioneira em IA conversacional</h3>
                <Link href="/research" className="text-sm text-white underline hover:no-underline">
                  Conheça nossa pesquisa
                </Link>
              </div>
              <div className="border-t border-white/20 pt-12">
                <h3 className="text-2xl font-serif mb-4 underline">Transformando trabalho e criatividade com IA</h3>
                <Link href="/products" className="text-sm text-white underline hover:no-underline">
                  Explore nossos produtos
                </Link>
              </div>
              <div className="border-t border-white/20 pt-12">
                <h3 className="text-2xl font-serif mb-4 underline">
                  Junte-se a nós para moldar o futuro da tecnologia
                </h3>
                <Link href="/careers" className="text-sm text-white underline hover:no-underline">
                  Ver carreiras
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/20 py-12 bg-black">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span className="font-medium">Agentes de Conversão</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-sm text-white hover:underline">
                Sobre
              </Link>
              <Link href="/blog" className="text-sm text-white hover:underline">
                Blog
              </Link>
              <Link href="/contact" className="text-sm text-white hover:underline">
                Contato
              </Link>
              <Link href="/terms" className="text-sm text-white hover:underline">
                Termos
              </Link>
              <Link href="/privacy" className="text-sm text-white hover:underline">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
