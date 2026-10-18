import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { ApiError } from '@/shared/api/api-error'
import { productImageUrl } from '@/shared/api/product-image-url'
import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { QuantityStepper } from '@/shared/components/QuantityStepper'
import { formatPrice } from '@/shared/format/currency'

import type { Cart, CartLine } from '../api/cart'
import { changeQuantity, removeFromCart } from '../api/cart-requests'
import { cartStore, useCart } from '../hooks/cart-store'

import './cart.css'

export function CartView() {
  const cart = useCart()
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busyProduct, setBusyProduct] = useState<number | null>(null)

  useEffect(() => {
    cartStore.refresh().catch((error: unknown) => setLoadError(ApiError.from(error).message))
  }, [])

  async function run(productId: number, action: () => Promise<Cart>) {
    setBusyProduct(productId)
    setActionError(null)
    try {
      cartStore.set(await action())
    } catch (error: unknown) {
      setActionError(ApiError.from(error).message)
    } finally {
      setBusyProduct(null)
    }
  }

  if (loadError) return <ErrorMessage message={loadError} />
  if (cart === null) {
    return (
      <p role="status" className="muted">
        Carregando o carrinho...
      </p>
    )
  }
  if (cart.lines.length === 0) {
    return (
      <div className="empty-state panel">
        <span className="eyebrow">Carrinho vazio</span>
        <h2>Nenhum cupcake por aqui ainda</h2>
        <Link to="/" className="button">
          Explorar a vitrine
        </Link>
      </div>
    )
  }

  return (
    <div className="cart">
      <div className="stack">
        {actionError && <ErrorMessage message={actionError} />}
        {cart.has_unavailable && (
          <p className="feedback feedback--error" role="note">
            Alguns itens ficaram indisponíveis e não entram no total. Remova-os para continuar.
          </p>
        )}
        <ul className="cart__lines" aria-label="Itens do carrinho">
          {cart.lines.map((line) => (
            <CartLineItem
              key={line.product_id}
              line={line}
              busy={busyProduct === line.product_id}
              onQuantity={(quantity) =>
                run(line.product_id, () => changeQuantity(line.product_id, quantity))
              }
              onRemove={() => run(line.product_id, () => removeFromCart(line.product_id))}
            />
          ))}
        </ul>
      </div>
      <aside className="panel summary" aria-label="Resumo do carrinho">
        <h2>Resumo</h2>
        <div className="summary__row">
          <span>Itens</span>
          <span>{cart.item_count}</span>
        </div>
        <div className="summary__row summary__total">
          <span>Subtotal</span>
          <span data-testid="cart-subtotal">{formatPrice(cart.subtotal)}</span>
        </div>
        <p className="field-hint">Modalidade de recebimento e pagamento na próxima etapa.</p>
        {cart.has_unavailable ? (
          <button type="button" className="button" disabled>
            Continuar para o pedido
          </button>
        ) : (
          <Link to="/checkout" className="button">
            Continuar para o pedido
          </Link>
        )}
      </aside>
    </div>
  )
}

interface CartLineItemProps {
  line: CartLine
  busy: boolean
  onQuantity: (quantity: number) => void
  onRemove: () => void
}

function CartLineItem({ line, busy, onQuantity, onRemove }: CartLineItemProps) {
  return (
    <li className={line.is_available ? 'cart-line' : 'cart-line cart-line--unavailable'}>
      {line.image_id === null ? (
        <div className="cart-line__image" aria-hidden="true" />
      ) : (
        <img className="cart-line__image" src={productImageUrl(line.image_id)} alt={line.name} />
      )}
      <div className="cart-line__info">
        <h3>{line.name}</h3>
        <span className="muted">{formatPrice(line.unit_price)} cada</span>
        {line.is_available ? (
          <strong>{formatPrice(line.line_total)}</strong>
        ) : (
          <span className="badge badge--muted">Indisponível</span>
        )}
      </div>
      <div className="cart-line__controls">
        <QuantityStepper
          label={`Quantidade de ${line.name}`}
          value={line.quantity}
          disabled={busy}
          max={line.is_available ? 50 : line.quantity}
          onChange={onQuantity}
        />
        <button type="button" className="link-button" disabled={busy} onClick={onRemove}>
          Remover
        </button>
      </div>
    </li>
  )
}
