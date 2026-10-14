import { Container } from '../atoms'
import s from './CtaBand.module.css'

/** Organismo: faixa de chamada para ação com foto de fundo. */
export function CtaBand({ foto, title, children, actions }) {
  return (
    <section className={s.band}>
      <Container>
        <div className={s.box}>
          {foto && <img className={s.bg} src={foto.src(1600, 700)} alt="" loading="lazy" />}
          <div className={s.content}>
            <h2 className={s.title}>{title}</h2>
            {children && <p className={s.text}>{children}</p>}
            {actions && <div className={s.actions}>{actions}</div>}
          </div>
        </div>
      </Container>
    </section>
  )
}
