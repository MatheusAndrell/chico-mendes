import { Link } from 'react-router-dom'
import { Icon, Photo, Tag } from '../atoms'
import s from './ProjectCard.module.css'

/** Molécula: cartão de projeto com foto. */
export function ProjectCard({ projeto, to = `/projetos#${projeto.id}` }) {
  return (
    <Link to={to} className={s.card}>
      <Photo foto={projeto.capa} ratio={4 / 3} sizes="(max-width: 800px) 100vw, 33vw" rounded="md" />
      <div className={s.body}>
        <Tag>{projeto.area}</Tag>
        <h3 className={s.title}>{projeto.nome}</h3>
        <p className={s.text}>{projeto.resumo}</p>
        <span className={s.more}>
          Conhecer o projeto <Icon name="arrow" size={18} />
        </span>
      </div>
    </Link>
  )
}
