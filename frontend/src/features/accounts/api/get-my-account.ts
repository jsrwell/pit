import { request } from '@/shared/api/http-client'

import type { Account } from './account'

export function getMyAccount(): Promise<Account> {
  return request<Account>('/accounts/me')
}
