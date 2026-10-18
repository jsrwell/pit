export type SessionRole = 'customer' | 'admin'

export interface SessionAccount {
  id: number
  name: string
  email: string
  role: SessionRole
}

export interface StoredSession {
  accessToken: string
  expiresAt: string
  account: SessionAccount
}

const STORAGE_KEY = 'cupcakes-gourmet.session'

type Listener = () => void

const listeners = new Set<Listener>()
let current: StoredSession | null = readStorage()

function isStoredSession(value: unknown): value is StoredSession {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.accessToken === 'string' && typeof candidate.expiresAt === 'string'
}

function readStorage(): StoredSession | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    return isStoredSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeStorage(session: StoredSession | null): void {
  try {
    if (session === null) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    return
  }
}

function isExpired(session: StoredSession): boolean {
  return new Date(session.expiresAt).getTime() <= Date.now()
}

function publish(session: StoredSession | null): void {
  current = session
  writeStorage(session)
  listeners.forEach((listener) => listener())
}

export const sessionStore = {
  get(): StoredSession | null {
    if (current !== null && isExpired(current)) {
      current = null
      writeStorage(null)
    }
    return current
  },
  save(session: StoredSession): void {
    publish(session)
  },
  clear(): void {
    if (current !== null) publish(null)
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
