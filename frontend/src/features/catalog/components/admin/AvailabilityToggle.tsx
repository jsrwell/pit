import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { useSubmit } from '@/shared/hooks/use-submit'

import { setAvailability, type AdminProduct } from '../../api/admin-products'

interface AvailabilityToggleProps {
  product: AdminProduct
  onChanged: () => void
}

export function AvailabilityToggle({ product, onChanged }: AvailabilityToggleProps) {
  const { submit, submitting, error } = useSubmit(setAvailability)

  async function toggle() {
    const updated = await submit(product.id, {
      is_available: !product.is_available,
      show_when_unavailable: product.show_when_unavailable,
    })
    if (updated !== null) onChanged()
  }

  return (
    <div className="stack">
      <button
        type="button"
        className={
          product.is_available ? 'button button--danger button--small' : 'button button--small'
        }
        disabled={submitting}
        onClick={toggle}
        aria-label={
          product.is_available
            ? `Marcar ${product.name} como indisponível`
            : `Marcar ${product.name} como disponível`
        }
      >
        {product.is_available ? 'Marcar indisponível' : 'Marcar disponível'}
      </button>
      {error && <ErrorMessage message={error} />}
    </div>
  )
}
