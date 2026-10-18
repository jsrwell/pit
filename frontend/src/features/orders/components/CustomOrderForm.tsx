import { useState, type FormEvent } from 'react'

import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextAreaField } from '@/shared/components/TextAreaField'
import { TextField } from '@/shared/components/TextField'
import { useSubmit } from '@/shared/hooks/use-submit'

import { requestCustomOrder, type CustomOrder } from '../api/custom-orders'

interface CustomOrderFormProps {
  onRequested: (customOrder: CustomOrder) => void
}

interface FormValues {
  description: string
  quantity: string
  desired_date: string
  notes: string
}

const EMPTY: FormValues = { description: '', quantity: '12', desired_date: '', notes: '' }

export function CustomOrderForm({ onRequested }: CustomOrderFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const { submit, submitting, error, fields } = useSubmit(requestCustomOrder)

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const created = await submit({ ...values, quantity: Number(values.quantity) })
    if (created !== null) {
      setValues(EMPTY)
      onRequested(created)
    }
  }

  return (
    <form className="form panel" onSubmit={handleSubmit} noValidate aria-label="Nova encomenda">
      {error && <ErrorMessage message={error} />}
      <TextAreaField
        id="custom-description"
        label="O que você deseja?"
        placeholder="Tema, sabores, cores, decoração..."
        value={values.description}
        error={fields.description}
        onChange={(event) => update('description', event.target.value)}
      />
      <div className="form-grid">
        <TextField
          id="custom-quantity"
          label="Quantidade"
          type="number"
          min="6"
          max="500"
          hint="Mínimo de 6 unidades."
          value={values.quantity}
          error={fields.quantity}
          onChange={(event) => update('quantity', event.target.value)}
        />
        <TextField
          id="custom-date"
          label="Data desejada"
          type="date"
          value={values.desired_date}
          error={fields.desired_date}
          onChange={(event) => update('desired_date', event.target.value)}
        />
      </div>
      <TextAreaField
        id="custom-notes"
        label="Observações"
        placeholder="Restrições alimentares, horário, mensagem..."
        value={values.notes}
        error={fields.notes}
        onChange={(event) => update('notes', event.target.value)}
      />
      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Solicitar encomenda'}
      </button>
    </form>
  )
}
