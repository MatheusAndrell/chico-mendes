import dados from '../data/transparencia.json'

/** Documentos do Portal da Transparência (gerados por scripts/organizar-transparencia.py). */
export const transparencyRepository = {
  list() {
    return dados.map((d) => ({ ...d, url: `/docs/${d.arquivo}` }))
  }
}
