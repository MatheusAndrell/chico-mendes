import s from './Tag.module.css'

export function Tag({ children, tone = 'mint' }) {
  return <span className={[s.tag, s[tone]].join(' ')}>{children}</span>
}
