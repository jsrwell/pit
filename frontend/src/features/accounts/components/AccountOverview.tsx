import { useState } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { formatDateTime } from '@/shared/format/date-time'
import { formatPhone } from '@/shared/format/phone'
import { useAsync } from '@/shared/hooks/use-async'

import { getMyAccount } from '../api/get-my-account'
import { AccountDetailsForm } from './AccountDetailsForm'

import './accounts.css'

export function AccountOverview() {
  const { state, reload } = useAsync(getMyAccount)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <AsyncContent state={state} loadingLabel="Carregando sua conta...">
      {(account) => (
        <section className="panel account-overview" aria-label="Dados da conta">
          <div className="row row--between row--top">
            <div>
              <span className="eyebrow">Seus dados</span>
              <h2>{account.name}</h2>
            </div>
            {!editing && (
              <button
                type="button"
                className="button button--ghost button--small"
                onClick={() => {
                  setSaved(false)
                  setEditing(true)
                }}
              >
                Editar dados
              </button>
            )}
          </div>
          {saved && (
            <p role="status" className="feedback feedback--success">
              Dados atualizados.
            </p>
          )}
          {editing ? (
            <AccountDetailsForm
              account={account}
              onSaved={() => {
                setEditing(false)
                setSaved(true)
                reload()
              }}
              onCancel={() => setEditing(false)}
            />
          ) : (
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
          )}
        </section>
      )}
    </AsyncContent>
  )
}
