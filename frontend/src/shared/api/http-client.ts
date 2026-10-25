import { sessionStore } from '@/shared/auth/session-store'
import { env } from '@/shared/config/env'

import { ApiError } from './api-error'
import { AUTHENTICATION_REQUIRED_CODE } from './error-messages'
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

function authorizationHeader(): Record<string, string> {
  const session = sessionStore.get()
  return session === null ? {} : { Authorization: `Bearer ${session.accessToken}` }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...authorizationHeader(), ...init.headers },
    })
  } catch {
    throw ApiError.network()
  }

  const body = await readBody(response)
  if (!response.ok) {
    const error = isProblemDetails(body) ? new ApiError(body) : ApiError.unexpected(response.status)
    if (error.code === AUTHENTICATION_REQUIRED_CODE) {
      sessionStore.clear()
    }
    throw error
  }
  return body as T
}

export async function requestExternal<T>(url: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch {
    throw ApiError.network()
  }
  const body = await readBody(response)
  if (!response.ok || body === undefined) {
    throw ApiError.unexpected(response.status)
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
