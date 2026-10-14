import { Link, useParams } from 'react-router-dom'
import { getPost, listPosts } from '../../application/content/contentService'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Container, Icon, Section, Tag } from '../components/atoms'
import { formatarData, PostCard, SectionHeading } from '../components/molecules'
import NotFoundPage from './NotFoundPage'
import s from './BlogPostPage.module.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = getPost(slug)
  useDocumentTitle(post?.titulo ?? 'Publicação não encontrada', post?.resumo)
  if (!post) return <NotFoundPage />
  const outros = listPosts().filter((p) => p.slug !== post.slug)

  return (
    <>
      <Section tight>
        <Container>
          <Link to="/blog" className={s.back}>
            <Icon name="arrow" size={16} className={s.backIcon} /> Voltar para o blog
          </Link>
          <article className={s.article}>
            <figure className={s.figure}>
              <a href={post.imagem.src()} target="_blank" rel="noopener" aria-label="Abrir o informativo em tamanho original">
                <img src={post.imagem.src()} alt={post.imagem.alt} width={post.imagem.ratio * 1000} height={1000} />
              </a>
              <figcaption>Clique na imagem para ver em tamanho original</figcaption>
            </figure>

            <div className={s.body}>
              <div className={s.meta}>
                <Tag>{post.edicao}</Tag>
                <time dateTime={post.data}>Publicado em {formatarData(post.data)}</time>
              </div>
              <h1 className={s.title}>{post.titulo}</h1>
              <p className={s.sub}>{post.subtitulo}</p>

              {post.secoes.map((sec) => (
                <section key={sec.titulo} className={s.secao}>
                  <h2>{sec.titulo}</h2>
                  <ul>
                    {sec.itens.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        </Container>
      </Section>

      {outros.length > 0 && (
        <Section tone="soft" tight>
          <Container>
            <SectionHeading eyebrow="Continue lendo" title="Outros informativos" />
            <div className={s.more}>
              {outros.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
