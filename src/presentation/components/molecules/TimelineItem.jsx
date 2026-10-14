import { Photo } from '../atoms'
import s from './TimelineItem.module.css'

export function TimelineItem({ ano, titulo, texto, foto }) {
  return (
    <li className={s.item}>
      <span className={s.year}>{ano}</span>
      <div className={s.body}>
        {titulo && <h3 className={s.title}>{titulo}</h3>}
        <p>{texto}</p>
      </div>
      {foto && <Photo foto={foto} ratio={4 / 3} rounded="md" sizes="(max-width: 800px) 40vw, 220px" className={s.photo} />}
    </li>
  )
}
