import type { SessionRole } from '@/shared/auth/session-store'

export function homeFor(role: SessionRole): string {
  return role === 'admin' ? '/admin' : '/conta'
}
