import { useState, type FormEvent } from 'react'

import { formatPrice } from '@/shared/format/currency'
import { useSubmit } from '@/shared/hooks/use-submit'

const COUPON_CODE_MAX_LENGTH = 30

interface CouponFieldProps {
  applied: { code: string; discount: string } | null
  onApply: (code: string) => Promise<unknown>
  onRemove: () => void
  notice?: string | null
}

export function CouponField({ applied, onApply, onRemove, notice }: CouponFieldProps) {
  const [typed, setTyped] = useState('')
  const { submit, submitting, error } = useSubmit(onApply)
  const message = error ?? notice ?? null

  async function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const code = typed.trim()
    if (code === '') return
    if ((await submit(code)) !== null) setTyped('')
  }

  if (applied !== null) {
    return (
      <div className="coupon-field coupon-field--applied" role="status">
        <span>
          Cupom <code className="coupon-code">{applied.code}</code> aplicado:{' '}
          <strong>− {formatPrice(applied.discount)}</strong>
        </span>
        <button type="button" className="link-button" onClick={onRemove}>
          Remover cupom
        </button>
      </div>
    )
  }

  return (
    <form className="coupon-field" onSubmit={handleApply} noValidate aria-label="Aplicar cupom">
      <div className="field">
        <label htmlFor="coupon-code">Cupom de desconto</label>
        <div className="coupon-field__row">
          <input
            id="coupon-code"
            placeholder="Digite o código"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={COUPON_CODE_MAX_LENGTH}
            value={typed}
            aria-invalid={message ? true : undefined}
            aria-describedby={message ? 'coupon-code-error' : undefined}
            onChange={(event) => setTyped(event.target.value.toUpperCase())}
          />
          <button
            type="submit"
            className="button button--ghost"
            disabled={submitting || typed.trim() === ''}
          >
            {submitting ? 'Validando...' : 'Aplicar'}
          </button>
        </div>
        {message && (
          <span id="coupon-code-error" className="field-error" role="alert">
            {message}
          </span>
        )}
      </div>
    </form>
  )
}
