import { useCallback, useEffect, useState } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { useAsync } from '@/shared/hooks/use-async'

import type { OrderStatus } from '../../api/order'
import { STATUS_LABELS } from '../../api/order-status'
import { listStoreOrders } from '../../api/store-orders'
import { StoreOrderCard } from './StoreOrderCard'

import '../orders.css'

const FILTERS: (OrderStatus | null)[] = [
  null,
  'received',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'completed',
  'cancelled',
]

const REFRESH_INTERVAL_MS = 30_000

export function StoreOrdersBoard() {
  const [status, setStatus] = useState<OrderStatus | null>(null)
  const load = useCallback(() => listStoreOrders(status), [status])
  const { state, reload } = useAsync(load)

  useEffect(() => {
    const timer = setInterval(reload, REFRESH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [reload])

  return (
    <div className="stack">
      <div className="pill-group" role="group" aria-label="Filtrar por status">
        {FILTERS.map((filter) => (
          <button
            key={filter ?? 'all'}
            type="button"
            className="pill"
            aria-pressed={filter === status}
            onClick={() => setStatus(filter)}
          >
            {filter === null ? 'Todos' : STATUS_LABELS[filter]}
          </button>
        ))}
      </div>
      <AsyncContent state={state} loadingLabel="Carregando pedidos...">
        {(orders) =>
          orders.length === 0 ? (
            <p className="empty-state">Nenhum pedido neste status.</p>
          ) : (
            <div className="store-orders">
              {orders.map((order) => (
                <StoreOrderCard key={order.id} order={order} onChanged={reload} />
              ))}
            </div>
          )
        }
      </AsyncContent>
    </div>
  )
}
