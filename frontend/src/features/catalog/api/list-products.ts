import { request } from '@/shared/api/http-client'

import type { ProductSummary } from './product'

export function listProducts(): Promise<ProductSummary[]> {
  return request<ProductSummary[]>('/catalog/products')
}
