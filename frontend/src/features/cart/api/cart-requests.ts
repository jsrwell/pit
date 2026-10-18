import { request, sendJson } from '@/shared/api/http-client'

import type { Cart } from './cart'

export function getCart(): Promise<Cart> {
  return request<Cart>('/cart')
}

export function addToCart(productId: number, quantity: number): Promise<Cart> {
  return sendJson<Cart>('/cart/items', 'POST', { product_id: productId, quantity })
}

export function changeQuantity(productId: number, quantity: number): Promise<Cart> {
  return sendJson<Cart>(`/cart/items/${productId}`, 'PATCH', { quantity })
}

export function removeFromCart(productId: number): Promise<Cart> {
  return sendJson<Cart>(`/cart/items/${productId}`, 'DELETE')
}
