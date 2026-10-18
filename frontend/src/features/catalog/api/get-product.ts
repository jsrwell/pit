import { request } from '@/shared/api/http-client'

import type { ProductDetail } from './product'

export function getProduct(productId: number): Promise<ProductDetail> {
  return request<ProductDetail>(`/catalog/products/${productId}`)
}
