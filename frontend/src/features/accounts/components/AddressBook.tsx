import { useState } from 'react'

import { ApiError } from '@/shared/api/api-error'
import { AsyncContent } from '@/shared/components/AsyncContent'
import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { useAsync } from '@/shared/hooks/use-async'

import {
  deleteAddress,
  formatAddress,
  listAddresses,
  makePrimary,
  type Address,
} from '../api/addresses'
import { AddressForm } from './AddressForm'

import './accounts.css'

type Editing = { kind: 'none' } | { kind: 'new' } | { kind: 'edit'; address: Address }

export function AddressBook() {
  const { state, reload } = useAsync(listAddresses)
  const [editing, setEditing] = useState<Editing>({ kind: 'none' })
  const [actionError, setActionError] = useState<string | null>(null)

  async function run(action: () => Promise<unknown>) {
    setActionError(null)
    try {
      await action()
      reload()
    } catch (error: unknown) {
      setActionError(ApiError.from(error).message)
    }
  }

  function closeForm() {
    setEditing({ kind: 'none' })
    reload()
  }

  return (
    <section className="stack" aria-labelledby="addresses-heading">
      <div className="row row--between">
        <h2 id="addresses-heading">Endereços de entrega</h2>
        {editing.kind === 'none' && (
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setEditing({ kind: 'new' })}
          >
            Novo endereço
          </button>
        )}
      </div>
      {actionError && <ErrorMessage message={actionError} />}
      {editing.kind !== 'none' && (
        <AddressForm
          address={editing.kind === 'edit' ? editing.address : undefined}
          onSaved={closeForm}
          onCancel={() => setEditing({ kind: 'none' })}
        />
      )}
      <AsyncContent state={state} loadingLabel="Carregando endereços...">
        {(addresses) =>
          addresses.length === 0 ? (
            <p className="muted">Nenhum endereço cadastrado ainda.</p>
          ) : (
            <ul className="address-list">
              {addresses.map((address) => (
                <li key={address.id} className="panel address-card">
                  <div className="row row--between">
                    <strong>{address.label || 'Endereço'}</strong>
                    {address.is_primary && <span className="badge badge--gold">Principal</span>}
                  </div>
                  <p>{formatAddress(address)}</p>
                  {address.reference && <p className="muted">Referência: {address.reference}</p>}
                  <div className="row">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => setEditing({ kind: 'edit', address })}
                    >
                      Editar
                    </button>
                    {!address.is_primary && (
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => run(() => makePrimary(address.id))}
                      >
                        Tornar principal
                      </button>
                    )}
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => run(() => deleteAddress(address.id))}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </AsyncContent>
    </section>
  )
}
