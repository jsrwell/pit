/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_STORE_WHATSAPP?: string
  readonly VITE_STORE_PHONE?: string
  readonly VITE_STORE_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
