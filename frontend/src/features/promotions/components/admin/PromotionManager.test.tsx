import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as promotionsApi from '../../api/promotions'
import { PromotionManager } from './PromotionManager'

const products: promotionsApi.ProductOption[] = [
  { id: 4, name: 'Trufa de Ouro', price: '24.90', image_id: null, is_featured: true },
]

describe('PromotionManager', () => {
  it('creates a campaign with product, price and period', async () => {
    vi.spyOn(promotionsApi, 'listPromotions').mockResolvedValue([])
    const save = vi.spyOn(promotionsApi, 'savePromotion').mockResolvedValue({
      id: 1,
      name: 'Semana do chocolate',
      product_id: 4,
      promotional_price: '19.90',
      starts_at: '2026-10-20T03:00:00.000Z',
      ends_at: '2026-10-27T03:00:00.000Z',
      is_active: true,
      is_running: false,
    })
    const user = userEvent.setup()

    render(<PromotionManager products={products} />)
    await user.type(screen.getByLabelText('Nome da campanha'), 'Semana do chocolate')
    await user.selectOptions(screen.getByLabelText('Produto'), '4')
    await user.type(screen.getByLabelText('Preço promocional (R$)'), '19.90')
    await user.type(screen.getByLabelText('Início'), '2026-10-20T00:00')
    await user.type(screen.getByLabelText('Fim'), '2026-10-27T00:00')
    await user.click(screen.getByRole('button', { name: 'Criar campanha' }))

    expect(save).toHaveBeenCalledWith({
      name: 'Semana do chocolate',
      product_id: 4,
      promotional_price: '19.9',
      starts_at: new Date('2026-10-20T00:00').toISOString(),
      ends_at: new Date('2026-10-27T00:00').toISOString(),
      is_active: true,
    })
  })
})
