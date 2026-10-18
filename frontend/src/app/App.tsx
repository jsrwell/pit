import { ApiStatus } from '@/features/system/components/ApiStatus'
import { env } from '@/shared/config/env'

export function App() {
  return (
    <main className="app">
      <h1>Cupcakes Gourmet</h1>
      <ApiStatus />
      <footer>Versão {env.appVersion}</footer>
    </main>
  )
}
