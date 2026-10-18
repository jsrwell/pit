export const SERVICE_STATE = Object.freeze({
  IDLE: 'idle',
  STARTING: 'starting',
  ONLINE: 'online',
})

export const STATE_LABELS = Object.freeze({
  [SERVICE_STATE.IDLE]: 'Aguardando',
  [SERVICE_STATE.STARTING]: 'Iniciando',
  [SERVICE_STATE.ONLINE]: 'Disponível',
})

export function withCacheBuster(url, now = Date.now()) {
  const target = new URL(url)
  target.searchParams.set('t', String(now))
  return target.toString()
}

export async function isHealthy(url, timeoutMs, fetchImpl = fetch) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetchImpl(withCacheBuster(url), {
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!response.ok) return false
    const body = await response.json()
    return body !== null && typeof body === 'object' && body.status === 'ok'
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

export function stateFor(online) {
  return online ? SERVICE_STATE.ONLINE : SERVICE_STATE.STARTING
}

export function allOnline(states) {
  return Object.values(states).every((state) => state === SERVICE_STATE.ONLINE)
}

export function estimatedProgress(elapsedSeconds, expectedSeconds) {
  const ratio = elapsedSeconds / expectedSeconds
  return Math.min(0.95, Math.max(0.05, ratio))
}
