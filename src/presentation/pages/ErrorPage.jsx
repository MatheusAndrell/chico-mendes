import { useRouteError } from 'react-router-dom'
import { isChunkError } from '../../app/lazyPage'
import { Button, Container, Icon, Logo, Section } from '../components/atoms'
import s from './Pages.module.css'

/**
 * Página de erro das rotas. `inline` = renderizada dentro do layout.
 * Em erro de carregamento de arquivo (versão nova do site), oferece recarregar.
 */
export default function ErrorPage({ inline = false }) {
  const error = useRouteError()
  const chunk = isChunkError(error)
  if (import.meta.env.DEV) console.error(error)

  const conteudo = (
    <div className={s.center}>
      {!inline && <Logo size={96} withName={false} to={null} />}
      <p className={s.big} aria-hidden="true">{chunk ? '↻' : 'Ops'}</p>
      <h1 className={s.postTitle}>{chunk ? 'Temos uma versão nova do site' : 'Algo saiu do caminho'}</h1>
      <p className={s.postSub}>
        {chunk
          ? 'Recarregue a página para carregar a versão mais recente.'
          : 'Não foi possível mostrar esta página agora. Tente novamente em instantes.'}
      </p>
      <div className={s.errorActions}>
        <Button onClick={() => window.location.reload()} icon={<Icon name="replay" size={18} />}>
          Recarregar
        </Button>
        <Button href="/" variant="secondary">Ir para o início</Button>
      </div>
    </div>
  )

  if (inline) return <Section><Container size="narrow">{conteudo}</Container></Section>
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Container size="narrow">{conteudo}</Container>
    </main>
  )
}
