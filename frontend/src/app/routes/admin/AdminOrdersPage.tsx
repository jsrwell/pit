import { StoreOrdersBoard } from '@/features/orders/components/admin/StoreOrdersBoard'

export function AdminOrdersPage() {
  return (
    <section className="stack" aria-labelledby="admin-orders-heading">
      <h2 id="admin-orders-heading">Pedidos</h2>
      <StoreOrdersBoard />
    </section>
  )
}
