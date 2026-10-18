import { useCallback, type ReactNode } from 'react'
import { Link } from 'react-router'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { PriceTag } from '@/shared/components/PriceTag'
import { useAsync } from '@/shared/hooks/use-async'

import { getProduct } from '../api/get-product'
import type { ProductDetail } from '../api/product'
import { ProductImage } from './ProductImage'

import './catalog.css'

interface ProductDetailViewProps {
  productId: number
  renderPurchase?: (product: ProductDetail) => ReactNode
}

export function ProductDetailView({ productId, renderPurchase }: ProductDetailViewProps) {
  const load = useCallback(() => getProduct(productId), [productId])
  const { state } = useAsync(load)

  return (
    <AsyncContent state={state} loadingLabel="Carregando o produto...">
      {(product) => (
        <article className="product-detail">
          <div className="product-detail__media">
            <ProductImage imageId={product.image_id} name={product.name} />
          </div>
          <div className="product-detail__info">
            <Link to="/" className="product-detail__back">
              Voltar à vitrine
            </Link>
            <div className="product-detail__heading">
              <div className="row">
                <span className="eyebrow">{product.category.name}</span>
                {product.is_featured && <span className="badge badge--gold">Destaque</span>}
                {product.promotional_price && (
                  <span className="badge badge--success">Promoção</span>
                )}
              </div>
              <h1>{product.name}</h1>
              <p className="product-detail__flavor">Sabor {product.flavor.name}</p>
            </div>
            <div className="row">
              <PriceTag
                price={product.price}
                promotionalPrice={product.promotional_price}
                className="product-detail__price"
              />
              {product.is_available && (
                <span className="badge badge--success">Disponível para pedido</span>
              )}
            </div>
            {!product.is_available && (
              <p className="feedback feedback--error" role="note">
                Este cupcake está indisponível no momento e não pode ser comprado.
              </p>
            )}
            <p className="product-detail__description">{product.description}</p>
            {renderPurchase && (
              <div className="product-detail__purchase">{renderPurchase(product)}</div>
            )}
            {product.composition !== '' && (
              <section className="product-detail__block">
                <h2>Composição</h2>
                <p>{product.composition}</p>
              </section>
            )}
            {product.highlights.length > 0 && (
              <section className="product-detail__block">
                <h2>Diferenciais</h2>
                <ul className="product-detail__highlights">
                  {product.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </article>
      )}
    </AsyncContent>
  )
}
