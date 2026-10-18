import { useCallback, useState, type ReactNode } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { useAsync } from '@/shared/hooks/use-async'

import { quoteOrder, type FulfillmentMethod } from '../api/quote'
import { FulfillmentSelector } from './FulfillmentSelector'
import { OrderSummary } from './OrderSummary'

export interface AddressSlotProps {
  selectedId: number | null
  onSelect: (addressId: number | null) => void
}

interface CheckoutViewProps {
  renderAddressPicker: (props: AddressSlotProps) => ReactNode
}

export function CheckoutView({ renderAddressPicker }: CheckoutViewProps) {
  const [method, setMethod] = useState<FulfillmentMethod>('pickup')
  const [addressId, setAddressId] = useState<number | null>(null)
  const needsAddress = method === 'delivery' && addressId === null
  const load = useCallback(
    () =>
      quoteOrder({
        fulfillment_method: needsAddress ? 'pickup' : method,
        address_id: method === 'delivery' ? addressId : null,
      }),
    [method, addressId, needsAddress],
  )
  const { state } = useAsync(load)

  return (
    <div className="checkout">
      <div className="checkout__steps">
        <section className="panel stack" aria-label="Modalidade de recebimento">
          <FulfillmentSelector value={method} onChange={setMethod} />
          {method === 'pickup' && state.status === 'success' && (
            <p className="feedback feedback--info">
              Endereço para retirada: {state.data.pickup_address}
            </p>
          )}
          {method === 'delivery' && (
            <div className="stack">
              <h3>Endereço de entrega</h3>
              {renderAddressPicker({ selectedId: addressId, onSelect: setAddressId })}
            </div>
          )}
        </section>
      </div>
      <AsyncContent state={state} loadingLabel="Calculando o total...">
        {(quote) => (
          <OrderSummary
            lines={quote.lines}
            subtotal={quote.subtotal}
            deliveryFee={quote.delivery_fee}
            total={quote.total}
          >
            {needsAddress && (
              <p className="field-hint">Escolha um endereço para calcular a entrega.</p>
            )}
          </OrderSummary>
        )}
      </AsyncContent>
    </div>
  )
}
