import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { configModule, parseEnvFile, resolveConfig } from '../scripts/config.mjs'

const NO_FILE = 'missing.env'

describe('resolveConfig', () => {
  it('reads the service URLs from the environment, without trailing slash', () => {
    const config = resolveConfig(
      {
        LAUNCHER_FRONTEND_URL: 'https://cupcakes-frontend.onrender.com/',
        LAUNCHER_BACKEND_URL: 'https://cupcakes-backend.onrender.com',
      },
      NO_FILE,
    )

    assert.equal(config.frontendUrl, 'https://cupcakes-frontend.onrender.com')
    assert.equal(config.backendUrl, 'https://cupcakes-backend.onrender.com')
    assert.equal(config.pollSeconds, 10)
  })

  it('refuses invalid values instead of publishing a broken page', () => {
    assert.throws(() => resolveConfig({ LAUNCHER_BACKEND_URL: 'not a url' }, NO_FILE))
    assert.throws(() => resolveConfig({ LAUNCHER_POLL_SECONDS: '0' }, NO_FILE))
  })

  it('emits an importable module', () => {
    const module = configModule(resolveConfig({}, NO_FILE))

    assert.match(module, /^export const CONFIG = Object\.freeze\(/)
  })
})

describe('parseEnvFile', () => {
  it('reads KEY=value lines and strips quotes', () => {
    assert.deepEqual(parseEnvFile('# comment\nA=1\nB="two"\n'), { A: '1', B: 'two' })
  })
})
