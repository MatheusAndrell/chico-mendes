import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../../hooks/webgl'
import s from './HeroPhoto.module.css'

/**
 * Organismo: foto de destaque com animação.
 * A foto se revela de baixo para cima e segue com um zoom lento (efeito Ken Burns).
 * Com `frase` + `palavras`, a palavra destacada troca sozinha (ex.: "Cuidar da natureza").
 */
export function HeroPhoto({ foto, frase, palavras = [], intervalo = 2600 }) {
  const [i, setI] = useState(0)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    if (palavras.length < 2 || prefersReducedMotion()) return
    const id = setInterval(() => setI((n) => (n + 1) % palavras.length), intervalo)
    return () => clearInterval(id)
  }, [palavras.length, intervalo])

  if (!foto) return null
  const r = 21 / 9

  return (
    <div className={s.frame}>
      {!erro && <img
        className={s.img}
        src={foto.src(1600, Math.round(1600 / r))}
        srcSet={foto.local ? undefined : [800, 1200, 1600, 2000].map((w) => `${foto.src(w, Math.round(w / r))} ${w}w`).join(', ')}
        sizes="(max-width: 1240px) 100vw, 1200px"
        alt={foto.alt}
        fetchpriority="high"
        onError={() => setErro(true)}
      />}
      {frase && (
        <p className={s.caption}>
          <span className={s.lead}>{frase}</span>{' '}
          <span className={s.words} aria-live="polite">
            {palavras.map((p, k) => (
              <span key={p} className={k === i ? s.on : k === (i - 1 + palavras.length) % palavras.length ? s.out : undefined} aria-hidden={k !== i}>
                {p}
              </span>
            ))}
          </span>
        </p>
      )}
    </div>
  )
}
