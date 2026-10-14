import { transparencyRepository } from '../../app/container'
import { Container, Section } from '../components/atoms'
import { DocumentBrowser } from '../components/organisms'
import { PageTemplate } from '../components/templates'

const documentos = transparencyRepository.list()

export default function TransparenciaPage() {
  return (
    <PageTemplate
      eyebrow="Transparência"
      title="Portal da Transparência"
      lead={`Contratos, termos de parceria, relatórios de atividades e demonstrações contábeis da Associação: ${documentos.length} documentos em PDF para consulta.`}
    >
      <Section tight>
        <Container>
          <DocumentBrowser documentos={documentos} />
        </Container>
      </Section>
    </PageTemplate>
  )
}
