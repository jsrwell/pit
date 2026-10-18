import { request } from '@/shared/api/http-client'

import type { NamedItem } from './product'

export function listCategories(): Promise<NamedItem[]> {
  return request<NamedItem[]>('/catalog/categories')
}

export function listFlavors(): Promise<NamedItem[]> {
  return request<NamedItem[]>('/catalog/flavors')
}
