import { formatDateTime } from '@/shared/format/date-time'

import type { Order } from '../api/order'
import { STATUS_LABELS, stagesFor } from '../api/order-status'

import './orders.css'

export function StatusTimeline({ order }: { order: Order }) {
  const reachedAt = new Map(order.history.map((change) => [change.status, change.changed_at]))
  const stages =
    order.status === 'cancelled'
      ? order.history.map((change) => change.status)
      : stagesFor(order.fulfillment_method)

  return (
    <ol className="timeline" aria-label="Andamento do pedido">
      {stages.map((stage) => {
        const reached = reachedAt.get(stage)
        const current = stage === order.status
        const classes = ['timeline__step']
        if (reached) classes.push('timeline__step--done')
        if (current) classes.push('timeline__step--current')
        return (
          <li key={stage} className={classes.join(' ')} aria-current={current ? 'step' : undefined}>
            <span className="timeline__dot" aria-hidden="true" />
            <div>
              <strong>{STATUS_LABELS[stage]}</strong>
              {reached && <span className="muted">{formatDateTime(reached)}</span>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
