import { content } from '../../application/content/contentService'
import { Button, Container, Icon, Section } from '../components/atoms'
import { FeatureItem, SectionHeading } from '../components/molecules'
import { DonationPanel } from '../components/organisms'
import { PageTemplate } from '../components/templates'
import s from './Pages.module.css'

const { NECESSIDADES, ORGANIZACAO: ORG, FOTOS } = content

export default function ComoAjudarPage() {
  return (
    <PageTemplate
      eyebrow="Como ajudar"
      title="Seu apoio vira muda, oficina e cuidado"
      lead="A Associação se mantém com parcerias e com a ajuda de quem acredita no Cabuçu. Veja as formas de contribuir."
      foto={FOTOS.excursao}
    >
      <Section>
        <Container>
          <div className={s.help}>
            <DonationPanel />
            <div className={s.helpGrid}>
              <FeatureItem
                icon="gift"
                title="Doação de itens"
                action={<Button href={`tel:${ORG.telefoneLink}`} variant="secondary" size="sm" icon={<Icon name="phone" size={16} />}>Combinar entrega</Button>}
              >
                <ul>
                  {NECESSIDADES.map((n) => (
                    <li key={n.item}>
                      <strong>{n.item}</strong>, {n.detalhe}
                    </li>
                  ))}
                </ul>
              </FeatureItem>
              <FeatureItem icon="heart" title="Campanhas">
                Na Páscoa, no Dia das Crianças e no Natal fazemos campanhas especiais para as crianças. Entre em
                contato para participar.
              </FeatureItem>
              <FeatureItem
                icon="hand"
                title="Voluntariado"
                action={
                  <Button
                    href={`mailto:${ORG.email}?subject=${encodeURIComponent('Quero ser voluntário(a)')}`}
                    size="sm"
                    icon={<Icon name="mail" size={16} />}
                  >
                    Quero ajudar
                  </Button>
                }
              >
                Agende uma conversa com a Direção ou a Coordenação e apresente a sua proposta.
              </FeatureItem>
              <FeatureItem icon="leaf" title="Parcerias">
                Empresas, escolas e instituições podem apoiar projetos específicos, como o viveiro ou as oficinas
                culturais. <a href={`mailto:${ORG.email}?subject=${encodeURIComponent('Proposta de parceria')}`}>Escreva para nós</a>.
              </FeatureItem>
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="soft" tight>
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Transparência"
            title="Cada contribuição é prestada em contas"
            lead="Balanços, termos de parceria e relatórios ficam disponíveis no Portal da Transparência."
          />
          <div className={s.center}>
            <Button to="/transparencia" icon={<Icon name="arrow" size={18} />}>Ver documentos</Button>
          </div>
        </Container>
      </Section>
    </PageTemplate>
  )
}
