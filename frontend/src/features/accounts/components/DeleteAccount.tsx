import { useState } from 'react'

import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { useSubmit } from '@/shared/hooks/use-submit'

import { deleteMyAccount } from '../api/manage-account'

interface DeleteAccountProps {
  onDeleted: () => void
}

export function DeleteAccount({ onDeleted }: DeleteAccountProps) {
  const [confirming, setConfirming] = useState(false)
  const [understood, setUnderstood] = useState(false)
  const { submit, submitting, error, reset } = useSubmit(deleteMyAccount)

  function cancel() {
    setConfirming(false)
    setUnderstood(false)
    reset()
  }

  async function handleDelete() {
    if ((await submit()) !== null) onDeleted()
  }

  return (
    <section className="panel account-section account-danger" aria-labelledby="delete-heading">
      <div className="account-section__heading">
        <span className="eyebrow">Privacidade</span>
        <h2 id="delete-heading">Excluir conta</h2>
        <p className="muted">
          Seus dados pessoais e endereços são apagados e você é desconectado. Os pedidos continuam
          no histórico da loja, sem seu nome, e-mail ou telefone. Pedidos em andamento precisam ser
          concluídos ou cancelados antes.
        </p>
      </div>
      {error && <ErrorMessage message={error} />}
      {confirming ? (
        <div className="account-danger__confirm" role="group" aria-label="Confirmar exclusão">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={understood}
              onChange={(event) => setUnderstood(event.target.checked)}
            />
            Entendo que a exclusão não pode ser desfeita.
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="button button--danger"
              disabled={!understood || submitting}
              onClick={handleDelete}
            >
              {submitting ? 'Excluindo...' : 'Excluir definitivamente'}
            </button>
            <button type="button" className="button button--ghost" onClick={cancel}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="form-actions">
          <button
            type="button"
            className="button button--danger"
            onClick={() => setConfirming(true)}
          >
            Excluir minha conta
          </button>
        </div>
      )}
    </section>
  )
}
