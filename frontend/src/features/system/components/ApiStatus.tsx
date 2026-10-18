import { useEffect, useState } from 'react'

import { messageForCode, UNEXPECTED_ERROR_CODE } from '@/shared/api/error-messages'
import { ApiError } from '@/shared/api/api-error'

import { getHealth } from '../api/get-health'

type ApiState =
  { kind: 'loading' } | { kind: 'online'; version: string } | { kind: 'offline'; message: string }

export function ApiStatus() {
  const [state, setState] = useState<ApiState>({ kind: 'loading' })

  useEffect(() => {
    let active = true
    getHealth()
      .then((health) => {
        if (active) setState({ kind: 'online', version: health.version })
      })
      .catch((error: unknown) => {
        const message =
          error instanceof ApiError ? error.message : messageForCode(UNEXPECTED_ERROR_CODE)
        if (active) setState({ kind: 'offline', message })
      })
    return () => {
      active = false
    }
  }, [])

  if (state.kind === 'loading') {
    return <p role="status">Verificando o servidor...</p>
  }
  if (state.kind === 'offline') {
    return <p role="alert">{state.message}</p>
  }
  return <p role="status">Servidor disponível (versão {state.version})</p>
}
