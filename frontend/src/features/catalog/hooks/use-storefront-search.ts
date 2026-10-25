import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

export const SEARCH_PARAM = 'busca'
export const SEARCH_MAX_LENGTH = 80

export function storefrontSearchUrl(term: string): string {
  const trimmed = term.trim()
  return trimmed === '' ? '/' : `/?${new URLSearchParams({ [SEARCH_PARAM]: trimmed }).toString()}`
}

export function useStorefrontSearch(): [string, (term: string) => void] {
  const [params, setParams] = useSearchParams()
  const term = (params.get(SEARCH_PARAM) ?? '').trim()

  const setTerm = useCallback(
    (next: string) =>
      setParams(
        (current) => {
          const updated = new URLSearchParams(current)
          if (next.trim() === '') updated.delete(SEARCH_PARAM)
          else updated.set(SEARCH_PARAM, next.trim())
          return updated
        },
        { replace: true },
      ),
    [setParams],
  )

  return [term, setTerm]
}
