import { Link } from 'react-router-dom'
import s from './Logo.module.css'

/** Átomo: logotipo oficial da Associação. */
export function Logo({ size = 56, withName = true, to = '/', className = '' }) {
  const img = (
    <img
      src={size > 120 ? '/brand/logo.webp' : '/brand/logo-160.webp'}
      alt={withName ? '' : 'Associação Cultural e Ambiental Chico Mendes'}
      width={size}
      height={size}
      className={s.img}
    />
  )
  const inner = (
    <>
      {img}
      {withName && (
        <span className={s.name}>
          Chico Mendes
          <small>Associação Cultural e Ambiental</small>
        </span>
      )}
    </>
  )
  if (!to) return <span className={[s.logo, className].join(' ')}>{inner}</span>
  return (
    <Link to={to} className={[s.logo, className].join(' ')} aria-label="Chico Mendes, página inicial">
      {inner}
    </Link>
  )
}
