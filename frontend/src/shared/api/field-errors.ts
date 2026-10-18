import type { ApiError } from './api-error'

const FIELD_MESSAGES: Record<string, string> = {
  missing: 'Campo obrigatório.',
  string_too_short: 'Valor muito curto.',
  string_too_long: 'Valor muito longo.',
  string_pattern_mismatch: 'Formato inválido.',
  value_error: 'Valor inválido.',
  greater_than_equal: 'Valor abaixo do mínimo permitido.',
  greater_than: 'Valor abaixo do mínimo permitido.',
  less_than_equal: 'Valor acima do máximo permitido.',
}

const DEFAULT_FIELD_MESSAGE = 'Valor inválido.'

export type FieldErrors = Record<string, string>

export function fieldErrors(error: ApiError): FieldErrors {
  const errors: FieldErrors = {}
  for (const entry of error.problem.errors ?? []) {
    const field = entry.pointer.split('/').filter(Boolean).slice(1).join('.')
    if (field !== '' && errors[field] === undefined) {
      errors[field] = FIELD_MESSAGES[entry.code] ?? DEFAULT_FIELD_MESSAGE
    }
  }
  return errors
}
