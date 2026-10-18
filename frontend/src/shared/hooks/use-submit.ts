import { useState } from 'react'

import { ApiError } from '@/shared/api/api-error'
import { fieldErrors, type FieldErrors } from '@/shared/api/field-errors'

export interface SubmitState {
  submitting: boolean
  error: string | null
  fields: FieldErrors
}

export interface SubmitResult<A extends unknown[]> extends SubmitState {
  submit: (...args: A) => Promise<boolean>
  reset: () => void
}

const IDLE: SubmitState = { submitting: false, error: null, fields: {} }

export function useSubmit<A extends unknown[]>(
  action: (...args: A) => Promise<unknown>,
): SubmitResult<A> {
  const [state, setState] = useState<SubmitState>(IDLE)

  async function submit(...args: A): Promise<boolean> {
    setState({ submitting: true, error: null, fields: {} })
    try {
      await action(...args)
      setState(IDLE)
      return true
    } catch (caught: unknown) {
      const error = ApiError.from(caught)
      setState({ submitting: false, error: error.message, fields: fieldErrors(error) })
      return false
    }
  }

  return { ...state, submit, reset: () => setState(IDLE) }
}
