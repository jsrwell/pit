import { existsSync, readFileSync } from 'node:fs'

const DEFAULTS = Object.freeze({
  LAUNCHER_FRONTEND_URL: 'http://localhost:5173',
  LAUNCHER_BACKEND_URL: 'http://localhost:8000',
  LAUNCHER_POLL_SECONDS: '10',
  LAUNCHER_REQUEST_TIMEOUT_SECONDS: '8',
})

export function parseEnvFile(text) {
  const values = {}
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match) values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  return values
}

function readEnvFile(path) {
  return existsSync(path) ? parseEnvFile(readFileSync(path, 'utf8')) : {}
}

function normalizeUrl(name, value) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${name} must be an absolute URL, got "${value}".`)
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`${name} must use http or https.`)
  }
  return url.toString().replace(/\/+$/, '')
}

function positiveNumber(name, value) {
  const number = Number(value)
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${name} must be a positive number, got "${value}".`)
  }
  return number
}

export function resolveConfig(environment, envFilePath) {
  const values = { ...DEFAULTS, ...readEnvFile(envFilePath), ...environment }
  return {
    frontendUrl: normalizeUrl('LAUNCHER_FRONTEND_URL', values.LAUNCHER_FRONTEND_URL),
    backendUrl: normalizeUrl('LAUNCHER_BACKEND_URL', values.LAUNCHER_BACKEND_URL),
    pollSeconds: positiveNumber('LAUNCHER_POLL_SECONDS', values.LAUNCHER_POLL_SECONDS),
    requestTimeoutSeconds: positiveNumber(
      'LAUNCHER_REQUEST_TIMEOUT_SECONDS',
      values.LAUNCHER_REQUEST_TIMEOUT_SECONDS,
    ),
  }
}

export function configModule(config) {
  return `export const CONFIG = Object.freeze(${JSON.stringify(config, null, 2)})\n`
}
