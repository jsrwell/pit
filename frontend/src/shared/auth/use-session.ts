import { useSyncExternalStore } from 'react'

import { sessionStore, type StoredSession } from './session-store'

export function useSession(): StoredSession | null {
  return useSyncExternalStore(sessionStore.subscribe, sessionStore.get)
}
