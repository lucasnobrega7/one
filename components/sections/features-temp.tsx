export function Features() {
  return (
    <section className="py-16 bg-[#111111]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Recursos Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-[#39ff14] text-2xl font-bold">87%</div>
            <div className="text-gray-400">Margem Líquida</div>
          </div>
          <div className="text-center">
            <div className="text-[#39ff14] text-2xl font-bold">300+</div>
            <div className="text-gray-400">Modelos IA</div>
          </div>
          <div className="text-center">
            <div className="text-[#39ff14] text-2xl font-bold">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  )
}