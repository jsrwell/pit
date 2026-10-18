import { useCallback, type ReactNode } from 'react'

import { productImageUrl } from '@/shared/api/product-image-url'
import { formatPrice } from '@/shared/format/currency'
import { useAsync } from '@/shared/hooks/use-async'

import {
  listRunningCombos,
  listStorefrontProducts,
  type Combo,
  type ProductOption,
} from '../api/promotions'

import './promotions.css'

interface ComboShowcaseProps {
  renderAction?: (combo: Combo) => ReactNode
}

interface ShowcaseData {
  combos: Combo[]
  products: Map<number, ProductOption>
}

async function loadShowcase(): Promise<ShowcaseData> {
  const [combos, products] = await Promise.all([listRunningCombos(), listStorefrontProducts()])
  return { combos, products: new Map(products.map((product) => [product.id, product])) }
}

function regularPrice(combo: Combo, products: Map<number, ProductOption>): number {
  return combo.items.reduce(
    (total, item) => total + Number(products.get(item.product_id)?.price ?? 0) * item.quantity,
    0,
  )
}

export function ComboShowcase({ renderAction }: ComboShowcaseProps) {
  const load = useCallback(loadShowcase, [])
  const { state } = useAsync(load)

  if (state.status !== 'success' || state.data.combos.length === 0) {
    return null
  }
  const { combos, products } = state.data

  return (
    <section aria-labelledby="combos-heading" className="combos">
      <div className="section-heading">
        <span className="eyebrow">Combinações da casa</span>
        <h2 id="combos-heading">Combos promocionais</h2>
        <p>Monte seu pedido com estas combinações e pague menos pelo conjunto.</p>
      </div>
      <div className="combo-grid">
        {combos.map((combo) => {
          const regular = regularPrice(combo, products)
          return (
            <article key={combo.id} className="combo-card" aria-label={combo.name}>
              <div className="combo-card__images" aria-hidden="true">
                {combo.items.map((item) => {
                  const product = products.get(item.product_id)
                  return product?.image_id ? (
                    <img key={item.product_id} src={productImageUrl(product.image_id)} alt="" />
                  ) : null
                })}
              </div>
              <h3>{combo.name}</h3>
              {combo.description && <p className="muted">{combo.description}</p>}
              <ul className="combo-card__items">
                {combo.items.map((item) => (
                  <li key={item.product_id}>
                    {item.quantity}× {products.get(item.product_id)?.name ?? 'Produto'}
                  </li>
                ))}
              </ul>
              <div className="row row--between">
                <span className="price">
                  {regular > Number(combo.price) && (
                    <s className="price--old">{formatPrice(regular)}</s>
                  )}
                  {formatPrice(combo.price)}
                </span>
                {renderAction?.(combo)}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
