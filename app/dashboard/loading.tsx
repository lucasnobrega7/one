export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Skeleton */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="h-8 bg-gray-800 rounded animate-pulse w-32"></div>
              <nav className="hidden md:flex space-x-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-800 rounded animate-pulse w-20"></div>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-gray-800 rounded-full animate-pulse w-16"></div>
              <div className="h-4 bg-gray-800 rounded animate-pulse w-24"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="h-8 bg-gray-800 rounded animate-pulse w-48 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded animate-pulse w-64"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="h-4 bg-gray-800 rounded animate-pulse w-20 mb-3"></div>
              <div className="h-8 bg-gray-800 rounded animate-pulse w-16 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded animate-pulse w-12"></div>
            </div>
          ))}
        </div>

        {/* Agents Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-800 rounded animate-pulse w-32"></div>
            <div className="h-10 bg-gray-800 rounded animate-pulse w-24"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="h-5 bg-gray-800 rounded animate-pulse w-32 mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-800 rounded-full animate-pulse w-16"></div>
                </div>
                <div className="h-4 bg-gray-800 rounded animate-pulse w-full mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-800 rounded animate-pulse w-20"></div>
                  <div className="h-8 bg-gray-800 rounded animate-pulse w-8"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="h-5 bg-gray-800 rounded animate-pulse w-40 mb-4"></div>
            <div className="h-32 bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="h-5 bg-gray-800 rounded animate-pulse w-32 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-800 rounded animate-pulse w-24"></div>
                  <div className="h-4 bg-gray-800 rounded animate-pulse w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}