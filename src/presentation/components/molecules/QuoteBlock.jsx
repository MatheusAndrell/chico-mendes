import s from './QuoteBlock.module.css'

export function QuoteBlock({ texto, autor, tone = 'dark' }) {
  return (
    <figure className={[s.quote, s[tone]].join(' ')}>
      <blockquote>
        <p>“{texto}”</p>
      </blockquote>
      {autor && <figcaption>{autor}</figcaption>}
    </figure>
  )
}
