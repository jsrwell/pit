import { useCallback } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { useAsync } from '@/shared/hooks/use-async'

import { getAdminProduct, type AdminProduct } from '../../api/admin-products'
import { ProductForm } from './ProductForm'

interface ProductEditorProps {
  productId: number
  onSaved: (product: AdminProduct) => void
}

export function ProductEditor({ productId, onSaved }: ProductEditorProps) {
  const load = useCallback(() => getAdminProduct(productId), [productId])
  const { state } = useAsync(load)

  return (
    <AsyncContent state={state} loadingLabel="Carregando produto...">
      {(product) => <ProductForm product={product} onSaved={onSaved} />}
    </AsyncContent>
  )
}
