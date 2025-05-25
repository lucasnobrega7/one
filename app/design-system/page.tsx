"use client"

import { useState } from "react"
import { OpenAIButton } from "@/components/ui/openai-button"
import { OpenAICard, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/openai-card"
import { OpenAIInput, OpenAITextarea } from "@/components/ui/openai-input"
import { LoadingSkeleton, LoadingSpinner, LoadingCard, LoadingButton } from "@/components/ui/loading-states"
import { Brain, MessageSquare, BarChart3, Code, Palette, Sparkles } from "lucide-react"

export default function DesignSystemPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="openai-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-semibold">Design System OpenAI</span>
            </div>
            <OpenAIButton variant="primary">Ver Código</OpenAIButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 openai-card-elevated px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Sistema completo implementado
          </div>
          
          <h1 className="openai-heading text-5xl md:text-7xl mb-8">
            Design System OpenAI
          </h1>
          
          <p className="openai-body text-xl mb-12 max-w-3xl mx-auto">
            Todos os componentes, estilos e padrões visuais implementados seguindo 
            as especificações oficiais da OpenAI para máxima autenticidade.
          </p>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="openai-heading text-3xl mb-8">Botões OpenAI</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="openai-caption uppercase tracking-wider">Primary</h3>
              <OpenAIButton variant="primary" size="sm">Small</OpenAIButton>
              <OpenAIButton variant="primary">Default</OpenAIButton>
              <OpenAIButton variant="primary" size="lg">Large</OpenAIButton>
            </div>
            <div className="space-y-4">
              <h3 className="openai-caption uppercase tracking-wider">Secondary</h3>
              <OpenAIButton variant="secondary" size="sm">Small</OpenAIButton>
              <OpenAIButton variant="secondary">Default</OpenAIButton>
              <OpenAIButton variant="secondary" size="lg">Large</OpenAIButton>
            </div>
            <div className="space-y-4">
              <h3 className="openai-caption uppercase tracking-wider">Ghost</h3>
              <OpenAIButton variant="ghost" size="sm">Small</OpenAIButton>
              <OpenAIButton variant="ghost">Default</OpenAIButton>
              <OpenAIButton variant="ghost" size="lg">Large</OpenAIButton>
            </div>
            <div className="space-y-4">
              <h3 className="openai-caption uppercase tracking-wider">Danger</h3>
              <OpenAIButton variant="danger" size="sm">Small</OpenAIButton>
              <OpenAIButton variant="danger">Default</OpenAIButton>
              <OpenAIButton variant="danger" size="lg">Large</OpenAIButton>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="openai-heading text-3xl mb-8">Cards OpenAI</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <OpenAICard variant="default">
              <CardHeader>
                <div className="w-10 h-10 elevation-1 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <CardTitle>Card Padrão</CardTitle>
                <CardDescription>
                  Card básico com hover states sutis e transições suaves.
                </CardDescription>
              </CardHeader>
            </OpenAICard>

            <OpenAICard variant="elevated">
              <CardHeader>
                <div className="w-10 h-10 elevation-1 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <CardTitle>Card Elevado</CardTitle>
                <CardDescription>
                  Card com elevação baseada em light para criar hierarquia visual.
                </CardDescription>
              </CardHeader>
            </OpenAICard>

            <OpenAICard variant="interactive">
              <CardHeader>
                <div className="w-10 h-10 elevation-1 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <CardTitle>Card Interativo</CardTitle>
                <CardDescription>
                  Card com animações de hover mais pronunciadas para elementos clicáveis.
                </CardDescription>
              </CardHeader>
            </OpenAICard>
          </div>
        </section>

        {/* Forms Section */}
        <section className="mb-16">
          <h2 className="openai-heading text-3xl mb-8">Formulários OpenAI</h2>
          <OpenAICard variant="elevated" className="max-w-2xl">
            <CardHeader>
              <CardTitle>Exemplo de Formulário</CardTitle>
              <CardDescription>
                Inputs e textareas com focus states e estilos consistentes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="openai-body block mb-2">Nome completo</label>
                <OpenAIInput placeholder="Digite seu nome completo" />
              </div>
              <div>
                <label className="openai-body block mb-2">Email</label>
                <OpenAIInput type="email" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="openai-body block mb-2">Mensagem</label>
                <OpenAITextarea placeholder="Como podemos ajudar?" />
              </div>
              <div className="flex gap-4">
                <LoadingButton disabled={isLoading} onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => setIsLoading(false), 2000)
                }}>
                  Enviar Mensagem
                </LoadingButton>
                <OpenAIButton variant="ghost">Cancelar</OpenAIButton>
              </div>
            </CardContent>
          </OpenAICard>
        </section>

        {/* Loading States */}
        <section className="mb-16">
          <h2 className="openai-heading text-3xl mb-8">Estados de Loading</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="openai-body mb-4">Skeletons</h3>
              <div className="space-y-4">
                <LoadingSkeleton />
                <LoadingSkeleton lines={3} />
                <LoadingSkeleton width="60%" />
              </div>
            </div>
            <div>
              <h3 className="openai-body mb-4">Loading Card</h3>
              <LoadingCard showAvatar lines={4} />
            </div>
          </div>
        </section>

        {/* Code Syntax */}
        <section className="mb-16">
          <h2 className="openai-heading text-3xl mb-8">Syntax Highlighting</h2>
          <div className="syntax-highlight">
            <code>
{`const <span class="function">createAgent</span> = (<span class="keyword">config</span>) => {
  <span class="keyword">return</span> {
    <span class="string">"name"</span>: config.name,
    <span class="string">"model"</span>: <span class="string">"gpt-4"</span>,
    <span class="string">"temperature"</span>: <span class="number">0.7</span>
  }
}`}
            </code>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="openai-heading text-3xl mb-8">Tipografia</h2>
          <div className="space-y-6">
            <div>
              <h1 className="openai-heading text-6xl">Heading XL</h1>
              <p className="openai-caption">Font: Inter, Weight: Bold, Line Height: 1.1</p>
            </div>
            <div>
              <h2 className="openai-heading text-4xl">Heading Large</h2>
              <p className="openai-caption">Font: Inter, Weight: Bold, Line Height: 1.2</p>
            </div>
            <div>
              <p className="openai-body text-xl">
                Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="openai-caption">Font: Inter, Weight: Regular, Line Height: 1.6</p>
            </div>
            <div>
              <p className="openai-body">
                Body Default - Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="openai-caption">Font: Inter, Weight: Regular, Line Height: 1.6</p>
            </div>
            <div>
              <p className="openai-caption">
                Caption - Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
              </p>
              <p className="openai-caption">Font: Inter, Weight: Regular, Line Height: 1.4</p>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="openai-heading text-3xl mb-8">Paleta de Cores</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-3">
              <div className="w-full h-16 bg-white rounded-lg border border-gray-700"></div>
              <div className="openai-caption">White #FFFFFF</div>
            </div>
            <div className="space-y-3">
              <div className="w-full h-16 bg-gray-800 rounded-lg border border-gray-700"></div>
              <div className="openai-caption">Gray 800 #1F2937</div>
            </div>
            <div className="space-y-3">
              <div className="w-full h-16 bg-blue-500 rounded-lg border border-gray-700"></div>
              <div className="openai-caption">Blue #3B82F6</div>
            </div>
            <div className="space-y-3">
              <div className="w-full h-16 bg-black rounded-lg border border-gray-700"></div>
              <div className="openai-caption">Black #000000</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}