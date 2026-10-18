import { useParams } from 'react-router'

import { AddToCart } from '@/features/cart/components/AddToCart'
import { ProductDetailView } from '@/features/catalog/components/ProductDetailView'

export function ProductPage() {
  const { productId } = useParams()

  return (
    <div className="container page">
      <ProductDetailView
        productId={Number(productId)}
        renderPurchase={(product) => (
          <AddToCart
            productId={product.id}
            productName={product.name}
            available={product.is_available}
            withQuantity
          />
        )}
      />
    </div>
  )
}
