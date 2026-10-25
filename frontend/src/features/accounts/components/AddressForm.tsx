import { useState, type FormEvent } from 'react'

import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextField } from '@/shared/components/TextField'
import { useSubmit } from '@/shared/hooks/use-submit'

import {
  ADDRESS_LIMITS,
  createAddress,
  updateAddress,
  type Address,
  type AddressInput,
} from '../api/addresses'

interface AddressFormProps {
  address?: Address
  onSaved: (address: Address) => void
  onCancel: () => void
}

const EMPTY: AddressInput = {
  label: 'Casa',
  zip_code: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  reference: '',
  is_primary: false,
}

export function AddressForm({ address, onSaved, onCancel }: AddressFormProps) {
  const [values, setValues] = useState<AddressInput>(address ?? EMPTY)
  const { submit, submitting, error, fields } = useSubmit((input: AddressInput) =>
    address ? updateAddress(address.id, input) : createAddress(input),
  )

  function update<K extends keyof AddressInput>(field: K, value: AddressInput[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const saved = await submit(values)
    if (saved !== null) onSaved(saved)
  }

  return (
    <form className="form panel" onSubmit={handleSubmit} noValidate aria-label="Endereço">
      {error && <ErrorMessage message={error} />}
      <div className="form-grid">
        <TextField
          id="address-label"
          label="Identificação"
          placeholder="Casa, Trabalho..."
          maxLength={ADDRESS_LIMITS.label}
          value={values.label}
          error={fields.label}
          onChange={(event) => update('label', event.target.value)}
        />
        <TextField
          id="address-zip"
          label="CEP"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          maxLength={ADDRESS_LIMITS.zip_code}
          value={values.zip_code}
          error={fields.zip_code}
          onChange={(event) => update('zip_code', event.target.value)}
        />
      </div>
      <TextField
        id="address-street"
        label="Rua"
        autoComplete="address-line1"
        maxLength={ADDRESS_LIMITS.street}
        value={values.street}
        error={fields.street}
        onChange={(event) => update('street', event.target.value)}
      />
      <div className="form-grid">
        <TextField
          id="address-number"
          label="Número"
          maxLength={ADDRESS_LIMITS.number}
          value={values.number}
          error={fields.number}
          onChange={(event) => update('number', event.target.value)}
        />
        <TextField
          id="address-complement"
          label="Complemento"
          autoComplete="address-line2"
          maxLength={ADDRESS_LIMITS.complement}
          value={values.complement}
          error={fields.complement}
          onChange={(event) => update('complement', event.target.value)}
        />
      </div>
      <TextField
        id="address-district"
        label="Bairro"
        maxLength={ADDRESS_LIMITS.district}
        value={values.district}
        error={fields.district}
        onChange={(event) => update('district', event.target.value)}
      />
      <TextField
        id="address-reference"
        label="Ponto de referência"
        maxLength={ADDRESS_LIMITS.reference}
        value={values.reference}
        error={fields.reference}
        onChange={(event) => update('reference', event.target.value)}
      />
      <label className="checkbox">
        <input
          type="checkbox"
          checked={values.is_primary}
          onChange={(event) => update('is_primary', event.target.checked)}
        />
        Usar como endereço principal
      </label>
      <div className="row">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar endereço'}
        </button>
        <button type="button" className="button button--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
