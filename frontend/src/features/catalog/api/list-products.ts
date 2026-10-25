import { request } from '@/shared/api/http-client'
import { queryString } from '@/shared/api/query-string'

import type { ProductSummary } from './product'

export type ProductSort = 'featured' | 'price_asc' | 'price_desc'

export const SORT_LABELS: Record<ProductSort, string> = {
  featured: 'Destaques primeiro',
  price_asc: 'Menor preço',
  price_desc: 'Maior preço',
}

export interface ProductFilters {
  category_id?: number
  flavor_id?: number
  min_price?: string
  max_price?: string
  search?: string
  sort?: ProductSort
}

export function listProducts(filters: ProductFilters = {}): Promise<ProductSummary[]> {
  return request<ProductSummary[]>(`/catalog/products${queryString({ ...filters })}`)
}
