import { request, sendJson } from '@/shared/api/http-client'

export interface Period {
  starts_at: string
  ends_at: string
}

export interface PromotionInput extends Period {
  name: string
  product_id: number
  promotional_price: string
  is_active: boolean
}

export interface Promotion extends PromotionInput {
  id: number
  is_running: boolean
}

export interface ComboItem {
  product_id: number
  quantity: number
}

export interface ComboInput extends Period {
  name: string
  description: string
  price: string
  is_active: boolean
  items: ComboItem[]
}

export interface Combo extends ComboInput {
  id: number
  is_running: boolean
}

export interface ProductOption {
  id: number
  name: string
  price: string
  image_id: number | null
  is_featured: boolean
}

export function listRunningCombos(): Promise<Combo[]> {
  return request<Combo[]>('/promotions/combos')
}

export function listStorefrontProducts(): Promise<ProductOption[]> {
  return request<ProductOption[]>('/catalog/products')
}

export function listAllProducts(): Promise<ProductOption[]> {
  return request<ProductOption[]>('/catalog/admin/products')
}

export function setFeatured(productId: number, isFeatured: boolean): Promise<ProductOption> {
  return sendJson<ProductOption>(`/catalog/admin/products/${productId}/featured`, 'PATCH', {
    is_featured: isFeatured,
  })
}

const ADMIN = '/promotions/admin'

export function listPromotions(): Promise<Promotion[]> {
  return request<Promotion[]>(`${ADMIN}/promotions`)
}

export function savePromotion(input: PromotionInput, promotionId?: number): Promise<Promotion> {
  return promotionId === undefined
    ? sendJson<Promotion>(`${ADMIN}/promotions`, 'POST', input)
    : sendJson<Promotion>(`${ADMIN}/promotions/${promotionId}`, 'PUT', input)
}

export async function deletePromotion(promotionId: number): Promise<void> {
  await sendJson<unknown>(`${ADMIN}/promotions/${promotionId}`, 'DELETE')
}

export function listCombos(): Promise<Combo[]> {
  return request<Combo[]>(`${ADMIN}/combos`)
}

export function saveCombo(input: ComboInput, comboId?: number): Promise<Combo> {
  return comboId === undefined
    ? sendJson<Combo>(`${ADMIN}/combos`, 'POST', input)
    : sendJson<Combo>(`${ADMIN}/combos/${comboId}`, 'PUT', input)
}

export async function deleteCombo(comboId: number): Promise<void> {
  await sendJson<unknown>(`${ADMIN}/combos/${comboId}`, 'DELETE')
}
