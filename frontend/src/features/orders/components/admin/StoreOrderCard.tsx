import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { formatPrice } from '@/shared/format/currency'
import { formatDateTime } from '@/shared/format/date-time'
import { useSubmit } from '@/shared/hooks/use-submit'

import { PAYMENT_LABELS } from '../../api/order'
import { FULFILLMENT_LABELS } from '../../api/order-status'
import { ACTION_LABELS, changeOrderStatus, type StoreOrder } from '../../api/store-orders'
import { StatusBadge } from '../StatusBadge'

interface StoreOrderCardProps {
  order: StoreOrder
  onChanged: () => void
}

export function StoreOrderCard({ order, onChanged }: StoreOrderCardProps) {
  const { submit, submitting, error } = useSubmit(changeOrderStatus)

  async function move(status: StoreOrder['status']) {
    if ((await submit(order.id, status)) !== null) onChanged()
  }

  return (
    <article className="panel store-order" aria-label={`Pedido ${order.id}`}>
      <header className="row row--between">
        <div className="stack">
          <h3>Pedido nº {order.id}</h3>
          <span className="muted">{formatDateTime(order.created_at)}</span>
        </div>
        <StatusBadge status={order.status} />
      </header>
      <dl className="order-facts store-order__facts">
        <div>
          <dt>Cliente</dt>
          <dd>
            {order.customer ? (
              <>
                {order.customer.name}
                <br />
                <span className="muted">
                  {order.customer.phone} · {order.customer.email}
                </span>
              </>
            ) : (
              'Conta removida'
            )}
          </dd>
        </div>
        <div>
          <dt>Recebimento</dt>
          <dd>
            {FULFILLMENT_LABELS[order.fulfillment_method]}
            {order.delivery_address && (
              <>
                <br />
                <span className="muted">{order.delivery_address}</span>
              </>
            )}
            {order.delivery_reference && (
              <>
                <br />
                <span className="muted">Referência: {order.delivery_reference}</span>
              </>
            )}
          </dd>
        </div>
        <div>
          <dt>Pagamento</dt>
          <dd>
            {PAYMENT_LABELS[order.payment_method]} ·{' '}
            {order.payment_status === 'approved' ? 'pago' : 'a receber'}
          </dd>
        </div>
        <div>
          <dt>Observações do cliente</dt>
          <dd>{order.notes || 'Nenhuma'}</dd>
        </div>
      </dl>
      <ul className="store-order__items">
        {order.items.map((item) => (
          <li key={item.product_id}>
            {item.quantity}× {item.product_name}
          </li>
        ))}
      </ul>
      <footer className="row row--between">
        <strong>Total {formatPrice(order.total)}</strong>
        <div className="row">
          {order.next_statuses.map((status) => (
            <button
              key={status}
              type="button"
              className={
                status === 'cancelled'
                  ? 'button button--danger button--small'
                  : 'button button--small'
              }
              disabled={submitting}
              onClick={() => move(status)}
            >
              {ACTION_LABELS[status]}
            </button>
          ))}
        </div>
      </footer>
      {error && <ErrorMessage message={error} />}
    </article>
  )
}
