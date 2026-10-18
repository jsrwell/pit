import { env } from '@/shared/config/env'

export function productImageUrl(imageId: number): string {
  return `${env.apiBaseUrl}/catalog/images/${imageId}`
}
