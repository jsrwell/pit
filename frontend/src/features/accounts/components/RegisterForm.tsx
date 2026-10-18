import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextField } from '@/shared/components/TextField'
import { useSubmit } from '@/shared/hooks/use-submit'

import { register, type AccountRegistration } from '../api/register'

import './accounts.css'

interface RegisterFormProps {
  onRegistered: (registration: AccountRegistration) => void
}

const EMPTY: AccountRegistration = { name: '', email: '', phone: '', password: '' }

export function RegisterForm({ onRegistered }: RegisterFormProps) {
  const [values, setValues] = useState<AccountRegistration>(EMPTY)
  const { submit, submitting, error, fields } = useSubmit(register)

  function update(field: keyof AccountRegistration, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if ((await submit(values)) !== null) {
      onRegistered(values)
    }
  }

  return (
    <form className="form auth-card panel" onSubmit={handleSubmit} noValidate>
      <div className="auth-card__heading">
        <span className="eyebrow">Bem-vindo à maison</span>
        <h1>Criar conta</h1>
        <p className="muted">Cadastre-se para comprar, salvar endereços e acompanhar pedidos.</p>
      </div>
      {error && <ErrorMessage message={error} />}
      <TextField
        id="register-name"
        label="Nome completo"
        autoComplete="name"
        required
        value={values.name}
        error={fields.name}
        onChange={(event) => update('name', event.target.value)}
      />
      <TextField
        id="register-email"
        label="E-mail"
        type="email"
        autoComplete="email"
        required
        value={values.email}
        error={fields.email}
        onChange={(event) => update('email', event.target.value)}
      />
      <TextField
        id="register-phone"
        label="Telefone"
        type="tel"
        autoComplete="tel"
        placeholder="(11) 98765-4321"
        required
        value={values.phone}
        error={fields.phone}
        onChange={(event) => update('phone', event.target.value)}
      />
      <TextField
        id="register-password"
        label="Senha"
        type="password"
        autoComplete="new-password"
        required
        hint="Mínimo de 8 caracteres, com letras e números."
        value={values.password}
        error={fields.password}
        onChange={(event) => update('password', event.target.value)}
      />
      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Criando conta...' : 'Criar conta'}
      </button>
      <p className="muted auth-card__switch">
        Já tem conta? <Link to="/entrar">Entrar</Link>
      </p>
    </form>
  )
}
