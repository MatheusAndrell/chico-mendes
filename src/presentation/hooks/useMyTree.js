import { useCallback, useState } from 'react'
import { treeUseCases } from '../../app/container'

/** Estado da árvore do visitante (uma por navegador). */
export function useMyTree() {
  const [tree, setTree] = useState(() => treeUseCases.getMyTree())
  const [fresh, setFresh] = useState(false)
  const [error, setError] = useState(null)

  const plant = useCallback((dados) => {
    try {
      const t = treeUseCases.plantTree(dados)
      setTree(t)
      setFresh(true)
      setError(null)
      return t
    } catch (e) {
      setError(e.message)
      return null
    }
  }, [])

  return { tree, fresh, error, plant }
}
