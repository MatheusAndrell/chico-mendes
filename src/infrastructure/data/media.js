/**
 * Fotos da Associação.
 *
 * A lista fica em `fotos.json`. Cada foto que já foi baixada para `public/fotos/`
 * (campo `arquivo`, preenchido por `npm run fotos`) é servida pelo próprio site.
 * As que ainda não foram baixadas continuam vindo do site antigo (Wix).
 */
import MANIFESTO from './fotos.json'

const WIX = 'https://static.wixstatic.com/media/'

function wix(id, alt, { w, h }) {
  return {
    alt,
    src: (width = w, height = Math.round((width * h) / w)) =>
      `${WIX}${id}/v1/fill/w_${width},h_${height},al_c,q_80/${id.replace('~mv2', '')}`,
    ratio: w / h
  }
}

// Imagem hospedada no próprio projeto (pasta /public)
function local(path, alt, { w, h }) {
  return { alt, src: () => path, ratio: w / h, local: true }
}

const fotos = Object.fromEntries(
  Object.entries(MANIFESTO).map(([chave, f]) => [
    chave,
    f.arquivo ? local(`/fotos/${f.arquivo}`, f.alt, f) : wix(f.id, f.alt, f)
  ])
)

export const FOTOS = {
  ...fotos,
  informativo1: local('/blogs/informativo-1.avif', 'Informativo Chico Mendes nº 1, agosto de 2019', { w: 720, h: 960 }),
  informativo2: local('/blogs/informativo-2.avif', 'Informativo Chico Mendes nº 2, setembro de 2019', { w: 539, h: 718 }),
  informativo3: local('/blogs/informativo-3.avif', 'Informativo Chico Mendes nº 3, novembro de 2019', { w: 541, h: 709 })
}
