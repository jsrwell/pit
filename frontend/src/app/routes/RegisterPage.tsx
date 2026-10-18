import { useState } from 'react'

import { RegisterForm } from '@/features/accounts/components/RegisterForm'

export function RegisterPage() {
  const [registeredName, setRegisteredName] = useState<string | null>(null)

  return (
    <div className="container page">
      {registeredName === null ? (
        <RegisterForm onRegistered={(registration) => setRegisteredName(registration.name)} />
      ) : (
        <div className="panel auth-card empty-state" role="status">
          <span className="eyebrow">Conta criada</span>
          <h1>Seja bem-vindo, {registeredName}</h1>
          <p>Seu cadastro foi concluído. Agora você já pode entrar na sua conta.</p>
        </div>
      )}
    </div>
  )
}
