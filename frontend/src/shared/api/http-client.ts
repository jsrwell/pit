import { env } from '@/shared/config/env'

import { ApiError } from './api-error'
import { isProblemDetails } from './problem-details'

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (text === '') {
    return undefined
  }
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...init.headers },
    })
  } catch {
    throw ApiError.network()
  }

  const body = await readBody(response)
  if (!response.ok) {
    throw isProblemDetails(body) ? new ApiError(body) : ApiError.unexpected(response.status)
  }
  return body as T
}

export type WriteMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export function sendJson<T>(path: string, method: WriteMethod, payload?: unknown): Promise<T> {
  if (payload === undefined) {
    return request<T>(path, { method })
  }
  return request<T>(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
