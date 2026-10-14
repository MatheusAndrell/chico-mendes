import { useEffect } from 'react'

const BASE = 'Chico Mendes · Cabuçu'

export function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : `${BASE} · Associação Cultural e Ambiental`
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
