import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { hasWebGL, prefersReducedMotion } from '../../hooks/webgl'
import { Icon, Photo } from '../atoms'
import s from './GrowthStage.module.css'

const HeroScene = lazy(() => import('../../three/HeroScene'))

const ETAPAS = [
  { de: 0, nome: 'Semente' },
  { de: 0.14, nome: 'Muda' },
  { de: 0.36, nome: 'Árvore' },
  { de: 0.66, nome: 'Floresta' }
]
const DURACAO = 26 // segundos da semente à floresta

/**
 * Organismo: a cena 3D "da semente à floresta", tocando sozinha
 * enquanto está na tela. Sem WebGL, mostra uma foto da Cantareira.
 */
export function GrowthStage({ fallback }) {
  const progress = useRef(0)
  const [step, setStep] = useState(0)
  const [webgl] = useState(hasWebGL)
  const [ref, inView] = useInView('0px')
  const playing = useRef(true)

  useEffect(() => {
    if (prefersReducedMotion()) {
      progress.current = 1
      setStep(ETAPAS.length - 1)
      return
    }
    if (!inView) return
    let raf
    let last = performance.now()
    const tick = (t) => {
      const dt = Math.min(0.1, (t - last) / 1000)
      last = t
      if (playing.current && progress.current < 1) {
        progress.current = Math.min(1, progress.current + dt / DURACAO)
        let k = 0
        ETAPAS.forEach((e, i) => progress.current >= e.de && (k = i))
        setStep((old) => (old === k ? old : k))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  const irPara = (i) => {
    progress.current = ETAPAS[i].de + 0.001
    setStep(i)
  }

  if (!webgl) return <Photo foto={fallback} ratio={4 / 5} priority />

  return (
    <div ref={ref} className={s.stage}>
      <div className={s.canvas} aria-hidden="true">
        <Suspense fallback={<div className={s.loading} />}>
          <HeroScene progress={progress} active={inView} />
        </Suspense>
      </div>
      <div className={s.bar}>
        <ol className={s.steps} aria-label="Etapas do crescimento">
          {ETAPAS.map((e, i) => (
            <li key={e.nome}>
              <button type="button" className={i === step ? s.on : i < step ? s.done : undefined} onClick={() => irPara(i)}>
                {e.nome}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className={s.replay} onClick={() => irPara(0)} aria-label="Ver de novo desde a semente">
          <Icon name="replay" size={18} />
        </button>
      </div>
    </div>
  )
}
