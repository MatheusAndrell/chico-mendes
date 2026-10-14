import { Icon } from '../atoms'
import { formatarTamanho, nomeCategoria } from '../../../domain/transparency/Document'
import s from './DocumentRow.module.css'

/** Molécula: linha de documento da transparência. */
export function DocumentRow({ doc }) {
  return (
    <li className={s.row}>
      <span className={s.icon} aria-hidden="true">
        <Icon name="file" size={22} />
      </span>
      <div className={s.info}>
        <a href={doc.url} target="_blank" rel="noopener" className={s.title}>
          {doc.titulo}
        </a>
        <span className={s.meta}>
          {nomeCategoria(doc.categoria)} · PDF · {formatarTamanho(doc.tamanho)}
        </span>
      </div>
      <div className={s.actions}>
        <a href={doc.url} target="_blank" rel="noopener" className={s.btn}>
          Abrir
        </a>
        <a href={doc.url} download={doc.arquivo} className={s.btnIcon} aria-label={`Baixar ${doc.titulo}`}>
          <Icon name="download" size={18} />
        </a>
      </div>
    </li>
  )
}
