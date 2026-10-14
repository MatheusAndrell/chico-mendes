import { lazy } from 'react'

const CHAVE = 'chicomendes:recarregou-por-chunk'

export const isChunkError = (e) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk/i.test(
    String(e?.message ?? e)
  )

/**
 * React.lazy com nova tentativa.
 * Se o arquivo da página não carregar (servidor de desenvolvimento reiniciado,
 * cache antigo do navegador ou um deploy novo na Vercel), tenta de novo e,
 * se ainda falhar, recarrega a página uma única vez para buscar a versão atual.
 */
export function lazyPage(importer) {
  return lazy(async () => {
    try {
      const mod = await importer()
      sessionStorage.removeItem(CHAVE)
      return mod
    } catch (e) {
      if (!isChunkError(e)) throw e
      await new Promise((r) => setTimeout(r, 400))
      try {
        return await importer()
      } catch (e2) {
        if (!sessionStorage.getItem(CHAVE)) {
          sessionStorage.setItem(CHAVE, '1')
          window.location.reload()
          return new Promise(() => {})
        }
        throw e2
      }
    }
  })
}
