import { useState, type FormEvent } from 'react'

import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextField } from '@/shared/components/TextField'
import { useSubmit } from '@/shared/hooks/use-submit'

import { changePassword } from '../api/manage-account'
import { ACCOUNT_LIMITS } from '../validation/account-fields'

interface PasswordValues {
  current: string
  next: string
  confirmation: string
}

const EMPTY: PasswordValues = { current: '', next: '', confirmation: '' }

export function PasswordForm() {
  const [values, setValues] = useState<PasswordValues>(EMPTY)
  const [mismatch, setMismatch] = useState(false)
  const [changed, setChanged] = useState(false)
  const { submit, submitting, error, fields } = useSubmit(changePassword)

  function update(field: keyof PasswordValues, value: string) {
    setChanged(false)
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const different = values.next !== values.confirmation
    setMismatch(different)
    if (different) return
    const result = await submit({ current_password: values.current, new_password: values.next })
    if (result !== null) {
      setValues(EMPTY)
      setChanged(true)
    }
  }

  return (
    <form
      className="form panel account-section"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="password-heading"
    >
      <div className="account-section__heading">
        <span className="eyebrow">Segurança</span>
        <h2 id="password-heading">Trocar senha</h2>
        <p className="muted">Confirme a senha atual para definir uma nova.</p>
      </div>
      {error && <ErrorMessage message={error} />}
      {changed && (
        <p role="status" className="feedback feedback--success">
          Senha alterada. Use a nova senha no próximo acesso.
        </p>
      )}
      <TextField
        id="password-current"
        label="Senha atual"
        type="password"
        autoComplete="current-password"
        maxLength={ACCOUNT_LIMITS.password}
        value={values.current}
        error={fields.current_password}
        onChange={(event) => update('current', event.target.value)}
      />
      <div className="form-grid form-grid--two">
        <TextField
          id="password-new"
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          maxLength={ACCOUNT_LIMITS.password}
          hint="Mínimo de 8 caracteres, com letras e números."
          value={values.next}
          error={fields.new_password}
          onChange={(event) => update('next', event.target.value)}
        />
        <TextField
          id="password-confirmation"
          label="Confirme a nova senha"
          type="password"
          autoComplete="new-password"
          maxLength={ACCOUNT_LIMITS.password}
          value={values.confirmation}
          error={mismatch ? 'As senhas não coincidem.' : undefined}
          onChange={(event) => update('confirmation', event.target.value)}
        />
      </div>
      <div className="form-actions">
        <button
          type="submit"
          className="button"
          disabled={submitting || values.current === '' || values.next === ''}
        >
          {submitting ? 'Alterando...' : 'Alterar senha'}
        </button>
      </div>
    </form>
  )
}
