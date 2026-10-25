import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import type { FieldErrors } from '@/shared/api/field-errors'
import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextField } from '@/shared/components/TextField'
import { formatPhone, nextPhoneDigits } from '@/shared/format/phone'
import { useSubmit } from '@/shared/hooks/use-submit'

import { register, type AccountRegistration } from '../api/register'
import { ACCOUNT_LIMITS, validateContact, validatePassword } from '../validation/account-fields'

import './accounts.css'

interface RegisterFormProps {
  onRegistered: (registration: AccountRegistration) => void
}

const EMPTY: AccountRegistration = { name: '', email: '', phone: '', password: '' }

function validate(values: AccountRegistration): FieldErrors {
  const errors = validateContact(values)
  const password = validatePassword(values.password)
  return password === undefined ? errors : { ...errors, password }
}

export function RegisterForm({ onRegistered }: RegisterFormProps) {
  const [values, setValues] = useState<AccountRegistration>(EMPTY)
  const [checked, setChecked] = useState(false)
  const { submit, submitting, error, fields } = useSubmit(register)
  const localErrors = checked ? validate(values) : {}
  const errors = { ...fields, ...localErrors }

  function update(field: keyof AccountRegistration, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChecked(true)
    const invalid = Object.keys(validate(values))
    if (invalid.length > 0) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${invalid[0]}"]`)?.focus()
      return
    }
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
        name="name"
        label="Nome completo"
        autoComplete="name"
        required
        maxLength={ACCOUNT_LIMITS.name}
        value={values.name}
        error={errors.name}
        onChange={(event) => update('name', event.target.value)}
      />
      <TextField
        id="register-email"
        name="email"
        label="E-mail"
        type="email"
        autoComplete="email"
        required
        maxLength={ACCOUNT_LIMITS.email}
        value={values.email}
        error={errors.email}
        onChange={(event) => update('email', event.target.value)}
      />
      <TextField
        id="register-phone"
        name="phone"
        label="Telefone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="(11) 98765-4321"
        required
        maxLength={ACCOUNT_LIMITS.phoneMask}
        value={formatPhone(values.phone)}
        error={errors.phone}
        onChange={(event) => update('phone', nextPhoneDigits(values.phone, event.target.value))}
      />
      <TextField
        id="register-password"
        name="password"
        label="Senha"
        type="password"
        autoComplete="new-password"
        required
        maxLength={ACCOUNT_LIMITS.password}
        hint="Mínimo de 8 caracteres, com letras e números."
        value={values.password}
        error={errors.password}
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
