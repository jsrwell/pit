import { sendJson } from '@/shared/api/http-client'

import type { Order, PaymentMethod } from './order'
import type { FulfillmentInput } from './quote'

export const CHECKOUT_LIMITS = {
  notes: 500,
  cardNumber: 23,
  holderName: 80,
  expiry: 5,
  cvv: 4,
} as const

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
