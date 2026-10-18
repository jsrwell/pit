import { sendJson } from '@/shared/api/http-client'

import type { Order, PaymentMethod } from './order'
import type { FulfillmentInput } from './quote'

export interface CardInput {
  number: string
  holder_name: string
  expiry_month: number
  expiry_year: number
  cvv: string
}

export interface CheckoutInput extends FulfillmentInput {
  payment_method: PaymentMethod
  card: CardInput | null
  notes: string
}

export function placeOrder(input: CheckoutInput): Promise<Order> {
  return sendJson<Order>('/orders', 'POST', input)
}
