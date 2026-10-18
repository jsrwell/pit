import { request, sendJson } from '@/shared/api/http-client'

export interface AddressInput {
  label: string
  zip_code: string
  street: string
  number: string
  complement: string
  district: string
  reference: string
  is_primary: boolean
}

export interface Address extends AddressInput {
  id: number
}

const ADDRESSES = '/accounts/me/addresses'

export function listAddresses(): Promise<Address[]> {
  return request<Address[]>(ADDRESSES)
}

export function createAddress(input: AddressInput): Promise<Address> {
  return sendJson<Address>(ADDRESSES, 'POST', input)
}

export function updateAddress(addressId: number, input: AddressInput): Promise<Address> {
  return sendJson<Address>(`${ADDRESSES}/${addressId}`, 'PUT', input)
}

export function makePrimary(addressId: number): Promise<Address> {
  return sendJson<Address>(`${ADDRESSES}/${addressId}/primary`, 'POST')
}

export async function deleteAddress(addressId: number): Promise<void> {
  await sendJson<unknown>(`${ADDRESSES}/${addressId}`, 'DELETE')
}

export function formatAddress(address: Address): string {
  const complement = address.complement ? `, ${address.complement}` : ''
  return `${address.street}, ${address.number}${complement} - ${address.district}, CEP ${address.zip_code}`
}
