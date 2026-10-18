import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithRouter } from '@/test/render-with-router'

import type { Cart } from '../api/cart'
import * as cartApi from '../api/cart-requests'
import { cartStore } from '../hooks/cart-store'
import { CartView } from './CartView'

const line = {
  product_id: 3,
  name: 'Red Velvet',
  image_id: null,
  unit_price: '10.00',
  quantity: 2,
  line_total: '20.00',
  is_available: true,
}
const cart: Cart = { lines: [line], item_count: 2, subtotal: '20.00', has_unavailable: false }

describe('CartView', () => {
  afterEach(() => cartStore.set(null))

  it('changes the quantity and shows the recalculated subtotal', async () => {
    vi.spyOn(cartApi, 'getCart').mockResolvedValue(cart)
    const change = vi.spyOn(cartApi, 'changeQuantity').mockResolvedValue({
      lines: [{ ...line, quantity: 3, line_total: '30.00' }],
      item_count: 3,
      subtotal: '30.00',
      has_unavailable: false,
    })
    const user = userEvent.setup()

    renderWithRouter(<CartView />)
    const item = await screen.findByRole('listitem')
    await user.click(within(item).getByRole('button', { name: 'Aumentar quantidade' }))

    expect(change).toHaveBeenCalledWith(3, 3)
    expect(await screen.findByTestId('cart-subtotal')).toHaveTextContent('30,00')
  })

  it('removes an item', async () => {
    vi.spyOn(cartApi, 'getCart').mockResolvedValue(cart)
    const remove = vi.spyOn(cartApi, 'removeFromCart').mockResolvedValue({
      lines: [],
      item_count: 0,
      subtotal: '0.00',
      has_unavailable: false,
    })
    const user = userEvent.setup()

    renderWithRouter(<CartView />)
    await user.click(await screen.findByRole('button', { name: 'Remover' }))

    expect(remove).toHaveBeenCalledWith(3)
    expect(await screen.findByText('Nenhum cupcake por aqui ainda')).toBeInTheDocument()
  })

  it('blocks checkout while an item is unavailable', async () => {
    vi.spyOn(cartApi, 'getCart').mockResolvedValue({
      ...cart,
      lines: [{ ...line, is_available: false }],
      has_unavailable: true,
    })

    renderWithRouter(<CartView />)

    expect(await screen.findByRole('note')).toHaveTextContent('indisponíveis')
    expect(screen.getByRole('button', { name: 'Continuar para o pedido' })).toBeDisabled()
  })
})
