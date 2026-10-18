import { NavLink, useNavigate } from 'react-router'

import { signOut } from '@/features/accounts/api/sign-in'
import { CartNavLink } from '@/features/cart/components/CartNavLink'
import { useSession } from '@/shared/auth/use-session'

export function SiteHeader() {
  const session = useSession()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to="/" className="brand" aria-label="Cupcakes Gourmet, página inicial">
          <span className="brand__name">Cupcakes Gourmet</span>
          <span className="brand__tagline">Maison de confeitaria</span>
        </NavLink>
        <nav className="site-nav" aria-label="Navegação principal">
          <NavLink to="/" end>
            Vitrine
          </NavLink>
          {session === null ? (
            <>
              <NavLink to="/entrar">Entrar</NavLink>
              <NavLink to="/cadastro">Criar conta</NavLink>
            </>
          ) : (
            <>
              {session.account.role === 'admin' && <NavLink to="/admin">Painel</NavLink>}
              <NavLink to="/pedidos">Pedidos</NavLink>
              <NavLink to="/conta">Minha conta</NavLink>
              <CartNavLink />
              <button type="button" onClick={handleSignOut}>
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
