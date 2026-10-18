export interface InvalidField {
  pointer: string
  code: string
  detail: string
}

export interface ProblemDetails {
  type: string
  title: string
  status: number
  code: string
  detail?: string
  instance?: string
  errors?: InvalidField[]
}

export function isProblemDetails(value: unknown): value is ProblemDetails {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return typeof candidate.code === 'string' && typeof candidate.status === 'number'
}
