import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useOnline } from '../../hooks/useOnline'
import { SiteFooter, SiteHeader } from '../organisms'
import s from './SiteLayout.module.css'

/** Template: estrutura de todas as páginas (cabeçalho, conteúdo, rodapé). */
export function SiteLayout() {
  const { pathname, hash } = useLocation()
  const online = useOnline()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) return void setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <SiteHeader />
      <main id="conteudo" className={s.main}>
        <Suspense fallback={<div className={s.loading} aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
      {!online && <div className={s.offline} role="status">Você está sem conexão. O conteúdo já visitado continua disponível.</div>}
    </>
  )
}
