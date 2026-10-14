import { lazy, Suspense, useState } from 'react'
import { content } from '../../../application/content/contentService'
import { useInView } from '../../hooks/useInView'
import { useMyTree } from '../../hooks/useMyTree'
import { hasWebGL } from '../../hooks/webgl'
import { COMMUNITY } from '../../three/forestSpots'
import { Button, Icon } from '../atoms'
import { SectionHeading } from '../molecules'
import s from './FlorestaViva.module.css'

const ForestScene = lazy(() => import('../../three/ForestScene'))
const { ESPECIES } = content

/**
 * Organismo: Floresta Viva. Cada visitante planta UMA árvore,
 * guardada no próprio navegador.
 */
export function FlorestaViva() {
  const { tree, fresh, error, plant } = useMyTree()
  const [nome, setNome] = useState('')
  const [especie, setEspecie] = useState('ipe')
  const [ref, inView] = useInView('300px')
  const [webgl] = useState(hasWebGL)
  const [montado, setMontado] = useState(false)
  if (inView && !montado) setMontado(true)

  const sp = ESPECIES.find((e) => e.id === (tree?.especie ?? especie))

  const onSubmit = (e) => {
    e.preventDefault()
    plant({ nome, especie })
  }

  const compartilhar = async () => {
    const text = `Plantei ${artigo(sp?.nome)} na Floresta Viva da Associação Chico Mendes, no Cabuçu. Plante a sua também!`
    const url = location.origin + '/#floresta-viva'
    try {
      if (navigator.share) await navigator.share({ title: 'Floresta Viva · Chico Mendes', text, url })
      else await navigator.clipboard.writeText(`${text} ${url}`)
    } catch {
      /* cancelado */
    }
  }

  return (
    <section id="floresta-viva" className={s.section} ref={ref}>
      <div className={s.grid}>
        <div className={s.stage}>
          {webgl && montado ? (
            <Suspense fallback={<div className={s.msg}>Preparando o terreno…</div>}>
              <ForestScene tree={tree} fresh={fresh} active={inView} />
            </Suspense>
          ) : (
            <div className={s.msg}>{webgl ? 'Preparando o terreno…' : 'Seu navegador não exibe 3D, mas você ainda pode plantar.'}</div>
          )}
          <span className={s.count}>
            <Icon name="leaf" size={16} /> {COMMUNITY.length + (tree ? 1 : 0)} árvores na floresta
          </span>
        </div>

        <div className={s.panel}>
          <SectionHeading
            eyebrow="Floresta Viva"
            title={tree ? 'Sua árvore já está na floresta.' : 'Plante a sua árvore nativa.'}
            lead={
              tree
                ? 'Ela fica guardada neste aparelho. Que tal transformar esse gesto em uma muda de verdade no nosso viveiro?'
                : 'Escolha uma espécie da Mata Atlântica, coloque seu nome e veja ela crescer junto com as outras. Cada pessoa planta uma árvore.'
            }
            className={s.head}
          />

          {tree ? (
            <div className={s.done}>
              <span className={s.dot} style={{ background: sp?.cor }} />
              <div>
                <strong>{tree.nome || 'Você'}</strong> plantou {artigo(sp?.nome)}
                <small>
                  <em>{sp?.cientifico}</em> · {new Date(tree.data).toLocaleDateString('pt-BR')}
                </small>
              </div>
              <div className={s.actions}>
                <Button onClick={compartilhar} variant="secondary" size="sm" icon={<Icon name="share" size={16} />}>
                  Compartilhar
                </Button>
                <Button to="/comoajudar" size="sm">Doar para o viveiro</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className={s.form}>
              <label className={s.field}>
                <span>Seu nome</span>
                <input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={40} placeholder="Opcional" autoComplete="given-name" />
              </label>
              <fieldset className={s.field}>
                <legend>Espécie</legend>
                <div className={s.species}>
                  {ESPECIES.map((e) => (
                    <label key={e.id} className={especie === e.id ? s.on : undefined}>
                      <input type="radio" name="especie" value={e.id} checked={especie === e.id} onChange={() => setEspecie(e.id)} />
                      <i style={{ background: e.cor }} />
                      {e.nome}
                    </label>
                  ))}
                </div>
                <small className={s.sci}>{sp?.cientifico}</small>
              </fieldset>
              {error && <p className={s.error}>{error}</p>}
              <Button type="submit" size="lg" block icon={<Icon name="leaf" size={18} />}>
                Plantar minha árvore
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function artigo(nome) {
  if (!nome) return 'uma árvore'
  return (['Quaresmeira', 'Araucária'].includes(nome) ? 'uma ' : 'um ') + nome
}
