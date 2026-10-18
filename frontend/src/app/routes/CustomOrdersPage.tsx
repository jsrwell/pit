import { CustomOrders } from '@/features/orders/components/CustomOrders'

export function CustomOrdersPage() {
  return (
    <div className="container page">
      <div className="page-title">
        <span className="eyebrow">Sob medida</span>
        <h1>Encomendas especiais</h1>
        <p>Casamentos, aniversários e eventos: criamos cupcakes exclusivos para a sua data.</p>
      </div>
      <CustomOrders />
    </div>
  )
}
