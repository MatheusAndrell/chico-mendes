import { Link } from 'react-router-dom'
import { content } from '../../../application/content/contentService'
import { MENU } from '../../../app/routes'
import { Container, Icon, Logo } from '../atoms'
import s from './SiteFooter.module.css'

const { ORGANIZACAO: ORG, FRASES } = content

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <Container>
        <div className={s.top}>
          <div className={s.brand}>
            <Logo size={120} withName={false} />
            <p className={s.motto}>{FRASES.preserve}</p>
          </div>
          <nav aria-label="Rodapé" className={s.col}>
            <h2 className={s.h}>Navegue</h2>
            <ul>
              {MENU.map((m) => (
                <li key={m.to}>
                  <Link to={m.to}>{m.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.col}>
            <h2 className={s.h}>Fale com a gente</h2>
            <ul>
              <li><a href={`tel:${ORG.telefoneLink}`}><Icon name="phone" size={16} /> {ORG.telefone}</a></li>
              <li><a href={`mailto:${ORG.email}`}><Icon name="mail" size={16} /> {ORG.email}</a></li>
              <li><a href={ORG.instagram} target="_blank" rel="noopener"><Icon name="instagram" size={16} /> Instagram</a></li>
              <li><a href={ORG.facebook} target="_blank" rel="noopener"><Icon name="facebook" size={16} /> Facebook</a></li>
            </ul>
          </div>
          <div className={s.col}>
            <h2 className={s.h}>Endereços</h2>
            <ul className={s.addr}>
              {ORG.enderecos.map((e) => (
                <li key={e.titulo}>
                  <strong>{e.titulo}</strong>
                  {e.linha1}
                  <br />
                  {e.linha2}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={s.bottom}>
          <p>{ORG.nome} · CNPJ {ORG.cnpj}</p>
        </div>
      </Container>
    </footer>
  )
}
