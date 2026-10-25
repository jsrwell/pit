import type { TextareaHTMLAttributes } from 'react'

import { CharacterCounter } from './CharacterCounter'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  error?: string
  hint?: string
}

export function TextAreaField({ id, label, error, hint, ...textareaProps }: TextAreaFieldProps) {
  const { maxLength, value } = textareaProps
  const message = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const counter = maxLength === undefined ? undefined : `${id}-counter`
  const describedBy = [message, counter].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...textareaProps}
      />
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
    </div>
  )
}
