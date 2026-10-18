import { CONFIG } from './config.js'
import {
  SERVICE_STATE,
  STATE_LABELS,
  allOnline,
  estimatedProgress,
  isHealthy,
  stateFor,
} from './status.js'

const SERVICES = Object.freeze({
  frontend: `${CONFIG.frontendUrl}/health.json`,
  backend: `${CONFIG.backendUrl}/api/health`,
})

const EXPECTED_STARTUP_SECONDS = 90
const SLOW_STARTUP_SECONDS = 180
const REDIRECT_DELAY_MS = 1500

const elements = {
  welcome: document.querySelector('[data-step="welcome"]'),
  progress: document.querySelector('[data-step="progress"]'),
  start: document.querySelector('[data-action="start"]'),
  title: document.querySelector('[data-role="title"]'),
  titleText: document.querySelector('[data-role="title-text"]'),
  spinner: document.querySelector('[data-role="spinner"]'),
  bar: document.querySelector('[data-role="bar"]'),
  barFill: document.querySelector('[data-role="bar-fill"]'),
  countdown: document.querySelector('[data-role="countdown"]'),
  hint: document.querySelector('[data-role="hint"]'),
  enter: document.querySelector('[data-action="enter"]'),
  badges: {
    frontend: document.querySelector('[data-service="frontend"]'),
    backend: document.querySelector('[data-service="backend"]'),
  },
}

const states = { frontend: SERVICE_STATE.IDLE, backend: SERVICE_STATE.IDLE }
let startedAt = 0
let nextCheckAt = 0
let countdownTimer = 0

function renderBadges() {
  for (const [service, badge] of Object.entries(elements.badges)) {
    badge.textContent = STATE_LABELS[states[service]]
    badge.dataset.state = states[service]
  }
}

function renderProgress(value) {
  const percent = Math.round(value * 100)
  elements.barFill.style.width = `${percent}%`
  elements.bar.setAttribute('aria-valuenow', String(percent))
}

function renderCountdown() {
  const elapsed = (Date.now() - startedAt) / 1000
  const remaining = Math.max(0, Math.ceil((nextCheckAt - Date.now()) / 1000))
  elements.countdown.textContent =
    remaining > 0
      ? `Próxima verificação em aproximadamente ${remaining} segundos.`
      : 'Verificando os serviços...'
  renderProgress(estimatedProgress(elapsed, EXPECTED_STARTUP_SECONDS))
  elements.hint.hidden = elapsed < SLOW_STARTUP_SECONDS
}

function showReady() {
  clearInterval(countdownTimer)
  elements.titleText.textContent = 'Tudo pronto! Abrindo a loja...'
  elements.spinner.hidden = true
  elements.countdown.textContent = 'Você será redirecionado em instantes.'
  elements.hint.hidden = true
  elements.enter.hidden = false
  renderProgress(1)
  setTimeout(() => window.location.assign(CONFIG.frontendUrl), REDIRECT_DELAY_MS)
}

async function checkServices() {
  const timeoutMs = CONFIG.requestTimeoutSeconds * 1000
  const results = await Promise.all(
    Object.entries(SERVICES).map(async ([service, url]) => [
      service,
      await isHealthy(url, timeoutMs),
    ]),
  )
  for (const [service, online] of results) {
    states[service] = stateFor(online)
  }
  renderBadges()
  return allOnline(states)
}

async function poll() {
  if (await checkServices()) {
    showReady()
    return
  }
  nextCheckAt = Date.now() + CONFIG.pollSeconds * 1000
  setTimeout(poll, CONFIG.pollSeconds * 1000)
}

function start() {
  elements.welcome.hidden = true
  elements.progress.hidden = false
  elements.enter.href = CONFIG.frontendUrl
  startedAt = Date.now()
  nextCheckAt = startedAt
  states.frontend = SERVICE_STATE.STARTING
  states.backend = SERVICE_STATE.STARTING
  renderBadges()
  countdownTimer = setInterval(renderCountdown, 1000)
  renderCountdown()
  elements.title.focus()
  poll()
}

elements.start.addEventListener('click', start)
renderBadges()
