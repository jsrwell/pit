import type { OrderStatus } from '../api/order'
import { STATUS_LABELS } from '../api/order-status'

const TONES: Partial<Record<OrderStatus, string>> = {
  completed: 'badge--success',
  cancelled: 'badge--muted',
  ready: 'badge--gold',
  out_for_delivery: 'badge--gold',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge ${TONES[status] ?? ''}`}>{STATUS_LABELS[status]}</span>
}
