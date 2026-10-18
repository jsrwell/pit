import { Navigate, useLocation, useNavigate } from 'react-router'

import { LoginForm } from '@/features/accounts/components/LoginForm'
import { useSession } from '@/shared/auth/use-session'

import { homeFor } from './home-for'

function redirectTarget(state: unknown): string | null {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const { from } = state as { from: unknown }
    return typeof from === 'string' ? from : null
  }
  return null
}

export function LoginPage() {
  const session = useSession()
  const navigate = useNavigate()
  const from = redirectTarget(useLocation().state)

  if (session !== null) {
    return <Navigate to={from ?? homeFor(session.account.role)} replace />
  }

  return (
    <div className="container page">
      <LoginForm
        onSignedIn={(account) => navigate(from ?? homeFor(account.role), { replace: true })}
      />
    </div>
  )
}
