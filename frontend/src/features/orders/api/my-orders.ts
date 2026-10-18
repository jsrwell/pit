import { request } from '@/shared/api/http-client'

import type { Order } from './order'

export function listMyOrders(): Promise<Order[]> {
  return request<Order[]>('/orders')
}

export function getMyOrder(orderId: number): Promise<Order> {
  return request<Order>(`/orders/${orderId}`)
}
