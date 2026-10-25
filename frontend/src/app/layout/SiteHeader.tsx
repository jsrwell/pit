import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'

import { signOut } from '@/features/accounts/api/sign-in'
import { CartNavLink } from '@/features/cart/components/CartNavLink'
import { HeaderSearch } from '@/features/catalog/components/HeaderSearch'
import { useSession } from '@/shared/auth/use-session'

import { Brand } from './Brand'

export function SiteHeader() {
  const session = useSession()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <header className={open ? 'site-header site-header--open' : 'site-header'}>
      <div className="container site-header__inner">
        <Brand />
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((current) => !current)}
        >
          <span aria-hidden="true" />
        </button>
        <div id="site-menu" className="site-menu">
          <HeaderSearch onSearched={() => setOpen(false)} />
          <nav className="site-nav" aria-label="Navegação principal">
            <NavLink to="/" end>
              Vitrine
            </NavLink>
            <NavLink to="/encomendas">Encomendas</NavLink>
            {session === null ? (
              <>
                <NavLink to="/entrar">Entrar</NavLink>
                <NavLink to="/cadastro" className="site-nav__cta">
                  Criar conta
                </NavLink>
              </>
            ) : (
              <>
                {session.account.role === 'admin' && <NavLink to="/admin">Painel</NavLink>}
                <NavLink to="/pedidos">Pedidos</NavLink>
                <NavLink to="/conta">Minha conta</NavLink>
                <CartNavLink />
                <button type="button" className="site-nav__signout" onClick={handleSignOut}>
                  Sair
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
