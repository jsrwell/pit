import { ApiStatus } from '@/features/system/components/ApiStatus'
import { env } from '@/shared/config/env'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p className="brand__name">Cupcakes Gourmet</p>
          <p className="site-footer__text">Confeitaria artesanal, feita à mão todos os dias.</p>
        </div>
        <div className="site-footer__meta">
          <ApiStatus />
          <p>Versão {env.appVersion}</p>
        </div>
      </div>
    </footer>
  )
}
