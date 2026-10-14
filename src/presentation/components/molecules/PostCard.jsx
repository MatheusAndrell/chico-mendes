import { Link } from 'react-router-dom'
import { Photo } from '../atoms'
import s from './PostCard.module.css'

export const formatarData = (iso) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

export function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className={s.card}>
      <Photo foto={post.imagem} ratio={4 / 3} rounded="md" position="top" className={s.photo} />
      <span className={s.date}>{post.edicao}</span>
      <h3 className={s.title}>{post.titulo}</h3>
      {post.resumo && <p className={s.sub}>{post.resumo}</p>}
    </Link>
  )
}
