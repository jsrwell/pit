import { request } from '@/shared/api/http-client'
import { queryString } from '@/shared/api/query-string'

import type { ProductSummary } from './product'

export interface ProductFilters {
  category_id?: number
  flavor_id?: number
  min_price?: string
  max_price?: string
  search?: string
}

export function listProducts(filters: ProductFilters = {}): Promise<ProductSummary[]> {
  return request<ProductSummary[]>(`/catalog/products${queryString({ ...filters })}`)
}
