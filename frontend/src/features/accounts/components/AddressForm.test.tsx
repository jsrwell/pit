import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ApiError } from '@/shared/api/api-error'

import * as zipApi from '../api/zip-lookup'
import { AddressForm } from './AddressForm'

function renderForm() {
  render(<AddressForm onSaved={vi.fn()} onCancel={vi.fn()} />)
}

describe('AddressForm CEP autofill', () => {
  it('fills street and district once the eight digits are typed and keeps them editable', async () => {
    const lookup = vi
      .spyOn(zipApi, 'lookupZip')
      .mockResolvedValue({ street: 'Avenida Paulista', district: 'Bela Vista' })
    const user = userEvent.setup()

    renderForm()
    await user.type(screen.getByLabelText('CEP'), '0131010')
    expect(lookup).not.toHaveBeenCalled()
    await user.type(screen.getByLabelText('CEP'), '0')

    expect(screen.getByLabelText('CEP')).toHaveValue('01310-100')
    expect(lookup).toHaveBeenCalledWith('01310100')
    await waitFor(() => expect(screen.getByLabelText('Rua')).toHaveValue('Avenida Paulista'))
    expect(screen.getByLabelText('Bairro')).toHaveValue('Bela Vista')
    expect(screen.getByLabelText('Número')).toHaveFocus()
    await user.type(screen.getByLabelText('Rua'), ', bloco B')
    expect(screen.getByLabelText('Rua')).toHaveValue('Avenida Paulista, bloco B')
  })

  it('warns about an unknown CEP and allows manual filling', async () => {
    vi.spyOn(zipApi, 'lookupZip').mockResolvedValue(null)
    const user = userEvent.setup()

    renderForm()
    await user.type(screen.getByLabelText('CEP'), '99999999')

    await waitFor(() =>
      expect(screen.getByLabelText('CEP')).toHaveAccessibleDescription(/CEP não encontrado/),
    )
    await user.type(screen.getByLabelText('Rua'), 'Rua Nova')
    expect(screen.getByLabelText('Rua')).toHaveValue('Rua Nova')
  })

  it('keeps the form usable when the service fails', async () => {
    vi.spyOn(zipApi, 'lookupZip').mockRejectedValue(ApiError.network())
    const user = userEvent.setup()

    renderForm()
    await user.type(screen.getByLabelText('CEP'), '01310100')

    await waitFor(() =>
      expect(screen.getByLabelText('CEP')).toHaveAccessibleDescription(
        /Não foi possível consultar o CEP/,
      ),
    )
    expect(screen.getByRole('button', { name: 'Salvar endereço' })).toBeEnabled()
  })

  it('announces the search and never overwrites what was typed meanwhile', async () => {
    let answer: (address: zipApi.ZipAddress) => void = () => undefined
    vi.spyOn(zipApi, 'lookupZip').mockImplementation(
      () => new Promise((resolve) => (answer = resolve)),
    )
    const user = userEvent.setup()

    renderForm()
    await user.type(screen.getByLabelText('CEP'), '01310100')
    expect(screen.getByRole('status')).toHaveTextContent('Buscando o endereço deste CEP')
    expect(screen.getByLabelText('CEP')).toHaveAttribute('aria-busy', 'true')
    await user.type(screen.getByLabelText('Rua'), 'Rua do Cliente')
    answer({ street: 'Avenida Paulista', district: 'Bela Vista' })

    await waitFor(() => expect(screen.getByLabelText('Bairro')).toHaveValue('Bela Vista'))
    expect(screen.getByLabelText('Rua')).toHaveValue('Rua do Cliente')
  })
})
