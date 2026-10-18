import { useState } from 'react'

import { ApiError } from '@/shared/api/api-error'
import { fieldErrors, type FieldErrors } from '@/shared/api/field-errors'

export interface SubmitState {
  submitting: boolean
  error: string | null
  fields: FieldErrors
}

export interface SubmitResult<A extends unknown[], R> extends SubmitState {
  submit: (...args: A) => Promise<R | null>
  reset: () => void
}

const IDLE: SubmitState = { submitting: false, error: null, fields: {} }

export function useSubmit<A extends unknown[], R>(
  action: (...args: A) => Promise<R>,
): SubmitResult<A, R> {
  const [state, setState] = useState<SubmitState>(IDLE)

  async function submit(...args: A): Promise<R | null> {
    setState({ submitting: true, error: null, fields: {} })
    try {
      const result = await action(...args)
      setState(IDLE)
      return result
    } catch (caught: unknown) {
      const error = ApiError.from(caught)
      setState({ submitting: false, error: error.message, fields: fieldErrors(error) })
      return null
    }
  }

  return { ...state, submit, reset: () => setState(IDLE) }
}
