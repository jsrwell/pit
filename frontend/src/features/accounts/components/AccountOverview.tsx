import { AsyncContent } from '@/shared/components/AsyncContent'
import { formatDateTime } from '@/shared/format/date-time'
import { formatPhone } from '@/shared/format/phone'
import { useAsync } from '@/shared/hooks/use-async'

import { getMyAccount } from '../api/get-my-account'

import './accounts.css'

export function AccountOverview() {
  const { state } = useAsync(getMyAccount)

  return (
    <AsyncContent state={state} loadingLabel="Carregando sua conta...">
      {(account) => (
        <section className="panel account-overview" aria-label="Dados da conta">
          <div>
            <span className="eyebrow">Seus dados</span>
            <h2>{account.name}</h2>
          </div>
          <dl className="facts">
            <div>
              <dt>E-mail</dt>
              <dd>{account.email}</dd>
            </div>
            <div>
              <dt>Telefone</dt>
              <dd>{formatPhone(account.phone)}</dd>
            </div>
            <div>
              <dt>Cliente desde</dt>
              <dd>{formatDateTime(account.created_at)}</dd>
            </div>
          </dl>
        </section>
      )}
    </AsyncContent>
  )
}
