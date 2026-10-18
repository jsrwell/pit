import { useEffect } from 'react'

import { useSession } from '@/shared/auth/use-session'

import { cartStore } from './cart-store'

export function useCartSync(): void {
  const session = useSession()
  const userId = session?.account.id ?? null

  useEffect(() => {
    if (userId === null) {
      cartStore.set(null)
      return
    }
    cartStore.refresh().catch(() => cartStore.set(null))
  }, [userId])
}
