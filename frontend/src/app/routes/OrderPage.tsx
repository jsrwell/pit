import { Link, useParams } from 'react-router'

import { OrderTracking } from '@/features/orders/components/OrderTracking'

export function OrderPage() {
  const { orderId } = useParams()

  return (
    <div className="container page">
      <div className="page-title">
        <Link to="/pedidos" className="eyebrow">
          Meus pedidos
        </Link>
        <h1>Pedido nº {orderId}</h1>
      </div>
      <OrderTracking orderId={Number(orderId)} />
    </div>
  )
}
