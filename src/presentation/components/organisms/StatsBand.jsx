import { content } from '../../../application/content/contentService'
import { Container } from '../atoms'
import { StatItem } from '../molecules'
import s from './StatsBand.module.css'

export function StatsBand() {
  return (
    <section aria-label="Em números" className={s.band}>
      <Container>
        <div className={s.grid}>
          {content.NUMEROS.map((n) => (
            <StatItem key={n.rotulo} {...n} />
          ))}
        </div>
      </Container>
    </section>
  )
}
