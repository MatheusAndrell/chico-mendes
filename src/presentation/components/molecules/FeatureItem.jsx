import { Icon } from '../atoms'
import s from './FeatureItem.module.css'

/** Molécula: ícone + título + texto (+ ação opcional). */
export function FeatureItem({ icon, title, children, action }) {
  return (
    <div className={s.item}>
      <span className={s.icon}>
        <Icon name={icon} size={24} />
      </span>
      <h3 className={s.title}>{title}</h3>
      <div className={s.text}>{children}</div>
      {action && <div className={s.action}>{action}</div>}
    </div>
  )
}
