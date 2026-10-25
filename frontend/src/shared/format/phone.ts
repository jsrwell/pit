export const PHONE_MAX_DIGITS = 11

export function phoneDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, PHONE_MAX_DIGITS)
}

export function formatPhone(value: string): string {
  const digits = phoneDigits(value)
  if (digits.length <= 2) return digits.length === 0 ? '' : `(${digits}`
  const area = digits.slice(0, 2)
  const number = digits.slice(2)
  const splitAt = number.length > 8 ? 5 : 4
  if (number.length <= splitAt) return `(${area}) ${number}`
  return `(${area}) ${number.slice(0, splitAt)}-${number.slice(splitAt)}`
}

export function isValidPhone(value: string): boolean {
  return /^[1-9]{2}(9\d{8}|[2-8]\d{7})$/.test(phoneDigits(value))
}

export function nextPhoneDigits(previousDigits: string, typed: string): string {
  const digits = phoneDigits(typed)
  const erasedOnlyMask =
    typed.length < formatPhone(previousDigits).length && digits === previousDigits
  return erasedOnlyMask ? digits.slice(0, -1) : digits
}
