import { listPosts } from '../../application/content/contentService'
import { Container, Section } from '../components/atoms'
import { PostCard } from '../components/molecules'
import { PageTemplate } from '../components/templates'
import s from './Pages.module.css'

export default function BlogPage() {
  const posts = listPosts()
  return (
    <PageTemplate eyebrow="Nosso blog" title="Notícias e informativos" lead="Acompanhe as ações da Associação, os informativos e as novidades do Cabuçu.">
      <Section tight>
        <Container>
          <div className={s.posts}>
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      </Section>
    </PageTemplate>
  )
}
