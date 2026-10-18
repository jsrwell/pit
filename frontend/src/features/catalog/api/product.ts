export interface NamedItem {
  id: number
  name: string
}

export interface ProductSummary {
  id: number
  name: string
  price: string
  image_id: number | null
  category: NamedItem
  flavor: NamedItem
  is_available: boolean
  is_featured: boolean
}

export interface ProductDetail extends ProductSummary {
  description: string
  composition: string
  highlights: string[]
}
