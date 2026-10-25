import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithRouter } from '@/test/render-with-router'

import * as listApi from '../api/list-products'
import type { ProductSummary } from '../api/product'
import { favoritesStore } from '../hooks/favorites-store'
import { Storefront } from './Storefront'

const sampleProduct: ProductSummary = {
  id: 1,
  name: 'Red Velvet Imperial',
  price: '16.90',
  promotional_price: null,
  image_id: 7,
  category: { id: 1, name: 'Clássicos' },
  flavor: { id: 1, name: 'Red Velvet' },
  is_available: true,
  is_featured: false,
}

describe('Storefront', () => {
  afterEach(() => favoritesStore.clear())

  it('shows each product with name, image, price and a link to its detail', async () => {
    vi.spyOn(listApi, 'listProducts').mockResolvedValue([sampleProduct])

    renderWithRouter(<Storefront />)

    const card = await screen.findByRole('article', { name: 'Red Velvet Imperial' })
    expect(within(card).getByText(/16,90/)).toBeInTheDocument()
    expect(within(card).getByRole('img', { name: 'Red Velvet Imperial' })).toBeInTheDocument()
    for (const link of within(card).getAllByRole('link', { name: 'Red Velvet Imperial' })) {
      expect(link).toHaveAttribute('href', '/produtos/1')
    }
  })

  it('flags unavailable products and highlights featured ones', async () => {
    vi.spyOn(listApi, 'listProducts').mockResolvedValue([
      { ...sampleProduct, is_available: false },
      { ...sampleProduct, id: 2, name: 'Trufa de Ouro', is_featured: true },
    ])

    renderWithRouter(<Storefront />)

    expect(await screen.findByText('Indisponível')).toBeInTheDocument()
    const featured = screen.getByRole('region', { name: 'Destaques' })
    expect(within(featured).getByText('Trufa de Ouro')).toBeInTheDocument()
  })

  it('marks a cupcake as favorite and shows only favorites on request', async () => {
    vi.spyOn(listApi, 'listProducts').mockResolvedValue([
      sampleProduct,
      { ...sampleProduct, id: 2, name: 'Trufa de Ouro' },
    ])
    const user = userEvent.setup()

    renderWithRouter(<Storefront />)
    const card = await screen.findByRole('article', { name: 'Red Velvet Imperial' })
    await user.click(within(card).getByRole('button', { name: /Adicionar aos favoritos/ }))

    expect(within(card).getByRole('button', { name: /Remover dos favoritos/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(screen.getByRole('button', { name: /^Favoritos/ }))
    expect(screen.getByRole('article', { name: 'Red Velvet Imperial' })).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Trufa de Ouro' })).not.toBeInTheDocument()
  })

  it('explains how to add favorites when none is marked', async () => {
    vi.spyOn(listApi, 'listProducts').mockResolvedValue([sampleProduct])
    const user = userEvent.setup()

    renderWithRouter(<Storefront />)
    await screen.findByRole('article', { name: 'Red Velvet Imperial' })
    await user.click(screen.getByRole('button', { name: /^Favoritos/ }))

    expect(screen.getByText(/ainda não tem favoritos/)).toBeInTheDocument()
  })
})
