import { useSyncExternalStore } from 'react'

import type { Cart } from '../api/cart'
import { getCart } from '../api/cart-requests'

type Listener = () => void

const listeners = new Set<Listener>()
let current: Cart | null = null

export const cartStore = {
  get(): Cart | null {
    return current
  },
  set(cart: Cart | null): void {
    current = cart
    listeners.forEach((listener) => listener())
  },
  async refresh(): Promise<Cart> {
    const cart = await getCart()
    cartStore.set(cart)
    return cart
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useCart(): Cart | null {
  return useSyncExternalStore(cartStore.subscribe, cartStore.get)
}
