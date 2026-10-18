import { sendJson } from '@/shared/api/http-client'

export type FulfillmentMethod = 'pickup' | 'delivery'

export interface FulfillmentInput {
  fulfillment_method: FulfillmentMethod
  address_id: number | null
}

export interface DeliveryAddress {
  label: string
  zip_code: string
  street: string
  number: string
  complement: string
  district: string
  reference: string
}

export interface OrderLine {
  product_id: number
  name: string
  image_id: number | null
  unit_price: string
  quantity: number
  line_total: string
}

export interface Quote {
  lines: OrderLine[]
  fulfillment_method: FulfillmentMethod
  address: DeliveryAddress | null
  subtotal: string
  delivery_fee: string
  total: string
  pickup_address: string
}

export function quoteOrder(input: FulfillmentInput): Promise<Quote> {
  return sendJson<Quote>('/orders/quote', 'POST', input)
}
