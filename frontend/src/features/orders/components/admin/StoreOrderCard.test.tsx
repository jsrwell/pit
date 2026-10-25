import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as storeApi from '../../api/store-orders'
import { StoreOrderCard } from './StoreOrderCard'

const order: storeApi.StoreOrder = {
  id: 11,
  status: 'received',
  fulfillment_method: 'delivery',
  delivery_address: 'Avenida Paulista, 1000',
  delivery_reference: 'Portaria',
  payment_method: 'cash',
  payment_status: 'pending',
  payment_reference: 'CASH',
  subtotal: '30.00',
  discount: '0.00',
  coupon_code: null,
  coupon_discount: '0.00',
  delivery_fee: '12.00',
  total: '42.00',
  notes: 'Tocar o interfone.',
  created_at: '2026-10-18T12:00:00Z',
  updated_at: '2026-10-18T12:00:00Z',
  items: [
    { product_id: 1, product_name: 'Trufa', unit_price: '10.00', quantity: 3, line_total: '30.00' },
  ],
  history: [],
  customer: { name: 'Ana Souza', email: 'ana@example.com', phone: '11987654321' },
  next_statuses: ['confirmed', 'cancelled'],
}

describe('StoreOrderCard', () => {
  it('shows customer, fulfillment and notes and advances the status', async () => {
    const change = vi
      .spyOn(storeApi, 'changeOrderStatus')
      .mockResolvedValue({ ...order, status: 'confirmed' })
    const onChanged = vi.fn()
    const user = userEvent.setup()

    render(<StoreOrderCard order={order} onChanged={onChanged} />)

    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.getByText('Tocar o interfone.')).toBeInTheDocument()
    expect(screen.getByText('Avenida Paulista, 1000')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Concluir' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(change).toHaveBeenCalledWith(11, 'confirmed')
    expect(onChanged).toHaveBeenCalled()
  })
})
