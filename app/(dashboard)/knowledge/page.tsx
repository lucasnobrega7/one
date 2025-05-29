import { AuthCheck } from "@/components/features/auth/auth-check"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { KnowledgeBaseList } from "@/components/features/dashboard/knowledge-base-list"

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white/90 mb-2">Conhecimentos</h1>
          <p className="text-white/70">Adicione dados e documentos para treinar seus agentes</p>
        </div>
        <a
          href="/dashboard/knowledge/new"
          className="bg-gradient-to-r from-[#46B2E0] to-[#8A53D2] text-white px-6 py-3 rounded-lg hover:from-[#46B2E0]/90 hover:to-[#8A53D2]/90 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          + Adicionar Conhecimento
        </a>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Cards de tipos de conhecimento */}
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Documentos</h3>
                <p className="text-gray-400 text-sm mb-4">PDF, DOCX, TXT e outros formatos</p>
                <div className="text-xs text-gray-500">5 documentos ativos</div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/30">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Páginas Web</h3>
                <p className="text-gray-400 text-sm mb-4">URLs e conteúdo online</p>
                <div className="text-xs text-gray-500">3 URLs indexadas</div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 border border-purple-500/30">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Q&A</h3>
                <p className="text-gray-400 text-sm mb-4">Perguntas e respostas personalizadas</p>
                <div className="text-xs text-gray-500">12 pares Q&A</div>
              </div>
            </div>

      <KnowledgeBaseList />
    </div>
  )
}
