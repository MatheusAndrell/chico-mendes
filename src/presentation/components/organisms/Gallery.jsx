import { Photo } from '../atoms'
import s from './Gallery.module.css'

/** Organismo: mosaico de fotos. */
export function Gallery({ fotos }) {
  return (
    <div className={s.grid}>
      {fotos.map((f, i) => (
        <Photo key={f.alt} foto={f} ratio={i % 5 === 0 ? 4 / 5 : 4 / 3} rounded="md" sizes="(max-width: 700px) 50vw, 25vw" className={s[`i${i % 5}`]} />
      ))}
    </div>
  )
}
