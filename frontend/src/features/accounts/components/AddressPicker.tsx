import { useEffect, useState } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { useAsync } from '@/shared/hooks/use-async'

import { formatAddress, listAddresses } from '../api/addresses'
import { AddressForm } from './AddressForm'

import './accounts.css'

interface AddressPickerProps {
  selectedId: number | null
  onSelect: (addressId: number | null) => void
}

export function AddressPicker({ selectedId, onSelect }: AddressPickerProps) {
  const { state, reload } = useAsync(listAddresses)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (state.status === 'success' && selectedId === null) {
      const primary = state.data.find((address) => address.is_primary) ?? state.data[0]
      if (primary) onSelect(primary.id)
    }
  }, [state, selectedId, onSelect])

  return (
    <div className="stack">
      <AsyncContent state={state} loadingLabel="Carregando endereços...">
        {(addresses) => (
          <fieldset className="address-picker">
            <legend className="visually-hidden">Endereço de entrega</legend>
            {addresses.length === 0 && (
              <p className="muted">Cadastre um endereço para receber seu pedido.</p>
            )}
            {addresses.map((address) => (
              <label key={address.id} className="choice">
                <input
                  type="radio"
                  name="delivery-address"
                  checked={selectedId === address.id}
                  onChange={() => onSelect(address.id)}
                />
                <span>
                  <strong>{address.label || 'Endereço'}</strong>
                  <span className="muted">{formatAddress(address)}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}
      </AsyncContent>
      {adding ? (
        <AddressForm
          onSaved={(address) => {
            setAdding(false)
            onSelect(address.id)
            reload()
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button type="button" className="link-button" onClick={() => setAdding(true)}>
          Cadastrar novo endereço
        </button>
      )}
    </div>
  )
}
