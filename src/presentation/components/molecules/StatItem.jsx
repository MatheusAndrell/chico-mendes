import s from './StatItem.module.css'

export function StatItem({ valor, rotulo }) {
  return (
    <div className={s.stat}>
      <strong>{valor}</strong>
      <span>{rotulo}</span>
    </div>
  )
}
