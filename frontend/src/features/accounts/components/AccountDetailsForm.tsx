import { useState, type FormEvent } from 'react'

import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextField } from '@/shared/components/TextField'
import { formatPhone, nextPhoneDigits, phoneDigits } from '@/shared/format/phone'
import { useSubmit } from '@/shared/hooks/use-submit'

import type { Account } from '../api/account'
import { updateMyAccount, type AccountUpdate } from '../api/manage-account'
import { ACCOUNT_LIMITS, validateContact } from '../validation/account-fields'

interface AccountDetailsFormProps {
  account: Account
  onSaved: (account: Account) => void
  onCancel: () => void
}

export function AccountDetailsForm({ account, onSaved, onCancel }: AccountDetailsFormProps) {
  const [values, setValues] = useState<AccountUpdate>({
    name: account.name,
    email: account.email,
    phone: phoneDigits(account.phone),
  })
  const [checked, setChecked] = useState(false)
  const { submit, submitting, error, fields } = useSubmit(updateMyAccount)
  const errors = { ...fields, ...(checked ? validateContact(values) : {}) }

  function update(field: keyof AccountUpdate, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChecked(true)
    const invalid = Object.keys(validateContact(values))
    if (invalid.length > 0) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${invalid[0]}"]`)?.focus()
      return
    }
    const saved = await submit(values)
    if (saved !== null) onSaved(saved)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate aria-label="Editar dados">
      {error && <ErrorMessage message={error} />}
      <TextField
        id="account-name"
        name="name"
        label="Nome completo"
        autoComplete="name"
        maxLength={ACCOUNT_LIMITS.name}
        value={values.name}
        error={errors.name}
        onChange={(event) => update('name', event.target.value)}
      />
      <div className="form-grid form-grid--two">
        <TextField
          id="account-email"
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          maxLength={ACCOUNT_LIMITS.email}
          value={values.email}
          error={errors.email}
          onChange={(event) => update('email', event.target.value)}
        />
        <TextField
          id="account-phone"
          name="phone"
          label="Telefone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="(11) 98765-4321"
          maxLength={ACCOUNT_LIMITS.phoneMask}
          value={formatPhone(values.phone)}
          error={errors.phone}
          onChange={(event) => update('phone', nextPhoneDigits(values.phone, event.target.value))}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar dados'}
        </button>
        <button type="button" className="button button--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
