import { useCallback, useEffect } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { formatDateTime } from '@/shared/format/date-time'
import { useAsync } from '@/shared/hooks/use-async'

import { getMyOrder } from '../api/my-orders'
import { PAYMENT_LABELS } from '../api/order'
import { FULFILLMENT_LABELS, STATUS_LABELS } from '../api/order-status'
import { OrderSummary } from './OrderSummary'
import { StatusTimeline } from './StatusTimeline'

import './orders.css'

const REFRESH_INTERVAL_MS = 30_000

export function OrderTracking({ orderId }: { orderId: number }) {
  const load = useCallback(() => getMyOrder(orderId), [orderId])
  const { state, reload } = useAsync(load)

  useEffect(() => {
    const timer = setInterval(reload, REFRESH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [reload])

  return (
    <AsyncContent state={state} loadingLabel="Carregando o pedido...">
      {(order) => (
        <div className="order-detail">
          <div className="stack">
            <section className="panel stack" aria-labelledby="order-status-heading">
              <span className="eyebrow">Status atual</span>
              <h2 id="order-status-heading">{STATUS_LABELS[order.status]}</h2>
              <p className="muted">Pedido feito em {formatDateTime(order.created_at)}</p>
              <StatusTimeline order={order} />
            </section>
            <section className="panel">
              <dl className="order-facts">
                <div>
                  <dt>Recebimento</dt>
                  <dd>{FULFILLMENT_LABELS[order.fulfillment_method]}</dd>
                </div>
                {order.delivery_address && (
                  <div>
                    <dt>Endereço</dt>
                    <dd>{order.delivery_address}</dd>
                  </div>
                )}
                <div>
                  <dt>Pagamento</dt>
                  <dd>
                    {PAYMENT_LABELS[order.payment_method]} ·{' '}
                    {order.payment_status === 'approved' ? 'aprovado' : 'pendente'}
                  </dd>
                </div>
                {order.notes && (
                  <div>
                    <dt>Observações</dt>
                    <dd>{order.notes}</dd>
                  </div>
                )}
              </dl>
            </section>
          </div>
          <OrderSummary
            lines={order.items.map((item) => ({
              product_id: item.product_id,
              name: item.product_name,
              quantity: item.quantity,
              line_total: item.line_total,
            }))}
            subtotal={order.subtotal}
            discount={order.discount}
            deliveryFee={order.delivery_fee}
            total={order.total}
          />
        </div>
      )}
    </AsyncContent>
  )
}
