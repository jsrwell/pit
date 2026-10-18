import { NavLink } from 'react-router'

import { useCart } from '../hooks/cart-store'
import { useCartSync } from '../hooks/use-cart-sync'

export function CartNavLink() {
  useCartSync()
  const cart = useCart()
  const count = cart?.item_count ?? 0

  return (
    <NavLink to="/carrinho" aria-label={`Carrinho com ${count} itens`}>
      Carrinho
      {count > 0 && (
        <span className="site-nav__count" aria-hidden="true">
          {count}
        </span>
      )}
    </NavLink>
  )
}
