import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { ApiError } from '@/shared/api/api-error'
import { useSession } from '@/shared/auth/use-session'

import type { Cart } from '../api/cart'
import { addToCart } from '../api/cart-requests'
import { cartStore } from '../hooks/cart-store'

import './cart.css'

interface BundleItem {
  product_id: number
  quantity: number
}

interface AddBundleToCartProps {
  name: string
  items: BundleItem[]
}

export function AddBundleToCart({ name, items }: AddBundleToCartProps) {
  const session = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [busy, setBusy] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd() {
    if (session === null) {
      navigate('/entrar', { state: { from: location.pathname } })
      return
    }
    setBusy(true)
    setError(null)
    try {
      let cart: Cart | null = null
      for (const item of items) {
        cart = await addToCart(item.product_id, item.quantity)
      }
      cartStore.set(cart)
      setAdded(true)
    } catch (caught: unknown) {
      setError(ApiError.from(caught).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="add-to-cart">
      <button
        type="button"
        className="button button--small"
        disabled={busy}
        onClick={handleAdd}
        aria-label={`Adicionar combo ${name} ao carrinho`}
      >
        {busy ? 'Adicionando...' : 'Adicionar combo'}
      </button>
      {added && (
        <p role="status" className="add-to-cart__feedback">
          Combo no carrinho. <Link to="/carrinho">Ver carrinho</Link>
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
