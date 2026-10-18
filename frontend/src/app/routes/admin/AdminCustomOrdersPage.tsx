import { CustomOrderReviewBoard } from '@/features/orders/components/admin/CustomOrderReviewBoard'

export function AdminCustomOrdersPage() {
  return (
    <section className="stack" aria-labelledby="admin-custom-heading">
      <h2 id="admin-custom-heading">Encomendas especiais</h2>
      <CustomOrderReviewBoard />
    </section>
  )
}
