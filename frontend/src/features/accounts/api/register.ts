import { sendJson } from '@/shared/api/http-client'

import type { Account } from './account'

export interface AccountRegistration {
  name: string
  email: string
  phone: string
  password: string
}

export function register(registration: AccountRegistration): Promise<Account> {
  return sendJson<Account>('/accounts', 'POST', registration)
}
