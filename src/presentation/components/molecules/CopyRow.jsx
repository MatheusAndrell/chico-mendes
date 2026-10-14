import { useCopy } from '../../hooks/useCopy'
import { Icon } from '../atoms'
import s from './CopyRow.module.css'

/** Molécula: rótulo + valor com botão de copiar. */
export function CopyRow({ label, value, copyValue }) {
  const [copied, copy] = useCopy()
  return (
    <div className={s.row}>
      <dt>{label}</dt>
      <dd>
        <span>{value}</span>
        {copyValue !== undefined && (
          <button type="button" className={s.copy} onClick={() => copy(copyValue)} aria-label={`Copiar ${label}`}>
            <Icon name={copied ? 'check' : 'copy'} size={16} />
          </button>
        )}
      </dd>
    </div>
  )
}
