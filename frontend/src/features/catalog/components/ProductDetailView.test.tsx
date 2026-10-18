import { screen } from '@testing-library/react'

import { renderWithRouter } from '@/test/render-with-router'

import * as getApi from '../api/get-product'
import type { ProductDetail } from '../api/product'
import { ProductDetailView } from './ProductDetailView'

const product: ProductDetail = {
  id: 4,
  name: 'Pistache e Rosas',
  price: '21.90',
  promotional_price: null,
  image_id: 2,
  category: { id: 1, name: 'Gourmet' },
  flavor: { id: 2, name: 'Pistache' },
  is_available: true,
  is_featured: false,
  description: 'Massa amanteigada de pistache.',
  composition: 'Farinha, pistache, manteiga.',
  highlights: ['Pistache de Bronte', 'Pétalas comestíveis'],
}

describe('ProductDetailView', () => {
  it('shows description, price, image, composition, highlights and the purchase action', async () => {
    vi.spyOn(getApi, 'getProduct').mockResolvedValue(product)

    renderWithRouter(
      <ProductDetailView productId={4} renderPurchase={() => <button>Comprar</button>} />,
    )

    expect(await screen.findByRole('heading', { name: 'Pistache e Rosas' })).toBeInTheDocument()
    expect(screen.getByText(/21,90/)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Pistache e Rosas' })).toBeInTheDocument()
    expect(screen.getByText('Farinha, pistache, manteiga.')).toBeInTheDocument()
    expect(screen.getByText('Pétalas comestíveis')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Comprar' })).toBeInTheDocument()
  })

  it('clearly flags an unavailable product', async () => {
    vi.spyOn(getApi, 'getProduct').mockResolvedValue({ ...product, is_available: false })

    renderWithRouter(<ProductDetailView productId={4} />)

    expect(await screen.findByRole('note')).toHaveTextContent('indisponível')
  })
})
