import { useState } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { formatPrice } from '@/shared/format/currency'
import { formatDate } from '@/shared/format/date-time'
import { useAsync } from '@/shared/hooks/use-async'

import { CUSTOM_STATUS_LABELS, listMyCustomOrders } from '../api/custom-orders'
import { CustomOrderForm } from './CustomOrderForm'

import './orders.css'

export function CustomOrders() {
  const { state, reload } = useAsync(listMyCustomOrders)
  const [justRequested, setJustRequested] = useState(false)

  return (
    <div className="custom-orders">
      <section className="stack" aria-labelledby="custom-form-heading">
        <h2 id="custom-form-heading">Nova encomenda</h2>
        {justRequested && (
          <p role="status" className="feedback feedback--success">
            Encomenda enviada! A loja vai analisar e responder por aqui.
          </p>
        )}
        <CustomOrderForm
          onRequested={() => {
            setJustRequested(true)
            reload()
          }}
        />
      </section>
      <section className="stack" aria-labelledby="custom-list-heading">
        <h2 id="custom-list-heading">Suas solicitações</h2>
        <AsyncContent state={state} loadingLabel="Carregando encomendas...">
          {(customOrders) =>
            customOrders.length === 0 ? (
              <p className="muted">Nenhuma encomenda solicitada ainda.</p>
            ) : (
              <ul className="order-list">
                {customOrders.map((item) => (
                  <li key={item.id} className="panel stack">
                    <div className="row row--between">
                      <strong>
                        Encomenda nº {item.id} · {item.quantity} unidades
                      </strong>
                      <span
                        className={
                          item.status === 'approved'
                            ? 'badge badge--success'
                            : item.status === 'rejected'
                              ? 'badge badge--muted'
                              : 'badge'
                        }
                      >
                        {CUSTOM_STATUS_LABELS[item.status]}
                      </span>
                    </div>
                    <p>{item.description}</p>
                    <p className="muted">Para {formatDate(item.desired_date)}</p>
                    {item.quoted_price && (
                      <p>
                        Valor proposto: <strong>{formatPrice(item.quoted_price)}</strong>
                      </p>
                    )}
                    {item.store_response && (
                      <p className="feedback feedback--info">{item.store_response}</p>
                    )}
                  </li>
                ))}
              </ul>
            )
          }
        </AsyncContent>
      </section>
    </div>
  )
}
