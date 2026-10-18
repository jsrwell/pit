import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithRouter } from '@/test/render-with-router'

import type { Order } from '../api/order'
import * as placeApi from '../api/place-order'
import * as quoteApi from '../api/quote'
import { CheckoutView } from './CheckoutView'

const line = {
  product_id: 1,
  name: 'Trufa',
  image_id: null,
  unit_price: '10.00',
  quantity: 2,
  line_total: '20.00',
}
const pickup: quoteApi.Quote = {
  lines: [line],
  fulfillment_method: 'pickup',
  address: null,
  subtotal: '20.00',
  delivery_fee: '0.00',
  total: '20.00',
  pickup_address: 'Rua das Confeitarias, 100',
}

describe('CheckoutView', () => {
  it('shows pickup without fee and adapts to delivery with fee and address', async () => {
    const quote = vi
      .spyOn(quoteApi, 'quoteOrder')
      .mockImplementation(async (input) =>
        input.fulfillment_method === 'delivery'
          ? { ...pickup, fulfillment_method: 'delivery', delivery_fee: '12.00', total: '32.00' }
          : pickup,
      )
    const user = userEvent.setup()

    renderWithRouter(
      <CheckoutView
        renderAddressPicker={({ onSelect }) => (
          <button type="button" onClick={() => onSelect(5)}>
            Escolher endereço
          </button>
        )}
      />,
    )

    expect(await screen.findByTestId('delivery-fee')).toHaveTextContent('Grátis')
    expect(screen.getByText(/Rua das Confeitarias/)).toBeInTheDocument()

    await user.click(screen.getByLabelText(/Entrega/))
    await user.click(screen.getByRole('button', { name: 'Escolher endereço' }))

    expect(quote).toHaveBeenLastCalledWith({ fulfillment_method: 'delivery', address_id: 5 })
    expect(await screen.findByText(/32,00/)).toBeInTheDocument()
  })

  it('pays by card and confirms the order', async () => {
    vi.spyOn(quoteApi, 'quoteOrder').mockResolvedValue(pickup)
    const order: Order = {
      id: 42,
      status: 'received',
      fulfillment_method: 'pickup',
      delivery_address: null,
      delivery_reference: null,
      payment_method: 'credit_card',
      payment_status: 'approved',
      payment_reference: 'CARD-****1111',
      subtotal: '20.00',
      delivery_fee: '0.00',
      total: '20.00',
      notes: '',
      created_at: '2026-10-18T12:00:00Z',
      updated_at: '2026-10-18T12:00:00Z',
      items: [],
      history: [],
    }
    const place = vi.spyOn(placeApi, 'placeOrder').mockResolvedValue(order)
    const onPlaced = vi.fn()
    const user = userEvent.setup()

    renderWithRouter(<CheckoutView renderAddressPicker={() => null} onPlaced={onPlaced} />)
    await user.click(await screen.findByLabelText(/Cartão de crédito/))
    await user.type(screen.getByLabelText('Número do cartão'), '4111111111111111')
    await user.type(screen.getByLabelText('Nome impresso no cartão'), 'ANA SOUZA')
    await user.type(screen.getByLabelText('Validade (MM/AA)'), '12/29')
    await user.type(screen.getByLabelText('CVV'), '123')
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(place).toHaveBeenCalledWith({
      fulfillment_method: 'pickup',
      address_id: null,
      payment_method: 'credit_card',
      card: {
        number: '4111111111111111',
        holder_name: 'ANA SOUZA',
        expiry_month: 12,
        expiry_year: 2029,
        cvv: '123',
      },
      notes: '',
    })
    expect(await screen.findByText(/pedido nº 42/)).toBeInTheDocument()
    expect(onPlaced).toHaveBeenCalledWith(order)
  })
})
