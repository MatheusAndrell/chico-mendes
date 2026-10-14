import { useState } from 'react'
import s from './Photo.module.css'

/**
 * Átomo: foto com srcset responsivo, carregamento preguiçoso e
 * fundo suave enquanto carrega (ou se a imagem falhar).
 */
export function Photo({ foto, ratio, sizes = '100vw', priority = false, rounded = 'lg', position = 'center', className = '' }) {
  const [erro, setErro] = useState(false)
  if (!foto) return null
  const r = ratio ?? foto.ratio
  const widths = [480, 800, 1200, 1600]
  return (
    <div className={[s.frame, s[rounded], className].join(' ')} style={{ aspectRatio: r }}>
      {!erro && (
        <img
          src={foto.src(1200, Math.round(1200 / r))}
          srcSet={foto.local ? undefined : widths.map((w) => `${foto.src(w, Math.round(w / r))} ${w}w`).join(', ')}
          sizes={foto.local ? undefined : sizes}
          style={position !== 'center' ? { objectPosition: position } : undefined}
          alt={foto.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setErro(true)}
        />
      )}
    </div>
  )
}
