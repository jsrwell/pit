import { Link } from 'react-router'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { formatPrice } from '@/shared/format/currency'
import { formatDateTime } from '@/shared/format/date-time'
import { useAsync } from '@/shared/hooks/use-async'

import { listMyOrders } from '../api/my-orders'
import { FULFILLMENT_LABELS } from '../api/order-status'
import { StatusBadge } from './StatusBadge'

import './orders.css'

export function MyOrders() {
  const { state } = useAsync(listMyOrders)

  return (
    <AsyncContent state={state} loadingLabel="Carregando seus pedidos...">
      {(orders) =>
        orders.length === 0 ? (
          <div className="empty-state panel">
            <h2>Você ainda não fez pedidos</h2>
            <Link to="/" className="button">
              Explorar a vitrine
            </Link>
          </div>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order.id} className="panel order-card">
                <div className="order-card__title">
                  <strong>Pedido nº {order.id}</strong>
                  <span className="muted">
                    {formatDateTime(order.created_at)} ·{' '}
                    {FULFILLMENT_LABELS[order.fulfillment_method]} · {formatPrice(order.total)}
                  </span>
                </div>
                <div className="row">
                  <StatusBadge status={order.status} />
                  <Link to={`/pedidos/${order.id}`} className="button button--ghost button--small">
                    Acompanhar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )
      }
    </AsyncContent>
  )
}
