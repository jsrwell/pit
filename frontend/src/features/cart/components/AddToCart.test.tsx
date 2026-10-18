import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { sessionStore } from '@/shared/auth/session-store'
import { renderWithRouter } from '@/test/render-with-router'

import * as cartApi from '../api/cart-requests'
import { cartStore } from '../hooks/cart-store'
import { AddToCart } from './AddToCart'

const cart = { lines: [], item_count: 3, subtotal: '37.50', has_unavailable: false }

describe('AddToCart', () => {
  afterEach(() => {
    sessionStore.clear()
    cartStore.set(null)
  })

  it('adds the chosen quantity and updates the cart', async () => {
    sessionStore.save({
      accessToken: 't',
      expiresAt: '2999-01-01T00:00:00Z',
      account: { id: 1, name: 'Ana', email: 'a@x.com', role: 'customer' },
    })
    const add = vi.spyOn(cartApi, 'addToCart').mockResolvedValue(cart)
    const user = userEvent.setup()

    renderWithRouter(<AddToCart productId={7} productName="Trufa" available withQuantity />)
    await user.click(screen.getByRole('button', { name: 'Aumentar quantidade' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar Trufa ao carrinho' }))

    expect(add).toHaveBeenCalledWith(7, 2)
    expect(await screen.findByText(/Adicionado ao carrinho/)).toBeInTheDocument()
    expect(cartStore.get()?.item_count).toBe(3)
  })

  it('sends visitors to sign in first', async () => {
    const add = vi.spyOn(cartApi, 'addToCart')
    const user = userEvent.setup()

    renderWithRouter(<AddToCart productId={7} productName="Trufa" available />)
    await user.click(screen.getByRole('button', { name: 'Adicionar Trufa ao carrinho' }))

    expect(add).not.toHaveBeenCalled()
    expect(screen.getByText('Outra página')).toBeInTheDocument()
  })

  it('does not offer unavailable products', () => {
    renderWithRouter(<AddToCart productId={7} productName="Trufa" available={false} />)

    expect(screen.getByRole('button', { name: 'Indisponível' })).toBeDisabled()
  })
})
