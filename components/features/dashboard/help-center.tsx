"use client"

import { useState } from "react"
import { Search, Book, Video, MessageSquare, FileText, ChevronRight } from "lucide-react"

const helpCategories = [
  {
    id: "getting-started",
    title: "Primeiros Passos",
    icon: Book,
    description: "Aprenda o básico sobre como usar a plataforma",
    articles: [
      { id: "1", title: "Como criar sua primeira conta" },
      { id: "2", title: "Navegando pelo dashboard" },
      { id: "3", title: "Entendendo os tipos de agentes" },
      { id: "4", title: "Criando sua primeira base de conhecimento" },
    ],
  },
  {
    id: "agents",
    title: "Agentes",
    icon: MessageSquare,
    description: "Tudo sobre criação e gerenciamento de agentes",
    articles: [
      { id: "5", title: "Como criar um agente eficiente" },
      { id: "6", title: "Personalizando respostas do agente" },
      { id: "7", title: "Integrando agentes ao seu site" },
      { id: "8", title: "Analisando o desempenho do agente" },
    ],
  },
  {
    id: "knowledge-base",
    title: "Base de Conhecimento",
    icon: FileText,
    description: "Gerenciando suas bases de conhecimento",
    articles: [
      { id: "9", title: "Importando documentos para sua base" },
      { id: "10", title: "Formatos de arquivo suportados" },
      { id: "11", title: "Organizando sua base de conhecimento" },
      { id: "12", title: "Conectando bases de conhecimento aos agentes" },
    ],
  },
  {
    id: "tutorials",
    title: "Tutoriais em Vídeo",
    icon: Video,
    description: "Aprenda visualmente com nossos tutoriais",
    articles: [
      { id: "13", title: "Tour completo da plataforma" },
      { id: "14", title: "Criando um agente de vendas eficaz" },
      { id: "15", title: "Configurando webhooks e integrações" },
      { id: "16", title: "Analisando métricas e melhorando conversões" },
    ],
  },
]

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCategories = searchQuery
    ? helpCategories.filter(
        (category) =>
          category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.articles.some((article) => article.title.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : helpCategories

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-2xl font-medium mb-2">Como podemos ajudar?</h2>
          <p className="text-gray-400">Pesquise em nossa base de conhecimento ou navegue pelas categorias abaixo</p>
        </div>

        <div className="max-w-xl mx-auto relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Pesquisar artigos, tutoriais..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-750 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
            >
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                  <category.icon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-400">{category.description}</p>
                </div>
              </div>

              {selectedCategory === category.id && (
                <div className="mt-4 pl-14">
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article.id}>
                        <a
                          href={`/dashboard/help/article/${article.id}`}
                          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4 mr-1" />
                          <span className="text-sm">{article.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Ainda precisa de ajuda?</h3>
          <p className="text-gray-400 mb-6">Nossa equipe de suporte está pronta para ajudar</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/dashboard/help/contact"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Contatar Suporte
            </a>
            <a
              href="/dashboard/help/faq"
              className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Ver Perguntas Frequentes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
