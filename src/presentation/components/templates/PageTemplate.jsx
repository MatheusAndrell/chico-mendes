import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { Container, Eyebrow } from '../atoms'
import { HeroPhoto } from '../organisms'
import s from './PageTemplate.module.css'

/**
 * Template: página interna com cabeçalho (título, texto e foto animada opcional).
 * `destaque` = { frase, palavras } para a frase com palavra que troca sobre a foto.
 */
export function PageTemplate({ eyebrow, title, lead, foto, destaque, seoTitle, children }) {
  useDocumentTitle(seoTitle ?? title, lead)
  return (
    <>
      <header className={s.hero}>
        <Container>
          <div className={s.text}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className={s.title}>{title}</h1>
            {lead && <p className={s.lead}>{lead}</p>}
          </div>
          {foto && <HeroPhoto foto={foto} {...destaque} />}
        </Container>
      </header>
      {children}
    </>
  )
}
