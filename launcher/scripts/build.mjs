import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { configModule, resolveConfig } from './config.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const source = `${root}src`
const output = `${root}dist`

const LAUNCHER_ENV_PREFIX = 'LAUNCHER_'
const environment = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => name.startsWith(LAUNCHER_ENV_PREFIX)),
)
const config = resolveConfig(environment, `${root}.env`)

rmSync(output, { recursive: true, force: true })
mkdirSync(output, { recursive: true })
cpSync(source, output, { recursive: true })
writeFileSync(`${output}/config.js`, configModule(config))

console.log(`Launcher built in dist/ for ${config.frontendUrl} and ${config.backendUrl}.`)
