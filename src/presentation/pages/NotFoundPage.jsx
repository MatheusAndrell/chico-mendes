import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Button, Container, Section } from '../components/atoms'
import s from './Pages.module.css'

export default function NotFoundPage() {
  useDocumentTitle('Página não encontrada')
  return (
    <Section>
      <Container size="narrow">
        <div className={s.center}>
          <p className={s.big}>404</p>
          <h1 className={s.postTitle}>Essa trilha não existe</h1>
          <p className={s.postSub}>A página que você procura mudou de lugar ou não existe mais.</p>
          <Button to="/">Voltar ao início</Button>
        </div>
      </Container>
    </Section>
  )
}
