export interface CartLine {
  product_id: number
  name: string
  image_id: number | null
  unit_price: string
  quantity: number
  line_total: string
  is_available: boolean
}

export interface AppliedCombo {
  name: string
  times: number
  discount: string
}

export interface Cart {
  lines: CartLine[]
  item_count: number
  subtotal: string
  discount: string
  total: string
  applied_combos: AppliedCombo[]
  has_unavailable: boolean
}
