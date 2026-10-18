import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { useSubmit } from '@/shared/hooks/use-submit'

import { setFeatured, type ProductOption } from '../../api/promotions'

interface FeaturedManagerProps {
  products: ProductOption[]
  onChanged: () => void
}

export function FeaturedManager({ products, onChanged }: FeaturedManagerProps) {
  const { submit, submitting, error } = useSubmit(setFeatured)

  async function toggle(product: ProductOption) {
    if ((await submit(product.id, !product.is_featured)) !== null) onChanged()
  }

  return (
    <section className="stack" aria-labelledby="featured-admin-heading">
      <h3 className="subsection-title" id="featured-admin-heading">
        Destaques da vitrine
      </h3>
      {error && <ErrorMessage message={error} />}
      <div className="panel">
        <ul className="featured-list">
          {products.map((product) => (
            <li key={product.id}>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={product.is_featured}
                  disabled={submitting}
                  onChange={() => toggle(product)}
                />
                {product.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
