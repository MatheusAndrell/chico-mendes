import { Eyebrow } from '../atoms'
import s from './SectionHeading.module.css'

/** Molécula: rótulo + título + texto de apoio de uma seção. */
export function SectionHeading({ eyebrow, title, lead, align = 'left', as: H = 'h2', tone, action, className = '' }) {
  return (
    <header className={[s.head, s[align], tone === 'light' && s.light, className].filter(Boolean).join(' ')}>
      <div>
        {eyebrow && <Eyebrow tone={tone === 'light' ? 'light' : 'leaf'}>{eyebrow}</Eyebrow>}
        <H className={s.title}>{title}</H>
        {lead && <p className={s.lead}>{lead}</p>}
      </div>
      {action && <div className={s.action}>{action}</div>}
    </header>
  )
}
