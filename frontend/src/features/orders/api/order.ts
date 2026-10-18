import type { FulfillmentMethod } from './quote'

export type OrderStatus =
  'received' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled'

export type PaymentMethod = 'pix' | 'credit_card' | 'cash'

export type PaymentStatus = 'approved' | 'pending'

export interface OrderItem {
  product_id: number
  product_name: string
  unit_price: string
  quantity: number
  line_total: string
}

export interface StatusChange {
  status: OrderStatus
  changed_at: string
}

export interface Order {
  id: number
  status: OrderStatus
  fulfillment_method: FulfillmentMethod
  delivery_address: string | null
  delivery_reference: string | null
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  payment_reference: string
  subtotal: string
  delivery_fee: string
  total: string
  notes: string
  created_at: string
  updated_at: string
  items: OrderItem[]
  history: StatusChange[]
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: 'Pix',
  credit_card: 'Cartão de crédito',
  cash: 'Dinheiro na retirada ou entrega',
}
