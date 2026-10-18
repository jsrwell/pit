import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as addressApi from '../api/addresses'
import { AddressBook } from './AddressBook'

const home: addressApi.Address = {
  id: 1,
  label: 'Casa',
  zip_code: '01310-100',
  street: 'Avenida Paulista',
  number: '1000',
  complement: '',
  district: 'Bela Vista',
  reference: '',
  is_primary: true,
}

describe('AddressBook', () => {
  it('registers a new address with every field', async () => {
    vi.spyOn(addressApi, 'listAddresses').mockResolvedValue([])
    const create = vi.spyOn(addressApi, 'createAddress').mockResolvedValue(home)
    const user = userEvent.setup()

    render(<AddressBook />)
    await user.click(await screen.findByRole('button', { name: 'Novo endereço' }))
    await user.type(screen.getByLabelText('CEP'), '01310100')
    await user.type(screen.getByLabelText('Rua'), 'Avenida Paulista')
    await user.type(screen.getByLabelText('Número'), '1000')
    await user.type(screen.getByLabelText('Complemento'), 'Apto 12')
    await user.type(screen.getByLabelText('Bairro'), 'Bela Vista')
    await user.type(screen.getByLabelText('Ponto de referência'), 'Metrô')
    await user.click(screen.getByRole('button', { name: 'Salvar endereço' }))

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        zip_code: '01310100',
        street: 'Avenida Paulista',
        complement: 'Apto 12',
        reference: 'Metrô',
      }),
    )
  })

  it('makes another address the primary one', async () => {
    const work = { ...home, id: 2, label: 'Trabalho', is_primary: false }
    vi.spyOn(addressApi, 'listAddresses').mockResolvedValue([home, work])
    const primary = vi.spyOn(addressApi, 'makePrimary').mockResolvedValue(work)
    const user = userEvent.setup()

    render(<AddressBook />)
    const card = (await screen.findByText('Trabalho')).closest('li')
    if (card === null) throw new Error('Address card not found')
    await user.click(within(card).getByRole('button', { name: 'Tornar principal' }))

    expect(primary).toHaveBeenCalledWith(2)
  })
})
