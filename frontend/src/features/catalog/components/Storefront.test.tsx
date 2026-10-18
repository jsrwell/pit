import { screen, within } from '@testing-library/react'

import { renderWithRouter } from '@/test/render-with-router'

import * as listApi from '../api/list-products'
import type { ProductSummary } from '../api/product'
import { Storefront } from './Storefront'

const sampleProduct: ProductSummary = {
  id: 1,
  name: 'Red Velvet Imperial',
  price: '16.90',
  image_id: 7,
  category: { id: 1, name: 'Clássicos' },
  flavor: { id: 1, name: 'Red Velvet' },
  is_available: true,
  is_featured: false,
}

describe('Storefront', () => {
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
})
