interface CharacterCounterProps {
  id: string
  value: unknown
  maxLength: number
}

const NEAR_LIMIT_RATIO = 0.1

export function CharacterCounter({ id, value, maxLength }: CharacterCounterProps) {
  const length = typeof value === 'string' ? value.length : 0
  const remaining = Math.max(maxLength - length, 0)
  const nearLimit = remaining <= Math.ceil(maxLength * NEAR_LIMIT_RATIO)
  const label = remaining === 1 ? '1 caractere restante' : `${remaining} caracteres restantes`

  return (
    <span id={id} className={nearLimit ? 'field-counter field-counter--near' : 'field-counter'}>
      {label}
    </span>
  )
}
