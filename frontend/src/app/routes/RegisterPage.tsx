import { useNavigate } from 'react-router'

import { signIn } from '@/features/accounts/api/sign-in'
import { RegisterForm } from '@/features/accounts/components/RegisterForm'

export function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="container page">
      <RegisterForm
        onRegistered={({ email, password }) => {
          signIn({ email, password })
            .then(() => navigate('/conta', { replace: true }))
            .catch(() => navigate('/entrar', { replace: true }))
        }}
      />
    </div>
  )
}
