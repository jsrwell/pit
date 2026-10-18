import { render, screen, within } from '@testing-library/react'

import type { Order } from '../api/order'
import * as myOrdersApi from '../api/my-orders'
import { OrderTracking } from './OrderTracking'

const order: Order = {
  id: 7,
  status: 'out_for_delivery',
  fulfillment_method: 'delivery',
  delivery_address: 'Avenida Paulista, 1000 - Bela Vista, CEP 01310-100',
  delivery_reference: null,
  payment_method: 'pix',
  payment_status: 'approved',
  payment_reference: 'PIX-1',
  subtotal: '30.00',
  delivery_fee: '12.00',
  total: '42.00',
  notes: '',
  created_at: '2026-10-18T12:00:00Z',
  updated_at: '2026-10-18T13:00:00Z',
  items: [],
  history: [
    { status: 'received', changed_at: '2026-10-18T12:00:00Z' },
    { status: 'confirmed', changed_at: '2026-10-18T12:05:00Z' },
    { status: 'preparing', changed_at: '2026-10-18T12:10:00Z' },
    { status: 'ready', changed_at: '2026-10-18T12:40:00Z' },
    { status: 'out_for_delivery', changed_at: '2026-10-18T12:45:00Z' },
  ],
}

describe('OrderTracking', () => {
  it('shows the current status, the creation time and the delivery timeline', async () => {
    vi.spyOn(myOrdersApi, 'getMyOrder').mockResolvedValue(order)

    render(<OrderTracking orderId={7} />)

    expect(await screen.findByRole('heading', { name: 'Em rota de entrega' })).toBeInTheDocument()
    expect(screen.getByText(/Pedido feito em/)).toBeInTheDocument()
    const timeline = screen.getByRole('list', { name: 'Andamento do pedido' })
    const current = within(timeline).getByText('Em rota de entrega').closest('li')
    expect(current).toHaveAttribute('aria-current', 'step')
    expect(within(timeline).getByText('Concluído')).toBeInTheDocument()
  })
})
