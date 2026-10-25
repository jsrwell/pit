import { useState, type FormEvent } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextField } from '@/shared/components/TextField'
import { formatDateTime } from '@/shared/format/date-time'
import { fromLocalInput } from '@/shared/format/date-time-input'
import { useAsync } from '@/shared/hooks/use-async'
import { useSubmit } from '@/shared/hooks/use-submit'

import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  setCouponActive,
  type Coupon,
} from '../../api/promotions'

interface FormValues {
  code: string
  discount_percent: string
  starts_at: string
  ends_at: string
}

const EMPTY: FormValues = { code: '', discount_percent: '', starts_at: '', ends_at: '' }

const COUPON_CODE_MAX_LENGTH = 30

function CouponSituation({ coupon }: { coupon: Coupon }) {
  if (coupon.is_running) return <span className="badge badge--success">Em vigor</span>
  if (!coupon.is_active) return <span className="badge badge--muted">Desativado</span>
  return <span className="badge">Fora da vigência</span>
}

export function CouponManager() {
  const { state, reload } = useAsync(listCoupons)
  const [values, setValues] = useState<FormValues>(EMPTY)
  const save = useSubmit(createCoupon)
  const change = useSubmit(async (action: () => Promise<unknown>) => action())

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const saved = await save.submit({
      code: values.code.trim(),
      discount_percent: Number(values.discount_percent),
      starts_at: fromLocalInput(values.starts_at),
      ends_at: fromLocalInput(values.ends_at),
      is_active: true,
    })
    if (saved !== null) {
      setValues(EMPTY)
      reload()
    }
  }

  async function run(action: () => Promise<unknown>) {
    if ((await change.submit(action)) !== null) reload()
  }

  return (
    <section className="stack" aria-labelledby="coupons-heading">
      <h3 className="subsection-title" id="coupons-heading">
        Cupons de desconto
      </h3>
      <p className="muted">
        O cliente informa o código no checkout e recebe o percentual sobre os itens, sem alcançar a
        taxa de entrega. Um cupom por pedido, somado aos preços promocionais em vigor.
      </p>
      <form className="form panel" onSubmit={handleSubmit} noValidate aria-label="Novo cupom">
        {save.error && <ErrorMessage message={save.error} />}
        <div className="form-grid form-grid--two">
          <TextField
            id="coupon-code"
            label="Código"
            placeholder="DOCE10"
            autoCapitalize="characters"
            maxLength={COUPON_CODE_MAX_LENGTH}
            hint="Letras, números, hífen ou sublinhado, de 3 a 30 caracteres."
            value={values.code}
            error={save.fields.code}
            onChange={(event) => update('code', event.target.value.toUpperCase())}
          />
          <TextField
            id="coupon-percent"
            label="Desconto (%)"
            type="number"
            min="1"
            max="100"
            step="1"
            inputMode="numeric"
            value={values.discount_percent}
            error={save.fields.discount_percent}
            onChange={(event) => update('discount_percent', event.target.value)}
          />
        </div>
        <div className="form-grid form-grid--two">
          <TextField
            id="coupon-start"
            label="Início"
            type="datetime-local"
            value={values.starts_at}
            error={save.fields.starts_at}
            onChange={(event) => update('starts_at', event.target.value)}
          />
          <TextField
            id="coupon-end"
            label="Fim"
            type="datetime-local"
            value={values.ends_at}
            error={save.fields.ends_at}
            onChange={(event) => update('ends_at', event.target.value)}
          />
        </div>
        <div className="row">
          <button type="submit" className="button" disabled={save.submitting}>
            Criar cupom
          </button>
        </div>
      </form>
      {change.error && <ErrorMessage message={change.error} />}
      <AsyncContent state={state} loadingLabel="Carregando cupons...">
        {(coupons) =>
          coupons.length === 0 ? (
            <p className="empty-panel">Nenhum cupom cadastrado.</p>
          ) : (
            <div className="table-wrap panel">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Desconto</th>
                    <th scope="col">Vigência</th>
                    <th scope="col">Situação</th>
                    <th scope="col">
                      <span className="visually-hidden">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>
                        <code className="coupon-code">{coupon.code}</code>
                      </td>
                      <td>{coupon.discount_percent}%</td>
                      <td>
                        {formatDateTime(coupon.starts_at)} a {formatDateTime(coupon.ends_at)}
                      </td>
                      <td>
                        <CouponSituation coupon={coupon} />
                      </td>
                      <td>
                        <div className="row">
                          <button
                            type="button"
                            className="link-button"
                            disabled={change.submitting}
                            onClick={() => run(() => setCouponActive(coupon.id, !coupon.is_active))}
                          >
                            {coupon.is_active ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            type="button"
                            className="link-button"
                            disabled={change.submitting}
                            onClick={() => run(() => deleteCoupon(coupon.id))}
                          >
                            Excluir
                          </button>
                        </div>
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
