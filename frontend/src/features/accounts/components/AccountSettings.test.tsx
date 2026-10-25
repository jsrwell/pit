import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ApiError } from '@/shared/api/api-error'
import * as httpClient from '@/shared/api/http-client'
import { sessionStore } from '@/shared/auth/session-store'

import type { Account } from '../api/account'
import * as accountApi from '../api/get-my-account'
import * as manageApi from '../api/manage-account'
import { AccountOverview } from './AccountOverview'
import { DeleteAccount } from './DeleteAccount'
import { PasswordForm } from './PasswordForm'

const account: Account = {
  id: 1,
  name: 'Ana Souza',
  email: 'ana@example.com',
  phone: '11987654321',
  role: 'customer',
  created_at: '2026-10-18T12:00:00Z',
}

function saveSession() {
  sessionStore.save({
    accessToken: 't',
    expiresAt: '2999-01-01T00:00:00Z',
    account: { id: 1, name: 'Ana Souza', email: 'ana@example.com', role: 'customer' },
  })
}

describe('Account settings', () => {
  afterEach(() => sessionStore.clear())

  it('edits name, e-mail and phone with the sign-up validation', async () => {
    vi.spyOn(accountApi, 'getMyAccount').mockResolvedValue(account)
    const update = vi
      .spyOn(manageApi, 'updateMyAccount')
      .mockResolvedValue({ ...account, name: 'Ana Lima' })
    const user = userEvent.setup()

    render(<AccountOverview />)
    await user.click(await screen.findByRole('button', { name: 'Editar dados' }))
    expect(screen.getByLabelText('Telefone')).toHaveValue('(11) 98765-4321')
    await user.clear(screen.getByLabelText('Nome completo'))
    await user.type(screen.getByLabelText('Nome completo'), 'Ana Lima')
    await user.clear(screen.getByLabelText('E-mail'))
    await user.type(screen.getByLabelText('E-mail'), 'ana.lima')
    await user.click(screen.getByRole('button', { name: 'Salvar dados' }))

    expect(update).not.toHaveBeenCalled()
    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription(/e-mail válido/)
    await user.type(screen.getByLabelText('E-mail'), '@example.com')
    await user.click(screen.getByRole('button', { name: 'Salvar dados' }))

    expect(update).toHaveBeenCalledWith({
      name: 'Ana Lima',
      email: 'ana.lima@example.com',
      phone: '11987654321',
    })
    expect(await screen.findByText('Dados atualizados.')).toBeInTheDocument()
  })

  it('keeps the session name in sync after editing', async () => {
    saveSession()
    vi.spyOn(httpClient, 'sendJson').mockResolvedValue({ ...account, name: 'Ana Lima' })

    await manageApi.updateMyAccount({ name: 'Ana Lima', email: account.email, phone: '' })

    expect(sessionStore.get()?.account.name).toBe('Ana Lima')
  })

  it('changes the password confirming the current one', async () => {
    const change = vi.spyOn(manageApi, 'changePassword').mockResolvedValue()
    const user = userEvent.setup()

    render(<PasswordForm />)
    await user.type(screen.getByLabelText('Senha atual'), 'doce1234')
    await user.type(screen.getByLabelText('Nova senha'), 'trufa5678')
    await user.type(screen.getByLabelText('Confirme a nova senha'), 'trufa5679')
    await user.click(screen.getByRole('button', { name: 'Alterar senha' }))

    expect(change).not.toHaveBeenCalled()
    expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument()
    await user.clear(screen.getByLabelText('Confirme a nova senha'))
    await user.type(screen.getByLabelText('Confirme a nova senha'), 'trufa5678')
    await user.click(screen.getByRole('button', { name: 'Alterar senha' }))

    expect(change).toHaveBeenCalledWith({
      current_password: 'doce1234',
      new_password: 'trufa5678',
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Senha alterada')
  })

  it('reports a wrong current password', async () => {
    vi.spyOn(manageApi, 'changePassword').mockRejectedValue(
      new ApiError({ type: 'urn:x', title: 'Wrong', status: 422, code: 'CS-ACC-0006' }),
    )
    const user = userEvent.setup()

    render(<PasswordForm />)
    await user.type(screen.getByLabelText('Senha atual'), 'errada123')
    await user.type(screen.getByLabelText('Nova senha'), 'trufa5678')
    await user.type(screen.getByLabelText('Confirme a nova senha'), 'trufa5678')
    await user.click(screen.getByRole('button', { name: 'Alterar senha' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('A senha atual não confere')
  })

  it('deletes the account only after an explicit confirmation', async () => {
    const remove = vi.spyOn(manageApi, 'deleteMyAccount').mockResolvedValue()
    const onDeleted = vi.fn()
    const user = userEvent.setup()

    render(<DeleteAccount onDeleted={onDeleted} />)
    await user.click(screen.getByRole('button', { name: 'Excluir minha conta' }))
    const confirm = screen.getByRole('button', { name: 'Excluir definitivamente' })
    expect(confirm).toBeDisabled()
    await user.click(screen.getByLabelText(/não pode ser desfeita/))
    await user.click(confirm)

    expect(remove).toHaveBeenCalled()
    expect(onDeleted).toHaveBeenCalled()
  })

  it('explains why an account with open orders stays', async () => {
    vi.spyOn(manageApi, 'deleteMyAccount').mockRejectedValue(
      new ApiError({ type: 'urn:x', title: 'Open', status: 409, code: 'CS-ACC-0007' }),
    )
    const onDeleted = vi.fn()
    const user = userEvent.setup()

    render(<DeleteAccount onDeleted={onDeleted} />)
    await user.click(screen.getByRole('button', { name: 'Excluir minha conta' }))
    await user.click(screen.getByLabelText(/não pode ser desfeita/))
    await user.click(screen.getByRole('button', { name: 'Excluir definitivamente' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('pedidos em andamento')
    expect(onDeleted).not.toHaveBeenCalled()
  })

  it('signs out once the account is deleted', async () => {
    saveSession()
    vi.spyOn(httpClient, 'sendJson').mockResolvedValue(undefined)

    await manageApi.deleteMyAccount()

    expect(sessionStore.get()).toBeNull()
  })
})
