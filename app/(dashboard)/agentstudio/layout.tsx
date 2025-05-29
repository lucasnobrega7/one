import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workflow Builder | Agentes de Conversão',
  description: 'Visual workflow automation builder for AI agents',
}

export default function WorkflowBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#1e1e1e]">
      {children}
    </div>
  )
}