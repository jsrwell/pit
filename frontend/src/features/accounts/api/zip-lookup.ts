import { requestExternal } from '@/shared/api/http-client'

export const ZIP_DIGITS = 8

export interface ZipAddress {
  street: string
  district: string
}

interface ViaCepResponse {
  logradouro?: string
  bairro?: string
  erro?: boolean | string
}

export function zipDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, ZIP_DIGITS)
}

export function formatZip(value: string): string {
  const digits = zipDigits(value)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export async function lookupZip(zip: string): Promise<ZipAddress | null> {
  const found = await requestExternal<ViaCepResponse>(
    `https://viacep.com.br/ws/${zipDigits(zip)}/json/`,
  )
  if (found.erro !== undefined && found.erro !== false) return null
  return { street: found.logradouro ?? '', district: found.bairro ?? '' }
}
