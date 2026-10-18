import { request, sendJson } from '@/shared/api/http-client'

import type { ProductDetail } from './product'

export interface AdminProduct extends ProductDetail {
  is_active: boolean
  show_when_unavailable: boolean
  created_at: string
  updated_at: string
}

export interface ProductInput {
  name: string
  description: string
  composition: string
  highlights: string[]
  price: string
  category_name: string
  flavor_name: string
  image_id: number | null
  is_active: boolean
  is_available: boolean
  show_when_unavailable: boolean
  is_featured: boolean
}

export interface AvailabilityInput {
  is_available: boolean
  show_when_unavailable: boolean
}

export interface UploadedImage {
  id: number
  content_type: string
}

export function listAdminProducts(): Promise<AdminProduct[]> {
  return request<AdminProduct[]>('/catalog/admin/products')
}

export function getAdminProduct(productId: number): Promise<AdminProduct> {
  return request<AdminProduct>(`/catalog/admin/products/${productId}`)
}

export function createProduct(input: ProductInput): Promise<AdminProduct> {
  return sendJson<AdminProduct>('/catalog/admin/products', 'POST', input)
}

export function updateProduct(productId: number, input: ProductInput): Promise<AdminProduct> {
  return sendJson<AdminProduct>(`/catalog/admin/products/${productId}`, 'PUT', input)
}

export function setAvailability(
  productId: number,
  input: AvailabilityInput,
): Promise<AdminProduct> {
  return sendJson<AdminProduct>(`/catalog/admin/products/${productId}/availability`, 'PATCH', input)
}

export function uploadImage(file: File): Promise<UploadedImage> {
  const body = new FormData()
  body.append('file', file)
  return request<UploadedImage>('/catalog/admin/images', { method: 'POST', body })
}
