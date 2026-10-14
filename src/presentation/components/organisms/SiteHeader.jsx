import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MENU } from '../../../app/routes'
import { Icon, Logo } from '../atoms'
import s from './SiteHeader.module.css'

/** Organismo: cabeçalho com o menu do site. */
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [open])

  return (
    <header className={[s.header, scrolled && s.scrolled, open && s.open].filter(Boolean).join(' ')}>
      <div className={s.inner}>
        <Logo size={56} />
        <nav aria-label="Menu principal" className={s.nav} id="menu-principal">
          <ul>
            {MENU.map((m) => (
              <li key={m.to}>
                <NavLink to={m.to} end={m.to === '/'} className={({ isActive }) => (isActive ? s.active : undefined)}>
                  {m.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className={s.toggle}
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </div>
    </header>
  )
}
