import { AuthCheck } from "@/components/features/auth/auth-check"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { KnowledgeBaseList } from "@/components/features/dashboard/knowledge-base-list"

export default function KnowledgeBasePage() {
  return (
    <AuthCheck>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Bases de Conhecimento</h1>
            <a
              href="/dashboard/knowledge/new"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Nova Base de Conhecimento
            </a>
          </div>

          <KnowledgeBaseList />
        </div>
      </DashboardLayout>
    </AuthCheck>
  )
}
