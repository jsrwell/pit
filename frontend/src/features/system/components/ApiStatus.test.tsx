import { render, screen } from '@testing-library/react'

import { ApiError } from '@/shared/api/api-error'

import * as healthApi from '../api/get-health'
import { ApiStatus } from './ApiStatus'

describe('ApiStatus', () => {
  it('shows the API version when the server is up', async () => {
    vi.spyOn(healthApi, 'getHealth').mockResolvedValue({ status: 'ok', version: '1.2.3' })

    render(<ApiStatus />)

    expect(await screen.findByText('Servidor disponível (versão 1.2.3)')).toBeInTheDocument()
  })

  it('shows the user-facing message when the server is down', async () => {
    vi.spyOn(healthApi, 'getHealth').mockRejectedValue(ApiError.network())

    render(<ApiStatus />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível conectar ao servidor',
    )
  })
})
