import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as adminApi from '../../api/admin-products'
import { AvailabilityToggle } from './AvailabilityToggle'

const product: adminApi.AdminProduct = {
  id: 2,
  name: 'Trufa de Ouro',
  price: '24.90',
  image_id: 1,
  category: { id: 1, name: 'Especial' },
  flavor: { id: 1, name: 'Chocolate' },
  is_available: true,
  is_featured: true,
  is_active: true,
  show_when_unavailable: true,
  description: 'x',
  composition: 'y',
  highlights: [],
  created_at: '2026-10-18T12:00:00Z',
  updated_at: '2026-10-18T12:00:00Z',
}

describe('AvailabilityToggle', () => {
  it('marks an available product as unavailable', async () => {
    const patch = vi
      .spyOn(adminApi, 'setAvailability')
      .mockResolvedValue({ ...product, is_available: false })
    const onChanged = vi.fn()
    const user = userEvent.setup()

    render(<AvailabilityToggle product={product} onChanged={onChanged} />)
    await user.click(screen.getByRole('button', { name: 'Marcar Trufa de Ouro como indisponível' }))

    expect(patch).toHaveBeenCalledWith(2, { is_available: false, show_when_unavailable: true })
    expect(onChanged).toHaveBeenCalled()
  })
})
