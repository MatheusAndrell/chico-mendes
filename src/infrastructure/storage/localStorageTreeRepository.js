import { isTree } from '../../domain/tree/Tree'

const KEY = 'chicomendes:minha-arvore'

/** Implementação do TreeRepository usando localStorage (à prova de modo privado). */
export function makeLocalStorageTreeRepository(storage = safeStorage()) {
  return {
    get() {
      try {
        const raw = storage?.getItem(KEY)
        if (!raw) return null
        const value = JSON.parse(raw)
        return isTree(value) ? value : null
      } catch {
        return null
      }
    },
    save(tree) {
      try {
        storage?.setItem(KEY, JSON.stringify(tree))
      } catch {
        /* sem armazenamento disponível: a árvore vale só nesta visita */
      }
    },
    clear() {
      try {
        storage?.removeItem(KEY)
      } catch {
        /* nada */
      }
    }
  }
}

function safeStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}
