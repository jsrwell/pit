import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextField } from '@/shared/components/TextField'
import { useSubmit } from '@/shared/hooks/use-submit'

import type { Account } from '../api/account'
import { signIn, type Credentials } from '../api/sign-in'

import './accounts.css'

interface LoginFormProps {
  onSignedIn: (account: Account) => void
}

export function LoginForm({ onSignedIn }: LoginFormProps) {
  const [values, setValues] = useState<Credentials>({ email: '', password: '' })
  const { submit, submitting, error, fields } = useSubmit(signIn)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const account = await submit(values)
    if (account !== null) {
      onSignedIn(account)
    }
  }

  return (
    <form className="form auth-card panel" onSubmit={handleSubmit} noValidate>
      <div className="auth-card__heading">
        <span className="eyebrow">Área do cliente</span>
        <h1>Entrar</h1>
        <p className="muted">Acesse seu carrinho, endereços e pedidos.</p>
      </div>
      {error && <ErrorMessage message={error} />}
      <TextField
        id="login-email"
        label="E-mail"
        type="email"
        autoComplete="email"
        required
        value={values.email}
        error={fields.email}
        onChange={(event) => setValues({ ...values, email: event.target.value })}
      />
      <TextField
        id="login-password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        required
        value={values.password}
        error={fields.password}
        onChange={(event) => setValues({ ...values, password: event.target.value })}
      />
      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Entrando...' : 'Entrar'}
      </button>
      <p className="muted auth-card__switch">
        Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </form>
  )
}
