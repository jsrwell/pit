import { sessionStore } from '@/shared/auth/session-store'
import { sendJson } from '@/shared/api/http-client'

import type { Account } from './account'

export interface Credentials {
  email: string
  password: string
}

export interface SessionToken {
  access_token: string
  token_type: 'bearer'
  expires_at: string
  account: Account
}

export async function signIn(credentials: Credentials): Promise<Account> {
  const token = await sendJson<SessionToken>('/accounts/sessions', 'POST', credentials)
  const { id, name, email, role } = token.account
  sessionStore.save({
    accessToken: token.access_token,
    expiresAt: token.expires_at,
    account: { id, name, email, role },
  })
  return token.account
}

export function signOut(): void {
  sessionStore.clear()
}
