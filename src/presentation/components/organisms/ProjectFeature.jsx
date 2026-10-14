import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { Eyebrow, Photo, Tag } from '../atoms'
import s from './ProjectFeature.module.css'

/** Organismo: bloco de projeto com foto grande, texto e mini galeria. */
export function ProjectFeature({ projeto, reverse = false }) {
  // anima uma vez, quando o bloco entra na tela
  const [ref, inView] = useInView('-15% 0px')
  const [visto, setVisto] = useState(false)
  useEffect(() => {
    if (inView) setVisto(true)
  }, [inView])
  return (
    <article ref={ref} id={projeto.id} className={[s.feature, reverse && s.reverse, visto && s.visto].filter(Boolean).join(' ')}>
      <div className={s.media}>
        <Photo foto={projeto.capa} ratio={5 / 4} sizes="(max-width: 900px) 100vw, 50vw" />
        <div className={s.thumbs}>
          {projeto.galeria.map((f) => (
            <Photo key={f.alt} foto={f} ratio={1} rounded="md" sizes="(max-width: 900px) 33vw, 16vw" />
          ))}
        </div>
      </div>
      <div className={s.text}>
        <Eyebrow>{projeto.area} · desde {projeto.desde}</Eyebrow>
        <h2 className={s.title}>{projeto.nome}</h2>
        <p className={s.lead}>{projeto.resumo}</p>
        {projeto.texto.map((p) => (
          <p key={p} className={s.p}>{p}</p>
        ))}
        <ul className={s.tags}>
          {projeto.itens.map((i) => (
            <li key={i}><Tag>{i}</Tag></li>
          ))}
        </ul>
      </div>
    </article>
  )
}
