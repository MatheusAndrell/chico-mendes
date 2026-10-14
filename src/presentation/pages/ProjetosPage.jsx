import { content } from '../../application/content/contentService'
import { Button, Container, Section } from '../components/atoms'
import { CtaBand, ProjectFeature } from '../components/organisms'
import { PageTemplate } from '../components/templates'
import s from './Pages.module.css'

const { PROJETOS, FOTOS } = content

export default function ProjetosPage() {
  return (
    <PageTemplate
      eyebrow="Projetos"
      title="Três frentes, um mesmo cuidado"
      lead="Ambiental, cultural e educacional: os projetos da Associação se completam para cuidar da natureza, da memória e da infância no Cabuçu."
      foto={FOTOS.serra}
      destaque={{ frase: 'Cuidar da', palavras: ['natureza.', 'memória.', 'infância.'] }}
    >
      <Section>
        <Container>
          <nav className={s.anchors} aria-label="Projetos">
            {PROJETOS.map((p) => (
              <a key={p.id} href={`#${p.id}`}>{p.nome}</a>
            ))}
          </nav>
          <div className={s.stack}>
            {PROJETOS.map((p, i) => (
              <ProjectFeature key={p.id} projeto={p} reverse={i % 2 === 1} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand
        foto={FOTOS.mudas}
        title="Ajude o viveiro a plantar mais"
        actions={<Button to="/comoajudar" variant="leaf" size="lg">Como ajudar</Button>}
      >
        Cada doação vira muda nativa, oficina para os jovens e cuidado com as crianças da creche.
      </CtaBand>
    </PageTemplate>
  )
}
