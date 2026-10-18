import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ApiError } from '@/shared/api/api-error'
import { renderWithRouter } from '@/test/render-with-router'

import * as registerApi from '../api/register'
import { RegisterForm } from './RegisterForm'

async function fillForm() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Nome completo'), 'Ana Souza')
  await user.type(screen.getByLabelText('E-mail'), 'ana@example.com')
  await user.type(screen.getByLabelText('Telefone'), '11987654321')
  await user.type(screen.getByLabelText('Senha'), 'doce1234')
  await user.click(screen.getByRole('button', { name: 'Criar conta' }))
}

describe('RegisterForm', () => {
  it('submits name, e-mail, phone and password', async () => {
    const spy = vi.spyOn(registerApi, 'register').mockResolvedValue({
      id: 1,
      name: 'Ana Souza',
      email: 'ana@example.com',
      phone: '11987654321',
      role: 'customer',
      created_at: '2026-10-18T12:00:00Z',
    })
    const onRegistered = vi.fn()

    renderWithRouter(<RegisterForm onRegistered={onRegistered} />)
    await fillForm()

    expect(spy).toHaveBeenCalledWith({
      name: 'Ana Souza',
      email: 'ana@example.com',
      phone: '11987654321',
      password: 'doce1234',
    })
    expect(onRegistered).toHaveBeenCalled()
  })

  it('shows the duplicate e-mail message and field errors from the API', async () => {
    vi.spyOn(registerApi, 'register').mockRejectedValue(
      new ApiError({
        type: 'urn:x',
        title: 'Invalid request',
        status: 422,
        code: 'CS-SYS-0002',
        errors: [{ pointer: '/body/phone', code: 'string_pattern_mismatch', detail: 'x' }],
      }),
    )

    renderWithRouter(<RegisterForm onRegistered={vi.fn()} />)
    await fillForm()

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByLabelText('Telefone')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Formato inválido.')).toBeInTheDocument()
  })
})
