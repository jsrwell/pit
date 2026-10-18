import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ApiError } from '@/shared/api/api-error'
import * as httpClient from '@/shared/api/http-client'
import { sessionStore } from '@/shared/auth/session-store'
import { renderWithRouter } from '@/test/render-with-router'

import { LoginForm } from './LoginForm'

async function submitCredentials(password = 'doce1234') {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('E-mail'), 'ana@example.com')
  await user.type(screen.getByLabelText('Senha'), password)
  await user.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('LoginForm', () => {
  afterEach(() => sessionStore.clear())

  it('stores the session and hands the account over on success', async () => {
    const account = {
      id: 1,
      name: 'Ana',
      email: 'ana@example.com',
      phone: '11987654321',
      role: 'customer' as const,
      created_at: '2026-10-18T12:00:00Z',
    }
    vi.spyOn(httpClient, 'sendJson').mockResolvedValue({
      access_token: 'token-123',
      token_type: 'bearer',
      expires_at: '2999-01-01T00:00:00Z',
      account,
    })
    const onSignedIn = vi.fn()

    renderWithRouter(<LoginForm onSignedIn={onSignedIn} />)
    await submitCredentials()

    expect(onSignedIn).toHaveBeenCalledWith(account)
    expect(sessionStore.get()?.accessToken).toBe('token-123')
  })

  it('reports wrong credentials', async () => {
    vi.spyOn(httpClient, 'sendJson').mockRejectedValue(
      new ApiError({ type: 'urn:x', title: 'Invalid', status: 401, code: 'CS-ACC-0003' }),
    )

    renderWithRouter(<LoginForm onSignedIn={vi.fn()} />)
    await submitCredentials('errada123')

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.')
    expect(sessionStore.get()).toBeNull()
  })
})
