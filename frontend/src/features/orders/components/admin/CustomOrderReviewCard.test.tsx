import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as customApi from '../../api/custom-orders'
import { CustomOrderReviewCard } from './CustomOrderReviewCard'

const created: customApi.StoreCustomOrder = {
  id: 3,
  description: 'Cupcakes de casamento brancos e dourados',
  quantity: 60,
  desired_date: '2026-12-20',
  notes: '',
  status: 'pending_review',
  quoted_price: null,
  store_response: '',
  created_at: '2026-10-18T12:00:00Z',
  reviewed_at: null,
  customer: { name: 'Ana', email: 'ana@example.com', phone: '11987654321' },
}

describe('CustomOrderReviewCard', () => {
  it('approves a pending request with a price and a message', async () => {
    const review = vi
      .spyOn(customApi, 'reviewCustomOrder')
      .mockResolvedValue({ ...created, status: 'approved', quoted_price: '480.00' })
    const onReviewed = vi.fn()
    const user = userEvent.setup()

    render(<CustomOrderReviewCard customOrder={created} onReviewed={onReviewed} />)
    await user.type(screen.getByLabelText('Valor proposto (R$)'), '480')
    await user.type(screen.getByLabelText('Resposta ao cliente'), 'Aprovado!')
    await user.click(screen.getByRole('button', { name: 'Aprovar' }))

    expect(review).toHaveBeenCalledWith(3, {
      decision: 'approved',
      quoted_price: '480',
      response: 'Aprovado!',
    })
    expect(onReviewed).toHaveBeenCalled()
  })
})
