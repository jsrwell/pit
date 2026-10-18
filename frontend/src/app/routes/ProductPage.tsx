import { useParams } from 'react-router'

import { ProductDetailView } from '@/features/catalog/components/ProductDetailView'

export function ProductPage() {
  const { productId } = useParams()

  return (
    <div className="container page">
      <ProductDetailView productId={Number(productId)} />
    </div>
  )
}
