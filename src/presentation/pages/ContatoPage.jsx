import { Container, Section } from '../components/atoms'
import { ContactPanel } from '../components/organisms'
import { PageTemplate } from '../components/templates'

export default function ContatoPage() {
  return (
    <PageTemplate eyebrow="Contato" title="Venha conhecer o Cabuçu" lead="Visite o viveiro, participe de uma oficina, traga a sua escola ou simplesmente mande uma mensagem.">
      <Section tight>
        <Container>
          <ContactPanel />
        </Container>
      </Section>
    </PageTemplate>
  )
}
