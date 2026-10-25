import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'cupcakes-gourmet.favorites'

type Listener = () => void

const listeners = new Set<Listener>()
let current: readonly number[] = readStorage()

function isProductIdList(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => Number.isInteger(item))
}

function readStorage(): readonly number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return isProductIdList(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStorage(productIds: readonly number[]): void {
  try {
    if (productIds.length === 0) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds))
  } catch {
    return
  }
}

function publish(productIds: readonly number[]): void {
  current = productIds
  writeStorage(productIds)
  listeners.forEach((listener) => listener())
}

export const favoritesStore = {
  get(): readonly number[] {
    return current
  },
  has(productId: number): boolean {
    return current.includes(productId)
  },
  toggle(productId: number): void {
    publish(
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
  },
  reload(): void {
    publish(readStorage())
  },
  clear(): void {
    publish([])
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useFavorites(): readonly number[] {
  return useSyncExternalStore(favoritesStore.subscribe, favoritesStore.get)
}
