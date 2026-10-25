import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ApiError } from '@/shared/api/api-error'

import * as customApi from '../api/custom-orders'
import { CustomOrderForm } from './CustomOrderForm'

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

describe('CustomOrderForm', () => {
  it('sends quantity, desired date and notes', async () => {
    const send = vi.spyOn(customApi, 'requestCustomOrder').mockResolvedValue(created)
    const onRequested = vi.fn()
    const user = userEvent.setup()

    render(<CustomOrderForm onRequested={onRequested} />)
    await user.type(screen.getByLabelText('O que você deseja?'), created.description)
    await user.clear(screen.getByLabelText('Quantidade'))
    await user.type(screen.getByLabelText('Quantidade'), '60')
    await user.type(screen.getByLabelText('Data desejada'), '2026-12-20')
    await user.type(screen.getByLabelText('Observações'), 'Sem glúten')
    await user.click(screen.getByRole('button', { name: 'Solicitar encomenda' }))

    expect(send).toHaveBeenCalledWith({
      description: created.description,
      quantity: 60,
      desired_date: '2026-12-20',
      notes: 'Sem glúten',
    })
    expect(onRequested).toHaveBeenCalledWith(created)
  })

  it('explains the minimum lead time', async () => {
    vi.spyOn(customApi, 'requestCustomOrder').mockRejectedValue(
      new ApiError({ type: 'urn:x', title: 'Lead', status: 422, code: 'CS-ORD-0008' }),
    )
    const user = userEvent.setup()

    render(<CustomOrderForm onRequested={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Solicitar encomenda' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('antecedência mínima')
  })

  it('limits description and notes to the API sizes with a counter', () => {
    render(<CustomOrderForm onRequested={vi.fn()} />)

    expect(screen.getByLabelText('O que você deseja?')).toHaveAttribute('maxlength', '1000')
    expect(screen.getByLabelText('Observações')).toHaveAttribute('maxlength', '500')
    expect(screen.getByText('1000 caracteres restantes')).toBeInTheDocument()
    expect(screen.getByText('500 caracteres restantes')).toBeInTheDocument()
  })
})
