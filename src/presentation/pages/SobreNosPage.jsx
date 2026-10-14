import { content } from '../../application/content/contentService'
import { Button, Container, Icon, Photo, Section } from '../components/atoms'
import { QuoteBlock, SectionHeading, TimelineItem } from '../components/molecules'
import { Gallery } from '../components/organisms'
import { PageTemplate } from '../components/templates'
import s from './Pages.module.css'

const { HISTORIA, PREMIOS, FOTOS, FRASES } = content

export default function SobreNosPage() {
  return (
    <PageTemplate
      eyebrow="Sobre nós"
      title="Uma associação feita por quem mora no Cabuçu"
      lead="Somos uma organização da sociedade civil que atua há mais de 20 anos no bairro com preservação ambiental, conscientização, resgate histórico e cuidado com a primeira infância."
      foto={FOTOS.encontro}
    >
      <Section>
        <Container>
          <div className={s.split}>
            <SectionHeading eyebrow="Nossa história" title="Começou com uma reivindicação" />
            <div className={s.prose}>
              <p>
                A Associação Cultural e Ambiental Chico Mendes foi fundada em 26 de fevereiro de 2005, no Cabuçu, em
                Guarulhos. Um grupo de moradores, em sua maioria mulheres, liderado por Ivone Christófero Felix Pires,
                decidiu se organizar depois de reivindicar soluções para problemas ambientais que não eram atendidas
                pelas autoridades.
              </p>
              <p>
                Desde então, a Associação usa a educação ambiental como ferramenta de preservação, trabalha para
                recuperar a história e o patrimônio do bairro e cuida da educação na primeira infância.
              </p>
              <p>
                O nome homenageia Chico Mendes (1944–1988), seringueiro e ambientalista do Acre que dedicou a vida à
                defesa da floresta e dos povos que vivem dela.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading eyebrow="Linha do tempo" title="Marcos da Associação" />
          <ol>
            {HISTORIA.map((h) => (
              <TimelineItem key={h.ano} ano={h.ano} texto={h.texto} />
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Reconhecimento" title="Prêmios e selos" />
          <div className={s.awards}>
            {PREMIOS.map((p) => (
              <article key={p.nome} className={s.award}>
                <span className={s.awardYear}>{p.ano}</span>
                <h3>{p.nome}</h3>
                <p>{p.por}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className={s.quoteBox}>
            <QuoteBlock texto={FRASES.preserve} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Galeria" title="Nosso dia a dia" action={<Button to="/projetos" variant="secondary" size="sm" icon={<Icon name="arrow" size={16} />}>Ver projetos</Button>} />
          <Gallery fotos={[FOTOS.equipe, FOTOS.passeata, FOTOS.grupoMata, FOTOS.salaAula, FOTOS.excursao, FOTOS.festa, FOTOS.homenagem, FOTOS.trilha]} />
        </Container>
      </Section>
    </PageTemplate>
  )
}
