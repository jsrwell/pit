import type { FulfillmentMethod } from './quote'
import type { OrderStatus } from './order'

export const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Recebido',
  confirmed: 'Confirmado',
  preparing: 'Em preparo',
  ready: 'Pronto',
  out_for_delivery: 'Em rota de entrega',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

export const FULFILLMENT_LABELS: Record<FulfillmentMethod, string> = {
  pickup: 'Retirada na loja',
  delivery: 'Entrega',
}

export function stagesFor(fulfillment: FulfillmentMethod): OrderStatus[] {
  return fulfillment === 'delivery'
    ? ['received', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed']
    : ['received', 'confirmed', 'preparing', 'ready', 'completed']
}
