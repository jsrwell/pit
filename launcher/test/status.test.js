import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  SERVICE_STATE,
  allOnline,
  estimatedProgress,
  isHealthy,
  stateFor,
  withCacheBuster,
} from '../src/status.js'

function respond(status, body) {
  return async () => new Response(JSON.stringify(body), { status })
}

describe('isHealthy', () => {
  it('accepts a 200 answer reporting ok', async () => {
    assert.equal(
      await isHealthy('https://api.test/api/health', 1000, respond(200, { status: 'ok' })),
      true,
    )
  })

  it('rejects the error page Render serves while the service wakes up', async () => {
    assert.equal(
      await isHealthy('https://api.test/api/health', 1000, respond(503, { status: 'ok' })),
      false,
    )
  })

  it('rejects unexpected bodies and network failures', async () => {
    const failing = async () => {
      throw new TypeError('Failed to fetch')
    }
    assert.equal(await isHealthy('https://a.test/h', 1000, respond(200, { up: true })), false)
    assert.equal(await isHealthy('https://a.test/h', 1000, failing), false)
  })

  it('gives up when the service does not answer in time', async () => {
    const hanging = (_url, { signal }) =>
      new Promise((_resolve, reject) =>
        signal.addEventListener('abort', () => reject(signal.reason)),
      )
    assert.equal(await isHealthy('https://a.test/h', 10, hanging), false)
  })
})

describe('status helpers', () => {
  it('adds a cache buster without losing the path', () => {
    assert.equal(
      withCacheBuster('https://a.test/health.json', 42),
      'https://a.test/health.json?t=42',
    )
  })

  it('redirects only when every service is online', () => {
    assert.equal(allOnline({ frontend: stateFor(true), backend: stateFor(false) }), false)
    assert.equal(allOnline({ frontend: SERVICE_STATE.ONLINE, backend: SERVICE_STATE.ONLINE }), true)
  })

  it('keeps the estimated progress between 5% and 95% until ready', () => {
    assert.equal(estimatedProgress(0, 90), 0.05)
    assert.equal(estimatedProgress(45, 90), 0.5)
    assert.equal(estimatedProgress(500, 90), 0.95)
  })
})
