import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextAreaField } from '@/shared/components/TextAreaField'
import { formatPrice } from '@/shared/format/currency'
import { useAsync } from '@/shared/hooks/use-async'
import { useSubmit } from '@/shared/hooks/use-submit'

import type { Order, PaymentMethod } from '../api/order'
import { placeOrder, type CardInput } from '../api/place-order'
import { quoteOrder, type FulfillmentMethod } from '../api/quote'
import { CouponField } from './CouponField'
import { FulfillmentSelector } from './FulfillmentSelector'
import { OrderSummary } from './OrderSummary'
import { PaymentSelector, type CardFields } from './PaymentSelector'

export interface AddressSlotProps {
  selectedId: number | null
  onSelect: (addressId: number | null) => void
}

interface CheckoutViewProps {
  renderAddressPicker: (props: AddressSlotProps) => ReactNode
  onPlaced?: (order: Order) => void
}

const COUPON_NOT_APPLICABLE = 'CS-PRM-0007'

interface AppliedCoupon {
  code: string
  discount: string
}

const EMPTY_CARD: CardFields = { number: '', holder_name: '', expiry: '', cvv: '' }

function toCardInput(card: CardFields): CardInput {
  const [month = '', year = ''] = card.expiry.split('/')
  return {
    number: card.number,
    holder_name: card.holder_name,
    expiry_month: Number(month),
    expiry_year: 2000 + Number(year.slice(-2)),
    cvv: card.cvv,
  }
}

export function CheckoutView({ renderAddressPicker, onPlaced }: CheckoutViewProps) {
  const [method, setMethod] = useState<FulfillmentMethod>('pickup')
  const [addressId, setAddressId] = useState<number | null>(null)
  const [payment, setPayment] = useState<PaymentMethod>('pix')
  const [card, setCard] = useState<CardFields>(EMPTY_CARD)
  const [notes, setNotes] = useState('')
  const [placed, setPlaced] = useState<Order | null>(null)
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null)
  const [couponNotice, setCouponNotice] = useState<string | null>(null)
  const needsAddress = method === 'delivery' && addressId === null
  const couponCode = coupon?.code ?? null
  const quoteFor = useCallback(
    (code: string | null) =>
      quoteOrder({
        fulfillment_method: needsAddress ? 'pickup' : method,
        address_id: method === 'delivery' ? addressId : null,
        coupon_code: code,
      }),
    [method, addressId, needsAddress],
  )
  const load = useCallback(() => quoteFor(couponCode), [quoteFor, couponCode])
  const { state } = useAsync(load)
  const confirm = useSubmit(placeOrder)

  useEffect(() => {
    if (state.status === 'error' && state.error.code === COUPON_NOT_APPLICABLE) {
      setCoupon(null)
      setCouponNotice(state.error.message)
    }
  }, [state])

  async function applyCoupon(code: string) {
    const priced = await quoteFor(code)
    setCouponNotice(null)
    setCoupon({ code: priced.coupon_code ?? code, discount: priced.coupon_discount })
  }

  async function handleConfirm() {
    const order = await confirm.submit({
      fulfillment_method: method,
      address_id: method === 'delivery' ? addressId : null,
      payment_method: payment,
      card: payment === 'credit_card' ? toCardInput(card) : null,
      notes,
      coupon_code: couponCode,
    })
    if (order !== null) {
      setPlaced(order)
      onPlaced?.(order)
    }
  }

  if (placed !== null) {
    return <OrderPlaced order={placed} />
  }

  return (
    <div className="two-column">
      <div className="stack stack--loose">
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
        <section className="panel stack" aria-label="Pagamento">
          <PaymentSelector
            method={payment}
            card={card}
            errors={confirm.fields}
            onMethod={setPayment}
            onCard={setCard}
          />
          <TextAreaField
            id="order-notes"
            label="Observações do pedido"
            placeholder="Mensagem para cartão, preferências de entrega..."
            maxLength={500}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <CouponField
            applied={coupon}
            notice={couponNotice}
            onApply={applyCoupon}
            onRemove={() => setCoupon(null)}
          />
        </section>
      </div>
      <AsyncContent state={state} loadingLabel="Calculando o total...">
        {(quote) => (
          <OrderSummary
            lines={quote.lines}
            subtotal={quote.subtotal}
            discount={quote.discount}
            couponCode={quote.coupon_code}
            couponDiscount={quote.coupon_discount}
            deliveryFee={quote.delivery_fee}
            total={quote.total}
          >
            {needsAddress && (
              <p className="field-hint">Escolha um endereço para calcular a entrega.</p>
            )}
            {confirm.error && <ErrorMessage message={confirm.error} />}
            <button
              type="button"
              className="button"
              disabled={needsAddress || confirm.submitting}
              onClick={handleConfirm}
            >
              {confirm.submitting ? 'Confirmando...' : 'Confirmar pedido'}
            </button>
          </OrderSummary>
        )}
      </AsyncContent>
    </div>
  )
}

function OrderPlaced({ order }: { order: Order }) {
  return (
    <section className="panel empty-state" role="status" aria-label="Pedido confirmado">
      <span className="eyebrow">Pedido confirmado</span>
      <h2>Obrigado! Seu pedido nº {order.id} foi recebido</h2>
      <p>
        Total de {formatPrice(order.total)}.{' '}
        {order.payment_status === 'approved'
          ? 'Pagamento aprovado.'
          : 'Pagamento na retirada ou entrega.'}
      </p>
      <Link to={`/pedidos/${order.id}`} className="button">
        Acompanhar pedido
      </Link>
    </section>
  )
}
