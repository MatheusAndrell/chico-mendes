/**
 * Entidade: a árvore que cada visitante planta na Floresta Viva.
 * Regra de negócio: cada visitante (navegador) planta apenas UMA árvore.
 */

export const NOME_MAX = 40

export class TreeAlreadyPlantedError extends Error {
  constructor() {
    super('Você já plantou a sua árvore.')
    this.name = 'TreeAlreadyPlantedError'
  }
}

export class InvalidSpeciesError extends Error {
  constructor(id) {
    super(`Espécie desconhecida: ${id}`)
    this.name = 'InvalidSpeciesError'
  }
}

/**
 * @typedef {Object} Tree
 * @property {string} id
 * @property {string} nome      Nome de quem plantou (pode ser vazio)
 * @property {string} especie   id da espécie
 * @property {string} data      ISO date
 * @property {number} x         posição na floresta
 * @property {number} z
 */

export function createTree({ nome = '', especie, x, z, now = new Date(), especiesValidas = [] }) {
  if (!especiesValidas.includes(especie)) throw new InvalidSpeciesError(especie)
  return Object.freeze({
    id: now.getTime().toString(36),
    nome: String(nome).trim().slice(0, NOME_MAX),
    especie,
    data: now.toISOString(),
    x: Number(x.toFixed(3)),
    z: Number(z.toFixed(3))
  })
}

/** Valida dados vindos do armazenamento (podem estar corrompidos). */
export function isTree(value) {
  return (
    !!value &&
    typeof value.id === 'string' &&
    typeof value.especie === 'string' &&
    typeof value.data === 'string' &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.z)
  )
}
