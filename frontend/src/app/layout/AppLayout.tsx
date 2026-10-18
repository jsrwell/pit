import { Outlet } from 'react-router'

import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

import './layout.css'

export function AppLayout() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
