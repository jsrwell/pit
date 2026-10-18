import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { PriceTag } from '@/shared/components/PriceTag'

import type { ProductSummary } from '../api/product'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  product: ProductSummary
  action?: ReactNode
}

export function ProductCard({ product, action }: ProductCardProps) {
  const classes = ['product-card']
  if (product.is_featured) classes.push('product-card--featured')
  if (!product.is_available) classes.push('product-card--unavailable')

  return (
    <article className={classes.join(' ')} aria-label={product.name}>
      <Link to={`/produtos/${product.id}`} className="product-card__media">
        <ProductImage imageId={product.image_id} name={product.name} />
        <span className="product-card__badges">
          {product.is_featured && <span className="badge badge--gold">Destaque</span>}
          {product.promotional_price && <span className="badge badge--success">Promoção</span>}
          {!product.is_available && <span className="badge badge--muted">Indisponível</span>}
        </span>
      </Link>
      <div className="product-card__body">
        <span className="eyebrow">{product.category.name}</span>
        <h3>
          <Link to={`/produtos/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__flavor">{product.flavor.name}</p>
        <div className="product-card__footer">
          <PriceTag price={product.price} promotionalPrice={product.promotional_price} />
          {action}
        </div>
      </div>
    </article>
  )
}
