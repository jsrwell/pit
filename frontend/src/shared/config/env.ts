export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  appVersion: import.meta.env.VITE_APP_VERSION ?? '0.0.0-dev',
} as const
