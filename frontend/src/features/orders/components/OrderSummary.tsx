import type { ReactNode } from 'react'

import { formatPrice } from '@/shared/format/currency'

interface SummaryLine {
  product_id: number
  name: string
  quantity: number
  line_total: string
}

interface OrderSummaryProps {
  lines: SummaryLine[]
  subtotal: string
  deliveryFee: string
  total: string
  children?: ReactNode
}

export function OrderSummary({ lines, subtotal, deliveryFee, total, children }: OrderSummaryProps) {
  return (
    <aside className="panel summary" aria-label="Resumo do pedido">
      <h2>Resumo</h2>
      <ul className="summary__items">
        {lines.map((line) => (
          <li key={line.product_id} className="summary__row">
            <span>
              {line.quantity}× {line.name}
            </span>
            <span>{formatPrice(line.line_total)}</span>
          </li>
        ))}
      </ul>
      <div className="summary__row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="summary__row">
        <span>Taxa de entrega</span>
        <span data-testid="delivery-fee">
          {Number(deliveryFee) === 0 ? 'Grátis' : formatPrice(deliveryFee)}
        </span>
      </div>
      <div className="summary__row summary__total">
        <span>Total</span>
        <span data-testid="order-total">{formatPrice(total)}</span>
      </div>
      {children}
    </aside>
  )
}
