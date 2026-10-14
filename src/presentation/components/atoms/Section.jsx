import s from './Section.module.css'

/** Átomo de layout: espaçamento vertical padrão e fundo opcional. */
export function Section({ tone = 'default', tight = false, id, className = '', children, ...rest }) {
  return (
    <section id={id} className={[s.section, s[tone], tight && s.tight, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </section>
  )
}
