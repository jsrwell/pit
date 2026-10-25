import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as promotionsApi from '../../api/promotions'
import { CouponManager } from './CouponManager'

const coupon: promotionsApi.Coupon = {
  id: 3,
  code: 'DOCE10',
  discount_percent: 10,
  starts_at: '2026-10-01T00:00:00Z',
  ends_at: '2026-12-31T23:59:00Z',
  is_active: true,
  is_running: true,
}

describe('CouponManager', () => {
  it('registers a coupon with code, percentage and period', async () => {
    vi.spyOn(promotionsApi, 'listCoupons').mockResolvedValue([])
    const create = vi.spyOn(promotionsApi, 'createCoupon').mockResolvedValue(coupon)
    const user = userEvent.setup()

    render(<CouponManager />)
    await user.type(screen.getByLabelText('Código'), 'doce10')
    await user.type(screen.getByLabelText('Desconto (%)'), '10')
    await user.type(screen.getByLabelText('Início'), '2026-10-01T00:00')
    await user.type(screen.getByLabelText('Fim'), '2026-12-31T23:59')
    await user.click(screen.getByRole('button', { name: 'Criar cupom' }))

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'DOCE10', discount_percent: 10, is_active: true }),
    )
  })

  it('disables a running coupon', async () => {
    vi.spyOn(promotionsApi, 'listCoupons').mockResolvedValue([coupon])
    const toggle = vi
      .spyOn(promotionsApi, 'setCouponActive')
      .mockResolvedValue({ ...coupon, is_active: false, is_running: false })
    const user = userEvent.setup()

    render(<CouponManager />)
    expect(await screen.findByText('Em vigor')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Desativar' }))

    expect(toggle).toHaveBeenCalledWith(3, false)
  })
})
