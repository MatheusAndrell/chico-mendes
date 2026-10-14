import { content, listPosts } from '../../application/content/contentService'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Button, Container, Eyebrow, Icon, Photo, Section } from '../components/atoms'
import { PostCard, ProjectCard, QuoteBlock, SectionHeading } from '../components/molecules'
import { CtaBand, FlorestaViva, GrowthStage, StatsBand } from '../components/organisms'
import s from './HomePage.module.css'

const { PROJETOS, FRASES, FOTOS, CABUCU } = content

export default function HomePage() {
  useDocumentTitle(null, 'Associação Cultural e Ambiental Chico Mendes: viveiro de mudas nativas, Ponto de Cultura e creche no Cabuçu, Guarulhos/SP.')
  const posts = listPosts().slice(0, 3)

  return (
    <>
      <section className={s.hero}>
        <Container>
          <div className={s.heroGrid}>
            <div className={s.heroText}>
              <Eyebrow>Cabuçu · Guarulhos/SP · desde 2005</Eyebrow>
              <h1 className={s.h1}>
                Preservar a natureza é <span>preservar vidas.</span>
              </h1>
              <p className={s.lead}>
                Há mais de 20 anos a Associação Cultural e Ambiental Chico Mendes cuida do Cabuçu: da Mata Atlântica,
                da memória do bairro e das crianças que vão herdar tudo isso.
              </p>
              <div className={s.actions}>
                <Button to="/projetos" size="lg" icon={<Icon name="arrow" />}>Conheça os projetos</Button>
                <Button to="/comoajudar" size="lg" variant="secondary">Como ajudar</Button>
              </div>
              <ul className={s.badges}>
                <li>Prêmio Cultura Viva · MinC</li>
                <li>Selo Ambiental · Guarulhos</li>
              </ul>
            </div>
            <GrowthStage fallback={FOTOS.serra} />
          </div>
        </Container>
      </section>

      <StatsBand />

      <Section>
        <Container>
          <div className={s.about}>
            <div className={s.aboutPhotos}>
              <Photo foto={FOTOS.placa} ratio={4 / 5} sizes="(max-width: 900px) 60vw, 30vw" />
              <Photo foto={FOTOS.educadoras} ratio={1} rounded="md" sizes="(max-width: 900px) 40vw, 20vw" className={s.aboutSmall} />
            </div>
            <div>
              <SectionHeading
                eyebrow="Quem somos"
                title="Nascemos da vontade de um bairro de cuidar de si mesmo."
                lead="Em 2005, moradoras do Cabuçu, lideradas por Ivone Christófero Felix Pires, fundaram a Associação depois de cobrar, sem resposta, soluções para os problemas ambientais do bairro."
              />
              <p className={s.p}>
                O nome homenageia Chico Mendes (1944–1988), seringueiro e ambientalista do Acre que dedicou a vida à
                defesa da floresta. Aqui, esse legado virou educação ambiental, preservação da história local e cuidado
                com a primeira infância.
              </p>
              <Button to="/sobrenos" variant="ghost" icon={<Icon name="arrow" size={18} />}>Nossa história</Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading
            eyebrow="Projetos"
            title="Natureza, cultura e infância no mesmo chão"
            action={<Button to="/projetos" variant="secondary" size="sm">Ver todos</Button>}
          />
          <div className={s.cards}>
            {PROJETOS.map((p) => (
              <ProjectCard key={p.id} projeto={p} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <FlorestaViva />
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className={s.quote}>
            <img src={FOTOS.represa.src(1600, 800)} alt="" loading="lazy" />
            <QuoteBlock texto={FRASES.romildo.texto} autor={FRASES.romildo.autor} tone="light" />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className={s.cabucu}>
            <div>
              <SectionHeading eyebrow="O Cabuçu" title="Um bairro de 170 anos dentro da Cantareira" lead={CABUCU.intro[1]} />
              <p className={s.p}>{CABUCU.nome}</p>
              <Button to="/cabucu" variant="ghost" icon={<Icon name="arrow" size={18} />}>Conheça a história do bairro</Button>
            </div>
            <Photo foto={FOTOS.represaAerea} ratio={1} sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
        </Container>
      </Section>

      <Section tone="soft">
        <Container>
          <SectionHeading eyebrow="Nosso blog" title="Últimas publicações" action={<Button to="/blog" variant="secondary" size="sm">Ver o blog</Button>} />
          <div className={s.cards}>
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <CtaBand
          foto={FOTOS.trilha}
          title="Faça parte dessa história"
          actions={
            <>
              <Button to="/comoajudar" variant="leaf" size="lg">Quero ajudar</Button>
              <Button to="/contato" variant="light" size="lg">Fale com a gente</Button>
            </>
          }
        >
          Doações, voluntariado e parcerias mantêm o viveiro, as oficinas e a creche funcionando.
        </CtaBand>
      </Section>
    </>
  )
}
