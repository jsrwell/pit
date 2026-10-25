import { TextField } from '@/shared/components/TextField'
import type { FieldErrors } from '@/shared/api/field-errors'

import { PAYMENT_LABELS, type PaymentMethod } from '../api/order'
import { CHECKOUT_LIMITS } from '../api/place-order'

export interface CardFields {
  number: string
  holder_name: string
  expiry: string
  cvv: string
}

interface PaymentSelectorProps {
  method: PaymentMethod
  card: CardFields
  errors: FieldErrors
  onMethod: (method: PaymentMethod) => void
  onCard: (card: CardFields) => void
}

const DESCRIPTIONS: Record<PaymentMethod, string> = {
  pix: 'Aprovação imediata.',
  credit_card: 'Pagamento seguro; não armazenamos o número do cartão.',
  cash: 'Pague ao receber ou retirar o pedido.',
}

const METHODS: PaymentMethod[] = ['pix', 'credit_card', 'cash']

export function PaymentSelector({ method, card, errors, onMethod, onCard }: PaymentSelectorProps) {
  return (
    <div className="stack">
      <fieldset className="choice-group">
        <legend>Forma de pagamento</legend>
        {METHODS.map((option) => (
          <label key={option} className="choice">
            <input
              type="radio"
              name="payment"
              checked={method === option}
              onChange={() => onMethod(option)}
            />
            <span>
              <strong>{PAYMENT_LABELS[option]}</strong>
              <span className="muted">{DESCRIPTIONS[option]}</span>
            </span>
          </label>
        ))}
      </fieldset>
      {method === 'credit_card' && (
        <div className="form" aria-label="Dados do cartão">
          <TextField
            id="card-number"
            label="Número do cartão"
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={CHECKOUT_LIMITS.cardNumber}
            value={card.number}
            error={errors['card.number']}
            onChange={(event) => onCard({ ...card, number: event.target.value })}
          />
          <TextField
            id="card-holder"
            label="Nome impresso no cartão"
            autoComplete="cc-name"
            maxLength={CHECKOUT_LIMITS.holderName}
            value={card.holder_name}
            error={errors['card.holder_name']}
            onChange={(event) => onCard({ ...card, holder_name: event.target.value })}
          />
          <div className="form-grid">
            <TextField
              id="card-expiry"
              label="Validade (MM/AA)"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="12/29"
              maxLength={CHECKOUT_LIMITS.expiry}
              value={card.expiry}
              error={errors['card.expiry_month'] ?? errors['card.expiry_year']}
              onChange={(event) => onCard({ ...card, expiry: event.target.value })}
            />
            <TextField
              id="card-cvv"
              label="CVV"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={CHECKOUT_LIMITS.cvv}
              value={card.cvv}
              error={errors['card.cvv']}
              onChange={(event) => onCard({ ...card, cvv: event.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
