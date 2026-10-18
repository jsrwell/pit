import type { FulfillmentMethod } from '../api/quote'

interface FulfillmentSelectorProps {
  value: FulfillmentMethod
  onChange: (method: FulfillmentMethod) => void
}

export function FulfillmentSelector({ value, onChange }: FulfillmentSelectorProps) {
  return (
    <fieldset className="choice-group">
      <legend>Como deseja receber?</legend>
      <label className="choice">
        <input
          type="radio"
          name="fulfillment"
          checked={value === 'pickup'}
          onChange={() => onChange('pickup')}
        />
        <span>
          <strong>Retirada na loja</strong>
          <span className="muted">
            Sem taxa. Retire na nossa maison quando o pedido estiver pronto.
          </span>
        </span>
      </label>
      <label className="choice">
        <input
          type="radio"
          name="fulfillment"
          checked={value === 'delivery'}
          onChange={() => onChange('delivery')}
        />
        <span>
          <strong>Entrega</strong>
          <span className="muted">Levamos até você. Taxa de entrega aplicada no total.</span>
        </span>
      </label>
    </fieldset>
  )
}
