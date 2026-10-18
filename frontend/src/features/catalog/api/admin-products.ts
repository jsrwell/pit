import { request, sendJson } from '@/shared/api/http-client'

import type { ProductDetail } from './product'

export interface AdminProduct extends ProductDetail {
  is_active: boolean
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
  is_featured: boolean
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

export function uploadImage(file: File): Promise<UploadedImage> {
  const body = new FormData()
  body.append('file', file)
  return request<UploadedImage>('/catalog/admin/images', { method: 'POST', body })
}
