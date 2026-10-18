import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithRouter } from '@/test/render-with-router'

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
})
