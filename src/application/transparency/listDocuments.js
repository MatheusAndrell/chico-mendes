/**
 * Caso de uso: filtrar e agrupar documentos do Portal da Transparência.
 */

const normalizar = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export function filterDocuments(docs, { busca = '', categoria = 'todas', ano = 'todos' } = {}) {
  const q = normalizar(busca.trim())
  return docs.filter(
    (d) =>
      (categoria === 'todas' || d.categoria === categoria) &&
      (ano === 'todos' || String(d.ano ?? 'sem-ano') === String(ano)) &&
      (!q || normalizar(d.titulo).includes(q))
  )
}

/** Agrupa por ano (mais recente primeiro); documentos sem ano ficam em "Institucional". */
export function groupByYear(docs) {
  const grupos = new Map()
  docs.forEach((d) => {
    const k = d.ano ?? 'sem-ano'
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k).push(d)
  })
  return [...grupos.entries()]
    .sort(([a], [b]) => (a === 'sem-ano' ? 1 : b === 'sem-ano' ? -1 : b - a))
    .map(([ano, itens]) => ({ ano, itens: itens.sort((x, y) => x.ordem - y.ordem) }))
}

export function availableYears(docs) {
  return [...new Set(docs.map((d) => d.ano).filter(Boolean))].sort((a, b) => b - a)
}
