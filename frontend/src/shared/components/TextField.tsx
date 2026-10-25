import type { InputHTMLAttributes, Ref } from 'react'

import { CharacterCounter } from './CharacterCounter'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  hint?: string
  showCounter?: boolean
  ref?: Ref<HTMLInputElement>
}

export function TextField({
  id,
  label,
  error,
  hint,
  showCounter = false,
  ref,
  ...inputProps
}: TextFieldProps) {
  const { maxLength, value } = inputProps
  const message = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const counter = showCounter && maxLength !== undefined ? `${id}-counter` : undefined
  const describedBy = [message, counter].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {(message !== undefined || counter !== undefined) && (
        <div className="field-footer">
          {error ? (
            <span id={`${id}-error`} className="field-error">
              {error}
            </span>
          ) : (
            hint && (
              <span id={`${id}-hint`} className="field-hint">
                {hint}
              </span>
            )
          )}
          {counter !== undefined && maxLength !== undefined && (
            <CharacterCounter id={counter} value={value} maxLength={maxLength} />
          )}
        </div>
      )}
    </div>
  )
}
