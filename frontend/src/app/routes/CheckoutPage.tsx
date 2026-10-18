import { AddressPicker } from '@/features/accounts/components/AddressPicker'
import { CheckoutView } from '@/features/orders/components/CheckoutView'

export function CheckoutPage() {
  return (
    <div className="container page">
      <div className="page-title">
        <span className="eyebrow">Finalizar pedido</span>
        <h1>Checkout</h1>
      </div>
      <CheckoutView
        renderAddressPicker={({ selectedId, onSelect }) => (
          <AddressPicker selectedId={selectedId} onSelect={onSelect} />
        )}
      />
    </div>
  )
}
