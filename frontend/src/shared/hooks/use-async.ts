import { useCallback, useEffect, useState } from 'react'

import { ApiError } from '@/shared/api/api-error'

export type AsyncState<T> =
  { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: ApiError }

export interface AsyncResult<T> {
  state: AsyncState<T>
  refreshing: boolean
  reload: () => void
}

export function useAsync<T>(load: () => Promise<T>): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [refreshing, setRefreshing] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setRefreshing(true)
    load()
      .then((data) => {
        if (active) setState({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (active) setState({ status: 'error', error: ApiError.from(error) })
      })
      .finally(() => {
        if (active) setRefreshing(false)
      })
    return () => {
      active = false
    }
  }, [load, attempt])

  const reload = useCallback(() => setAttempt((current) => current + 1), [])

  return { state, refreshing: refreshing && state.status !== 'loading', reload }
}
