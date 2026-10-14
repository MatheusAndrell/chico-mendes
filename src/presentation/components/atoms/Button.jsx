import { Link } from 'react-router-dom'
import s from './Button.module.css'

/**
 * Átomo: botão / link com aparência de botão.
 * `to` → rota interna · `href` → link externo · nenhum → <button>
 */
export function Button({ to, href, variant = 'primary', size = 'md', block = false, icon, children, className = '', ...rest }) {
  const cls = [s.btn, s[variant], s[size], block && s.block, className].filter(Boolean).join(' ')
  const content = (
    <>
      <span>{children}</span>
      {icon}
    </>
  )
  if (to) return <Link to={to} className={cls} {...rest}>{content}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{content}</a>
  return <button type="button" className={cls} {...rest}>{content}</button>
}
