/**
 * Formata uma data para exibição
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/**
 * Formata uma data e hora para exibição
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Retorna a diferença entre duas datas em formato legível
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? "ano" : "anos"} atrás`
  }

  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? "mês" : "meses"} atrás`
  }

  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? "dia" : "dias"} atrás`
  }

  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? "hora" : "horas"} atrás`
  }

  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? "minuto" : "minutos"} atrás`
  }

  return `${Math.floor(seconds)} ${Math.floor(seconds) === 1 ? "segundo" : "segundos"} atrás`
}
