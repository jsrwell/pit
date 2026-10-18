import { render, screen, within } from '@testing-library/react'

import * as promotionsApi from '../api/promotions'
import { ComboShowcase } from './ComboShowcase'

describe('ComboShowcase', () => {
  it('shows running combos with their products, savings and action', async () => {
    vi.spyOn(promotionsApi, 'listRunningCombos').mockResolvedValue([
      {
        id: 1,
        name: 'Dupla gourmet',
        description: '',
        price: '18.00',
        starts_at: '2026-10-01T00:00:00Z',
        ends_at: '2026-12-01T00:00:00Z',
        is_active: true,
        is_running: true,
        items: [
          { product_id: 1, quantity: 1 },
          { product_id: 2, quantity: 1 },
        ],
      },
    ])
    vi.spyOn(promotionsApi, 'listStorefrontProducts').mockResolvedValue([
      { id: 1, name: 'Trufa', price: '10.00', image_id: null, is_featured: false },
      { id: 2, name: 'Pistache', price: '12.00', image_id: null, is_featured: false },
    ])

    render(<ComboShowcase renderAction={(combo) => <button>Levar {combo.name}</button>} />)

    const card = await screen.findByRole('article', { name: 'Dupla gourmet' })
    expect(within(card).getByText('1× Trufa')).toBeInTheDocument()
    expect(within(card).getByText(/22,00/)).toBeInTheDocument()
    expect(within(card).getByText(/18,00/)).toBeInTheDocument()
    expect(within(card).getByRole('button', { name: 'Levar Dupla gourmet' })).toBeInTheDocument()
  })
})
