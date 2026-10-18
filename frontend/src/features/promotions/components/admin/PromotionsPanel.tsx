import { AsyncContent } from '@/shared/components/AsyncContent'
import { useAsync } from '@/shared/hooks/use-async'

import { listAllProducts } from '../../api/promotions'
import { ComboManager } from './ComboManager'
import { FeaturedManager } from './FeaturedManager'
import { PromotionManager } from './PromotionManager'

import '../promotions.css'

export function PromotionsPanel() {
  const { state, reload } = useAsync(listAllProducts)

  return (
    <AsyncContent state={state} loadingLabel="Carregando produtos...">
      {(products) => (
        <div className="admin-split">
          <PromotionManager products={products} />
          <ComboManager products={products} />
          <FeaturedManager products={products} onChanged={reload} />
        </div>
      )}
    </AsyncContent>
  )
}
