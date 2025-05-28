import { Loader2, Server } from "lucide-react"

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Server className="w-8 h-8 text-[#46B2E0]" />
          <h1 className="text-3xl font-bold text-white">Dashboard de APIs</h1>
        </div>
        <div className="h-4 bg-[#27272a] rounded w-64"></div>
      </div>

      {/* Status Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#1a1a1d] border border-[#27272a] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-[#27272a] rounded"></div>
              <div className="h-4 bg-[#27272a] rounded w-16"></div>
            </div>
            <div className="h-3 bg-[#27272a] rounded w-12"></div>
          </div>
        ))}
      </div>

      {/* Loading spinner centered */}
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#46B2E0]" />
        <span className="ml-3 text-white/70">Carregando dashboard...</span>
      </div>
    </div>
  )
}
