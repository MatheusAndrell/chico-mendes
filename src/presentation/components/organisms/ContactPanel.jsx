import { content } from '../../../application/content/contentService'
import { Icon } from '../atoms'
import s from './ContactPanel.module.css'

const { ORGANIZACAO: ORG } = content

/** Organismo: canais de contato + endereços com mapa. */
export function ContactPanel() {
  return (
    <div className={s.wrap}>
      <ul className={s.channels}>
        <li>
          <a href={`tel:${ORG.telefoneLink}`}>
            <span className={s.icon}><Icon name="phone" /></span>
            <span><small>Telefone</small>{ORG.telefone}</span>
          </a>
        </li>
        <li>
          <a href={`mailto:${ORG.email}`}>
            <span className={s.icon}><Icon name="mail" /></span>
            <span><small>E-mail</small>{ORG.email}</span>
          </a>
        </li>
        <li>
          <a href={ORG.instagram} target="_blank" rel="noopener">
            <span className={s.icon}><Icon name="instagram" /></span>
            <span><small>Instagram</small>@cabucuchicomendes</span>
          </a>
        </li>
        <li>
          <a href={ORG.facebook} target="_blank" rel="noopener">
            <span className={s.icon}><Icon name="facebook" /></span>
            <span><small>Facebook</small>/chicomendes.cabucu</span>
          </a>
        </li>
      </ul>
      <div className={s.places}>
        {ORG.enderecos.map((e) => {
          const q = encodeURIComponent(`${e.linha1}, ${e.linha2}`)
          return (
            <article key={e.titulo} className={s.place}>
              <iframe
                title={`Mapa: ${e.titulo}`}
                src={`https://www.google.com/maps?q=${q}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className={s.placeBody}>
                <h3>{e.titulo}</h3>
                <p>{e.linha1}<br />{e.linha2}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener">
                  <Icon name="pin" size={16} /> Como chegar
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
