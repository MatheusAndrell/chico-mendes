/**
 * Entidade: documento do Portal da Transparência.
 *
 * @typedef {Object} TransparencyDocument
 * @property {number} ordem      posição no site original
 * @property {string} titulo     título exatamente como no site
 * @property {string} arquivo    nome do PDF em /public/docs
 * @property {string} url
 * @property {'contratos'|'parcerias'|'relatorios'|'contabil'|'institucional'} categoria
 * @property {number|null} ano
 * @property {number} tamanho    bytes
 */

export const CATEGORIAS = [
  { id: 'parcerias', nome: 'Termos e parcerias' },
  { id: 'relatorios', nome: 'Relatórios de atividades' },
  { id: 'contabil', nome: 'Demonstrações contábeis' },
  { id: 'contratos', nome: 'Contratos' },
  { id: 'institucional', nome: 'Institucional' }
]

export const nomeCategoria = (id) => CATEGORIAS.find((c) => c.id === id)?.nome ?? id

export function formatarTamanho(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}
