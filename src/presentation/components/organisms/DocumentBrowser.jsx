import { useMemo, useState } from 'react'
import { availableYears, filterDocuments, groupByYear } from '../../../application/transparency/listDocuments'
import { CATEGORIAS } from '../../../domain/transparency/Document'
import { Icon } from '../atoms'
import { DocumentRow } from '../molecules'
import s from './DocumentBrowser.module.css'

/** Organismo: busca, filtros e lista dos documentos da transparência. */
export function DocumentBrowser({ documentos }) {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [ano, setAno] = useState('todos')

  const anos = useMemo(() => availableYears(documentos), [documentos])
  const filtrados = useMemo(() => filterDocuments(documentos, { busca, categoria, ano }), [documentos, busca, categoria, ano])
  const grupos = useMemo(() => groupByYear(filtrados), [filtrados])

  return (
    <div className={s.browser}>
      <div className={s.filters}>
        <label className={s.search}>
          <Icon name="search" size={18} />
          <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar documento (ex.: balanço, relatório)" aria-label="Buscar documento" />
        </label>
        <label className={s.year}>
          <span className="visually-hidden">Ano</span>
          <select value={ano} onChange={(e) => setAno(e.target.value)}>
            <option value="todos">Todos os anos</option>
            {anos.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
            <option value="sem-ano">Sem ano (institucional)</option>
          </select>
        </label>
        <div className={s.chips} role="group" aria-label="Filtrar por tipo">
          {[{ id: 'todas', nome: 'Todos' }, ...CATEGORIAS].map((c) => (
            <button key={c.id} type="button" aria-pressed={categoria === c.id} className={categoria === c.id ? s.on : undefined} onClick={() => setCategoria(c.id)}>
              {c.nome}
            </button>
          ))}
        </div>
      </div>

      <p className={s.count} aria-live="polite">
        {filtrados.length} {filtrados.length === 1 ? 'documento' : 'documentos'}
      </p>

      {grupos.length === 0 && <p className={s.empty}>Nenhum documento encontrado com esses filtros.</p>}

      {grupos.map((g) => (
        <section key={g.ano} className={s.group} aria-labelledby={`ano-${g.ano}`}>
          <h2 id={`ano-${g.ano}`} className={s.groupTitle}>
            {g.ano === 'sem-ano' ? 'Documentos institucionais' : g.ano}
            <span>{g.itens.length}</span>
          </h2>
          <ul className={s.list}>
            {g.itens.map((d) => (
              <DocumentRow key={d.arquivo} doc={d} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
