// 🚀 Next.js 15: Exemplo de uso das novas Async Request APIs
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string; filter?: string }>
}

// ✅ Next.js 15: Server Component com APIs assíncronas
export default async function ModernPage({ params, searchParams }: PageProps) {
  // 🚀 BREAKING CHANGE: Todas essas APIs agora requerem await
  const cookieStore = await cookies()
  const headersList = await headers()
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  // ✅ Exemplo de uso das cookies
  const theme = cookieStore.get('theme')?.value || 'dark'
  const sessionId = cookieStore.get('session-id')?.value
  
  // ✅ Exemplo de uso dos headers
  const userAgent = headersList.get('user-agent')
  const authorization = headersList.get('authorization')
  const clientIP = headersList.get('x-forwarded-for') || 
                   headersList.get('x-real-ip')

  // ✅ Validation e redirecionamento
  if (!sessionId) {
    redirect('/auth/login')
  }

  // ✅ Processamento dos parâmetros
  const { id } = resolvedParams
  const { tab = 'overview', filter } = resolvedSearchParams

  // ✅ Exemplo de busca de dados baseada nos parâmetros
  const userData = await fetch(`https://api.agentesdeconversao.com.br/users/${id}`, {
    headers: {
      'Authorization': authorization || '',
      'User-Agent': userAgent || '',
      'X-Client-IP': clientIP || '',
    },
    // Next.js 15: fetch não é mais cached por padrão
    cache: 'force-cache', // Explicitamente definir cache se necessário
  }).then(res => res.json())

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 p-4">
        <h1 className="text-2xl font-bold">
          Next.js 15 - Modern Component
        </h1>
        <p className="text-zinc-400">
          Theme: {theme} | Tab: {tab} | User: {userData?.name}
        </p>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Headers Info */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Request Headers</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-400">User Agent:</span>
                <div className="font-mono text-xs break-all">{userAgent}</div>
              </div>
              <div>
                <span className="text-zinc-400">Client IP:</span>
                <span className="ml-2">{clientIP || 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* Params & Search Params */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Parameters</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-400">ID:</span>
                <span className="ml-2 font-mono">{id}</span>
              </div>
              <div>
                <span className="text-zinc-400">Tab:</span>
                <span className="ml-2">{tab}</span>
              </div>
              {filter && (
                <div>
                  <span className="text-zinc-400">Filter:</span>
                  <span className="ml-2">{filter}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Cookies</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-400">Theme:</span>
                <span className="ml-2">{theme}</span>
              </div>
              <div>
                <span className="text-zinc-400">Session:</span>
                <span className="ml-2 font-mono text-xs">
                  {sessionId ? `${sessionId.substring(0, 8)}...` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* User Data */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">User Data</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-400">Name:</span>
                <span className="ml-2">{userData?.name || 'Loading...'}</span>
              </div>
              <div>
                <span className="text-zinc-400">Email:</span>
                <span className="ml-2">{userData?.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ✅ Metadata dinâmica com async params
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  
  return {
    title: `User ${id} - Agentes de Conversão`,
    description: `Profile page for user ${id}`,
  }
}