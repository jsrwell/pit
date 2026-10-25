import type { FieldErrors } from '@/shared/api/field-errors'
import { isValidPhone } from '@/shared/format/phone'

export const ACCOUNT_LIMITS = { name: 100, email: 254, password: 72, phoneMask: 15 } as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ContactFields {
  name: string
  email: string
  phone: string
}

export function validateContact({ name, email, phone }: ContactFields): FieldErrors {
  const errors: FieldErrors = {}
  if (name.trim().length < 2) errors.name = 'Informe seu nome completo.'
  if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Informe um e-mail válido, como nome@exemplo.com.'
  }
  if (!isValidPhone(phone)) errors.phone = 'Informe o telefone com DDD, como (11) 98765-4321.'
  return errors
}

export function validatePassword(password: string): string | undefined {
  return password === '' ? 'Informe uma senha.' : undefined
}
