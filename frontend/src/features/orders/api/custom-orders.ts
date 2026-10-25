import { request, sendJson } from '@/shared/api/http-client'
import { queryString } from '@/shared/api/query-string'

import type { Customer } from './store-orders'

export type CustomOrderStatus = 'pending_review' | 'approved' | 'rejected'

export interface CustomOrderInput {
  description: string
  quantity: number
  desired_date: string
  notes: string
}

export interface CustomOrder extends CustomOrderInput {
  id: number
  status: CustomOrderStatus
  quoted_price: string | null
  store_response: string
  created_at: string
  reviewed_at: string | null
}

export interface StoreCustomOrder extends CustomOrder {
  customer: Customer | null
}

export interface CustomOrderReview {
  decision: 'approved' | 'rejected'
  quoted_price: string | null
  response: string
}

export const CUSTOM_ORDER_LIMITS = { description: 1000, notes: 500 } as const

export const CUSTOM_STATUS_LABELS: Record<CustomOrderStatus, string> = {
  pending_review: 'Em análise',
  approved: 'Aprovada',
  rejected: 'Recusada',
}

export function requestCustomOrder(input: CustomOrderInput): Promise<CustomOrder> {
  return sendJson<CustomOrder>('/orders/custom', 'POST', input)
}

export function listMyCustomOrders(): Promise<CustomOrder[]> {
  return request<CustomOrder[]>('/orders/custom')
}

export function listStoreCustomOrders(
  status: CustomOrderStatus | null,
): Promise<StoreCustomOrder[]> {
  return request<StoreCustomOrder[]>(`/orders/admin/custom${queryString({ status })}`)
}

export function reviewCustomOrder(
  customOrderId: number,
  review: CustomOrderReview,
): Promise<StoreCustomOrder> {
  return sendJson<StoreCustomOrder>(`/orders/admin/custom/${customOrderId}/review`, 'PATCH', review)
}
