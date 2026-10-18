import { Navigate, Outlet, useLocation } from 'react-router'

import type { SessionRole } from '@/shared/auth/session-store'
import { useSession } from '@/shared/auth/use-session'

interface RequireAuthProps {
  role?: SessionRole
}

export function RequireAuth({ role }: RequireAuthProps) {
  const session = useSession()
  const location = useLocation()

  if (session === null) {
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  }
  if (role !== undefined && session.account.role !== role) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
