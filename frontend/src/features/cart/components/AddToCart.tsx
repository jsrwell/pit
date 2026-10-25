import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { useSession } from '@/shared/auth/use-session'
import { QuantityStepper } from '@/shared/components/QuantityStepper'
import { useSubmit } from '@/shared/hooks/use-submit'

import { addToCart } from '../api/cart-requests'
import { cartStore } from '../hooks/cart-store'

import './cart.css'

interface AddToCartProps {
  productId: number
  productName: string
  available: boolean
  withQuantity?: boolean
}

export function AddToCart({
  productId,
  productName,
  available,
  withQuantity = false,
}: AddToCartProps) {
  const session = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { submit, submitting, error } = useSubmit(addToCart)

  if (!available) {
    return (
      <button type="button" className="button button--small add-to-cart__button" disabled>
        Indisponível
      </button>
    )
  }

  async function handleAdd() {
    if (session === null) {
      navigate('/entrar', { state: { from: location.pathname } })
      return
    }
    setAdded(false)
    const cart = await submit(productId, quantity)
    if (cart !== null) {
      cartStore.set(cart)
      setAdded(true)
    }
  }

  return (
    <div className={withQuantity ? 'add-to-cart add-to-cart--full' : 'add-to-cart'}>
      <div className="row">
        {withQuantity && (
          <QuantityStepper
            label={`Quantidade de ${productName}`}
            value={quantity}
            onChange={setQuantity}
          />
        )}
        <button
          type="button"
          className={
            withQuantity ? 'button add-to-cart__button' : 'button button--small add-to-cart__button'
          }
          disabled={submitting}
          onClick={handleAdd}
          aria-label={`Adicionar ${productName} ao carrinho`}
        >
          {submitting ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
      {added && (
        <p role="status" className="add-to-cart__feedback">
          Adicionado ao carrinho. <Link to="/carrinho">Ver carrinho</Link>
        </p>
      )}
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}
