import { sessionStore, type StoredSession } from './session-store'

const account = { id: 1, name: 'Ana', email: 'ana@example.com', role: 'customer' as const }

function sessionExpiringAt(expiresAt: string): StoredSession {
  return { accessToken: 'token', expiresAt, account }
}

describe('sessionStore', () => {
  afterEach(() => sessionStore.clear())

  it('keeps a valid session', () => {
    sessionStore.save(sessionExpiringAt('2999-01-01T00:00:00Z'))

    expect(sessionStore.get()?.account.name).toBe('Ana')
  })

  it('drops an expired session so a new sign-in is required', () => {
    sessionStore.save(sessionExpiringAt('2000-01-01T00:00:00Z'))

    expect(sessionStore.get()).toBeNull()
  })
})
