import { useState, type FormEvent } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextField } from '@/shared/components/TextField'
import { formatPrice } from '@/shared/format/currency'
import { formatDateTime } from '@/shared/format/date-time'
import { fromLocalInput } from '@/shared/format/date-time-input'
import { useAsync } from '@/shared/hooks/use-async'
import { useSubmit } from '@/shared/hooks/use-submit'

import {
  deletePromotion,
  listPromotions,
  savePromotion,
  type ProductOption,
} from '../../api/promotions'

interface PromotionManagerProps {
  products: ProductOption[]
}

interface FormValues {
  name: string
  product_id: string
  promotional_price: string
  starts_at: string
  ends_at: string
}

const EMPTY: FormValues = {
  name: '',
  product_id: '',
  promotional_price: '',
  starts_at: '',
  ends_at: '',
}

export function PromotionManager({ products }: PromotionManagerProps) {
  const { state, reload } = useAsync(listPromotions)
  const [values, setValues] = useState<FormValues>(EMPTY)
  const save = useSubmit(savePromotion)
  const remove = useSubmit(deletePromotion)
  const names = new Map(products.map((product) => [product.id, product.name]))

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const saved = await save.submit({
      name: values.name,
      product_id: Number(values.product_id),
      promotional_price: values.promotional_price,
      starts_at: fromLocalInput(values.starts_at),
      ends_at: fromLocalInput(values.ends_at),
      is_active: true,
    })
    if (saved !== null) {
      setValues(EMPTY)
      reload()
    }
  }

  async function handleDelete(promotionId: number) {
    if ((await remove.submit(promotionId)) !== null) reload()
  }

  return (
    <section className="stack" aria-labelledby="promotions-heading">
      <h3 id="promotions-heading">Campanhas com preço promocional</h3>
      <form className="form panel" onSubmit={handleSubmit} noValidate aria-label="Nova campanha">
        {save.error && <ErrorMessage message={save.error} />}
        <div className="form-grid">
          <TextField
            id="promotion-name"
            label="Nome da campanha"
            value={values.name}
            error={save.fields.name}
            onChange={(event) => update('name', event.target.value)}
          />
          <div className="field">
            <label htmlFor="promotion-product">Produto</label>
            <select
              id="promotion-product"
              value={values.product_id}
              onChange={(event) => update('product_id', event.target.value)}
            >
              <option value="">Selecione</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({formatPrice(product.price)})
                </option>
              ))}
            </select>
          </div>
          <TextField
            id="promotion-price"
            label="Preço promocional (R$)"
            type="number"
            min="0.01"
            step="0.01"
            value={values.promotional_price}
            error={save.fields.promotional_price}
            onChange={(event) => update('promotional_price', event.target.value)}
          />
          <TextField
            id="promotion-start"
            label="Início"
            type="datetime-local"
            value={values.starts_at}
            error={save.fields.starts_at}
            onChange={(event) => update('starts_at', event.target.value)}
          />
          <TextField
            id="promotion-end"
            label="Fim"
            type="datetime-local"
            value={values.ends_at}
            error={save.fields.ends_at}
            onChange={(event) => update('ends_at', event.target.value)}
          />
        </div>
        <div className="row">
          <button type="submit" className="button" disabled={save.submitting}>
            Criar campanha
          </button>
        </div>
      </form>
      {remove.error && <ErrorMessage message={remove.error} />}
      <AsyncContent state={state} loadingLabel="Carregando campanhas...">
        {(promotions) =>
          promotions.length === 0 ? (
            <p className="muted">Nenhuma campanha cadastrada.</p>
          ) : (
            <div className="table-wrap panel">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Campanha</th>
                    <th scope="col">Produto</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Vigência</th>
                    <th scope="col">Situação</th>
                    <th scope="col">
                      <span className="visually-hidden">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => (
                    <tr key={promotion.id}>
                      <td>{promotion.name}</td>
                      <td>{names.get(promotion.product_id) ?? `#${promotion.product_id}`}</td>
                      <td>{formatPrice(promotion.promotional_price)}</td>
                      <td>
                        {formatDateTime(promotion.starts_at)} a {formatDateTime(promotion.ends_at)}
                      </td>
                      <td>
                        {promotion.is_running ? (
                          <span className="badge badge--success">Em vigor</span>
                        ) : (
                          <span className="badge">Fora da vigência</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => handleDelete(promotion.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </AsyncContent>
    </section>
  )
}
