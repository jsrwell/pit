import type { ReactNode } from 'react'

import type { AsyncState } from '@/shared/hooks/use-async'

import { ErrorMessage } from './ErrorMessage'

interface AsyncContentProps<T> {
  state: AsyncState<T>
  loadingLabel?: string
  children: (data: T) => ReactNode
}

export function AsyncContent<T>({
  state,
  loadingLabel = 'Carregando...',
  children,
}: AsyncContentProps<T>) {
  if (state.status === 'loading') {
    return (
      <p role="status" className="muted">
        {loadingLabel}
      </p>
    )
  }
  if (state.status === 'error') {
    return <ErrorMessage message={state.error.message} />
  }
  return <>{children(state.data)}</>
}
