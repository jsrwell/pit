import { request, sendJson } from '@/shared/api/http-client'
import { queryString } from '@/shared/api/query-string'

import type { Order, OrderStatus } from './order'

export interface Customer {
  name: string
  email: string
  phone: string
}

export interface StoreOrder extends Order {
  customer: Customer | null
  next_statuses: OrderStatus[]
}

export function listStoreOrders(status: OrderStatus | null): Promise<StoreOrder[]> {
  return request<StoreOrder[]>(`/orders/admin${queryString({ status })}`)
}

export function changeOrderStatus(orderId: number, status: OrderStatus): Promise<StoreOrder> {
  return sendJson<StoreOrder>(`/orders/admin/${orderId}/status`, 'PATCH', { status })
}

export const ACTION_LABELS: Record<OrderStatus, string> = {
  received: 'Receber',
  confirmed: 'Confirmar',
  preparing: 'Iniciar preparo',
  ready: 'Marcar como pronto',
  out_for_delivery: 'Saiu para entrega',
  completed: 'Concluir',
  cancelled: 'Cancelar',
}
