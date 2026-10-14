import { content } from '../../application/content/contentService'
import { Container, Photo, Section } from '../components/atoms'
import { QuoteBlock, SectionHeading, TimelineItem } from '../components/molecules'
import { PageTemplate } from '../components/templates'
import s from './Pages.module.css'

const { CABUCU, FOTOS, FRASES } = content

export default function CabucuPage() {
  return (
    <PageTemplate
      eyebrow="O Cabuçu"
      title="Descobrir o passado é planejar o futuro"
      lead={CABUCU.intro[0]}
      foto={FOTOS.represaAerea}
    >
      <Section>
        <Container>
          <div className={s.split}>
            <SectionHeading eyebrow="Natureza" title="Uma das maiores florestas urbanas do mundo" />
            <div className={s.prose}>
              <p>{CABUCU.intro[1]}</p>
              <p>{CABUCU.nome}</p>
            </div>
          </div>
          <div className={s.duo}>
            <Photo foto={FOTOS.arvore} ratio={4 / 3} sizes="(max-width: 800px) 100vw, 50vw" />
            <Photo foto={FOTOS.vespa} ratio={4 / 3} sizes="(max-width: 800px) 100vw, 50vw" />
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading eyebrow="História" title="Marcos do bairro" lead="Da capela de taipa de pilão à luta pela água: a memória que o Ponto de Cultura ajuda a preservar." />
          <ol>
            {CABUCU.marcos.map((m) => (
              <TimelineItem key={m.ano} {...m} />
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <QuoteBlock texto={FRASES.romildo.texto} autor={FRASES.romildo.autor} />
        </Container>
      </Section>
    </PageTemplate>
  )
}
