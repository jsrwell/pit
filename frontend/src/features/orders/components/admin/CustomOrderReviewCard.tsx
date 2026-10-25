import { useState } from 'react'

import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextAreaField } from '@/shared/components/TextAreaField'
import { TextField } from '@/shared/components/TextField'
import { formatPrice } from '@/shared/format/currency'
import { formatDate } from '@/shared/format/date-time'
import { formatPhone } from '@/shared/format/phone'
import { useSubmit } from '@/shared/hooks/use-submit'

import {
  CUSTOM_STATUS_LABELS,
  reviewCustomOrder,
  type CustomOrderReview,
  type StoreCustomOrder,
} from '../../api/custom-orders'

interface CustomOrderReviewCardProps {
  customOrder: StoreCustomOrder
  onReviewed: () => void
}

export function CustomOrderReviewCard({ customOrder, onReviewed }: CustomOrderReviewCardProps) {
  const [price, setPrice] = useState('')
  const [response, setResponse] = useState('')
  const { submit, submitting, error, fields } = useSubmit(reviewCustomOrder)
  const pending = customOrder.status === 'pending_review'

  async function decide(decision: CustomOrderReview['decision']) {
    const reviewed = await submit(customOrder.id, {
      decision,
      quoted_price: decision === 'approved' && price !== '' ? price : null,
      response,
    })
    if (reviewed !== null) onReviewed()
  }

  return (
    <article className="panel store-order" aria-label={`Encomenda ${customOrder.id}`}>
      <header className="store-order__header">
        <h3>
          Encomenda nº {customOrder.id} · {customOrder.quantity} un.
        </h3>
        <span className="badge">{CUSTOM_STATUS_LABELS[customOrder.status]}</span>
      </header>
      <dl className="facts">
        <div>
          <dt>Cliente</dt>
          <dd>
            {customOrder.customer?.name ?? 'Conta removida'}
            {customOrder.customer && (
              <>
                <br />
                <span className="muted">
                  {formatPhone(customOrder.customer.phone)} · {customOrder.customer.email}
                </span>
              </>
            )}
          </dd>
        </div>
        <div>
          <dt>Data desejada</dt>
          <dd>{formatDate(customOrder.desired_date)}</dd>
        </div>
      </dl>
      <p>{customOrder.description}</p>
      {customOrder.notes && <p className="muted">Observações: {customOrder.notes}</p>}
      {pending ? (
        <div className="form">
          <TextField
            id={`custom-price-${customOrder.id}`}
            label="Valor proposto (R$)"
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            error={fields.quoted_price}
            onChange={(event) => setPrice(event.target.value)}
          />
          <TextAreaField
            id={`custom-response-${customOrder.id}`}
            label="Resposta ao cliente"
            value={response}
            onChange={(event) => setResponse(event.target.value)}
          />
          {error && <ErrorMessage message={error} />}
          <div className="row">
            <button
              type="button"
              className="button button--small"
              disabled={submitting || price === ''}
              onClick={() => decide('approved')}
            >
              Aprovar
            </button>
            <button
              type="button"
              className="button button--danger button--small"
              disabled={submitting}
              onClick={() => decide('rejected')}
            >
              Recusar
            </button>
          </div>
        </div>
      ) : (
        <p className="feedback feedback--info">
          {customOrder.quoted_price && <>Valor: {formatPrice(customOrder.quoted_price)}. </>}
          {customOrder.store_response || 'Sem mensagem.'}
        </p>
      )}
    </article>
  )
}
