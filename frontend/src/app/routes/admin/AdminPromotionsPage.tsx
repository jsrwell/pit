import { PromotionsPanel } from '@/features/promotions/components/admin/PromotionsPanel'

export function AdminPromotionsPage() {
  return (
    <section className="stack" aria-labelledby="admin-promotions-heading">
      <h2 id="admin-promotions-heading">Promoções</h2>
      <PromotionsPanel />
    </section>
  )
}
