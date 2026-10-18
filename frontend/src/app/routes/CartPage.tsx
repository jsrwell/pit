import { CartView } from '@/features/cart/components/CartView'

export function CartPage() {
  return (
    <div className="container page">
      <div className="page-title">
        <span className="eyebrow">Seu pedido</span>
        <h1>Carrinho</h1>
      </div>
      <CartView />
    </div>
  )
}
