import { MyOrders } from '@/features/orders/components/MyOrders'

export function OrdersPage() {
  return (
    <div className="container page">
      <div className="page-title">
        <span className="eyebrow">Minha conta</span>
        <h1>Meus pedidos</h1>
      </div>
      <MyOrders />
    </div>
  )
}
