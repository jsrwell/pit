import { NavLink } from 'react-router'

export function SiteHeader() {
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
        </nav>
      </div>
    </header>
  )
}
