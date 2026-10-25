import { useRef, useState, type FormEvent } from 'react'

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
import { formatZip, type ZipAddress } from '../api/zip-lookup'
import { useZipAutofill, ZIP_MESSAGES } from '../hooks/use-zip-autofill'

interface AddressFormProps {
  address?: Address
  onSaved: (address: Address) => void
  onCancel: () => void
}

type AutofilledField = keyof ZipAddress

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

  const edited = useRef(new Set<AutofilledField>())
  const numberInput = useRef<HTMLInputElement>(null)
  const zip = useZipAutofill(fillFromZip)
  const zipMessage = ZIP_MESSAGES[zip.status]

  function update<K extends keyof AddressInput>(field: K, value: AddressInput[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function fillFromZip(found: ZipAddress) {
    const filled = (['street', 'district'] as const).filter(
      (field) => found[field] !== '' && !edited.current.has(field),
    )
    setValues((current) => ({
      ...current,
      ...Object.fromEntries(filled.map((field) => [field, found[field]])),
    }))
    if (filled.length > 0) numberInput.current?.focus()
  }

  function changeZip(typed: string) {
    const formatted = formatZip(typed)
    update('zip_code', formatted)
    edited.current.clear()
    void zip.lookup(formatted)
  }

  function editAutofilled(field: AutofilledField, value: string) {
    edited.current.add(field)
    update(field, value)
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
          hint={zipMessage || 'O endereço é preenchido a partir do CEP.'}
          aria-busy={zip.status === 'loading'}
          value={values.zip_code}
          error={fields.zip_code}
          onChange={(event) => changeZip(event.target.value)}
        />
      </div>
      <p role="status" className="visually-hidden">
        {zipMessage}
      </p>
      <TextField
        id="address-street"
        label="Rua"
        autoComplete="address-line1"
        maxLength={ADDRESS_LIMITS.street}
        value={values.street}
        error={fields.street}
        onChange={(event) => editAutofilled('street', event.target.value)}
      />
      <div className="form-grid">
        <TextField
          id="address-number"
          ref={numberInput}
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
        onChange={(event) => editAutofilled('district', event.target.value)}
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
