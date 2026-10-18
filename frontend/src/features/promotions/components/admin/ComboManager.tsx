import { useState, type FormEvent } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextField } from '@/shared/components/TextField'
import { formatPrice } from '@/shared/format/currency'
import { formatDateTime } from '@/shared/format/date-time'
import { fromLocalInput } from '@/shared/format/date-time-input'
import { useAsync } from '@/shared/hooks/use-async'
import { useSubmit } from '@/shared/hooks/use-submit'

import { deleteCombo, listCombos, saveCombo, type ProductOption } from '../../api/promotions'

interface ComboManagerProps {
  products: ProductOption[]
}

interface ItemRow {
  product_id: string
  quantity: string
}

interface FormValues {
  name: string
  description: string
  price: string
  starts_at: string
  ends_at: string
  items: ItemRow[]
}

const EMPTY_ROW: ItemRow = { product_id: '', quantity: '1' }

const EMPTY: FormValues = {
  name: '',
  description: '',
  price: '',
  starts_at: '',
  ends_at: '',
  items: [EMPTY_ROW, EMPTY_ROW],
}

export function ComboManager({ products }: ComboManagerProps) {
  const { state, reload } = useAsync(listCombos)
  const [values, setValues] = useState<FormValues>(EMPTY)
  const save = useSubmit(saveCombo)
  const remove = useSubmit(deleteCombo)
  const names = new Map(products.map((product) => [product.id, product.name]))

  function update(field: Exclude<keyof FormValues, 'items'>, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function updateItem(index: number, row: ItemRow) {
    setValues((current) => ({
      ...current,
      items: current.items.map((item, position) => (position === index ? row : item)),
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const saved = await save.submit({
      name: values.name,
      description: values.description,
      price: values.price,
      starts_at: fromLocalInput(values.starts_at),
      ends_at: fromLocalInput(values.ends_at),
      is_active: true,
      items: values.items
        .filter((item) => item.product_id !== '')
        .map((item) => ({ product_id: Number(item.product_id), quantity: Number(item.quantity) })),
    })
    if (saved !== null) {
      setValues(EMPTY)
      reload()
    }
  }

  async function handleDelete(comboId: number) {
    if ((await remove.submit(comboId)) !== null) reload()
  }

  return (
    <section className="stack" aria-labelledby="combos-admin-heading">
      <h3 className="subsection-title" id="combos-admin-heading">
        Combos promocionais
      </h3>
      <form className="form panel" onSubmit={handleSubmit} noValidate aria-label="Novo combo">
        {save.error && <ErrorMessage message={save.error} />}
        <div className="form-grid">
          <TextField
            id="combo-name"
            label="Nome do combo"
            value={values.name}
            error={save.fields.name}
            onChange={(event) => update('name', event.target.value)}
          />
          <TextField
            id="combo-price"
            label="Preço do combo (R$)"
            type="number"
            min="0.01"
            step="0.01"
            value={values.price}
            error={save.fields.price}
            onChange={(event) => update('price', event.target.value)}
          />
          <TextField
            id="combo-start"
            label="Início do combo"
            type="datetime-local"
            value={values.starts_at}
            error={save.fields.starts_at}
            onChange={(event) => update('starts_at', event.target.value)}
          />
          <TextField
            id="combo-end"
            label="Fim do combo"
            type="datetime-local"
            value={values.ends_at}
            error={save.fields.ends_at}
            onChange={(event) => update('ends_at', event.target.value)}
          />
        </div>
        <TextField
          id="combo-description"
          label="Descrição"
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
        />
        <fieldset className="combo-items-editor">
          <legend className="field-hint">Produtos do combo (mínimo de dois)</legend>
          {values.items.map((item, index) => (
            <div key={index} className="combo-items-editor__row">
              <div className="field">
                <label htmlFor={`combo-item-${index}`}>Produto {index + 1}</label>
                <select
                  id={`combo-item-${index}`}
                  value={item.product_id}
                  onChange={(event) =>
                    updateItem(index, { ...item, product_id: event.target.value })
                  }
                >
                  <option value="">Selecione</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <TextField
                id={`combo-quantity-${index}`}
                label="Qtd."
                type="number"
                min="1"
                value={item.quantity}
                onChange={(event) => updateItem(index, { ...item, quantity: event.target.value })}
              />
            </div>
          ))}
          {save.fields.items && <span className="field-error">{save.fields.items}</span>}
          <button
            type="button"
            className="link-button"
            onClick={() =>
              setValues((current) => ({ ...current, items: [...current.items, EMPTY_ROW] }))
            }
          >
            Adicionar produto
          </button>
        </fieldset>
        <div className="row">
          <button type="submit" className="button" disabled={save.submitting}>
            Criar combo
          </button>
        </div>
      </form>
      {remove.error && <ErrorMessage message={remove.error} />}
      <AsyncContent state={state} loadingLabel="Carregando combos...">
        {(combos) =>
          combos.length === 0 ? (
            <p className="empty-panel">Nenhum combo cadastrado.</p>
          ) : (
            <ul className="order-list">
              {combos.map((combo) => (
                <li key={combo.id} className="panel stack">
                  <div className="row row--between">
                    <strong>
                      {combo.name} · {formatPrice(combo.price)}
                    </strong>
                    {combo.is_running ? (
                      <span className="badge badge--success">Em vigor</span>
                    ) : (
                      <span className="badge">Fora da vigência</span>
                    )}
                  </div>
                  <span className="muted">
                    {combo.items
                      .map(
                        (item) =>
                          `${item.quantity}× ${names.get(item.product_id) ?? `#${item.product_id}`}`,
                      )
                      .join(' + ')}
                  </span>
                  <span className="muted">
                    {formatDateTime(combo.starts_at)} a {formatDateTime(combo.ends_at)}
                  </span>
                  <div>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => handleDelete(combo.id)}
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
