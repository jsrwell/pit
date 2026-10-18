import { NavLink, Outlet } from 'react-router'

export function AdminLayout() {
  return (
    <div className="container page admin">
      <div className="page-title">
        <span className="eyebrow">Painel administrativo</span>
        <h1>Gestão da loja</h1>
      </div>
      <nav className="admin-nav" aria-label="Seções do painel">
        <NavLink to="/admin/produtos">Produtos</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
