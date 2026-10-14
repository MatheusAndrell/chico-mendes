import s from './Eyebrow.module.css'

export function Eyebrow({ children, tone = 'leaf', className = '' }) {
  return <p className={[s.eyebrow, s[tone], className].join(' ')}>{children}</p>
}
