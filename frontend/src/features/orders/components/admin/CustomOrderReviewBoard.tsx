import { useCallback, useState } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { useAsync } from '@/shared/hooks/use-async'

import {
  CUSTOM_STATUS_LABELS,
  listStoreCustomOrders,
  type CustomOrderStatus,
} from '../../api/custom-orders'
import { CustomOrderReviewCard } from './CustomOrderReviewCard'

import '../orders.css'

const FILTERS: (CustomOrderStatus | null)[] = ['pending_review', 'approved', 'rejected', null]

export function CustomOrderReviewBoard() {
  const [status, setStatus] = useState<CustomOrderStatus | null>('pending_review')
  const load = useCallback(() => listStoreCustomOrders(status), [status])
  const { state, reload } = useAsync(load)

  return (
    <div className="stack">
      <div className="pill-group" role="group" aria-label="Filtrar encomendas">
        {FILTERS.map((filter) => (
          <button
            key={filter ?? 'all'}
            type="button"
            className="pill"
            aria-pressed={filter === status}
            onClick={() => setStatus(filter)}
          >
            {filter === null ? 'Todas' : CUSTOM_STATUS_LABELS[filter]}
          </button>
        ))}
      </div>
      <AsyncContent state={state} loadingLabel="Carregando encomendas...">
        {(customOrders) =>
          customOrders.length === 0 ? (
            <p className="empty-state">Nenhuma encomenda neste status.</p>
          ) : (
            <div className="store-orders">
              {customOrders.map((item) => (
                <CustomOrderReviewCard key={item.id} customOrder={item} onReviewed={reload} />
              ))}
            </div>
          )
        }
      </AsyncContent>
    </div>
  )
}
