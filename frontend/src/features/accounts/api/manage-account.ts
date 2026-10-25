import { sendJson } from '@/shared/api/http-client'
import { sessionStore } from '@/shared/auth/session-store'

import type { Account } from './account'

export interface AccountUpdate {
  name: string
  email: string
  phone: string
}

export interface PasswordChange {
  current_password: string
  new_password: string
}

export async function updateMyAccount(update: AccountUpdate): Promise<Account> {
  const account = await sendJson<Account>('/accounts/me', 'PUT', update)
  const session = sessionStore.get()
  if (session !== null) {
    sessionStore.save({
      ...session,
      account: { ...session.account, name: account.name, email: account.email },
    })
  }
  return account
}

export async function changePassword(change: PasswordChange): Promise<void> {
  await sendJson<unknown>('/accounts/me/password', 'PUT', change)
}

export async function deleteMyAccount(): Promise<void> {
  await sendJson<unknown>('/accounts/me', 'DELETE')
  sessionStore.clear()
}
