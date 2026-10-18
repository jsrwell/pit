---
code: "US10"
name: "Concluir a compra com segurança"
status: "implemented"
history: []
---

# US10 — Concluir a compra com segurança

## História

Como **cliente cadastrado**, eu quero finalizar o pedido e selecionar a forma de pagamento, para que possa efetivar minha compra com clareza sobre itens, valores e forma de pagamento.

- **Requerente:** Cliente cadastrado
- **Prioridade:** A
- **Estimativa:** 8 pontos (~34h)
- **Eixo:** Carrinho e pedido

Ponto de fechamento comercial. O sistema precisa eliminar ambiguidade e transmitir segurança.

## Critérios de aceitação

- **CA#1:** O sistema deve apresentar resumo final dos itens do pedido.
- **CA#2:** O sistema deve exibir valor total, incluindo eventual taxa de entrega.
- **CA#3:** O sistema deve permitir selecionar a forma de pagamento e confirmar o pedido.

## Regras de negócio

- **RN#1:** O pedido só pode ser concluído com carrinho válido e modalidade de recebimento definida.
- **RN#2:** O valor final deve refletir exatamente os itens ativos, quantidades e taxa aplicável.

## Requisito não funcional

- **RNF#1:** O fluxo de checkout deve ser seguro, claro e consistente.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoint de finalização de pedido com validações | 8h | Concluída |
| 2 | Desenvolver tela de checkout com resumo, total e seleção de pagamento | 10h | Concluída |
| 3 | Implementar integração com meio de pagamento | 10h | Concluída |
| 4 | Escrever testes do fluxo de checkout | 6h | Concluída |
| **Total** | | **34h** | |

## Relacionamentos

- Requer carrinho válido de [US06](./US06_add_to_cart.md)/[US07](./US07_update_cart.md) e modalidade de [US08](./US08_choose_fulfillment.md).
- Para entrega, usa o endereço de [US09](./US09_manage_delivery_address.md).
- Gera o pedido acompanhado em [US11](./US11_track_order.md) e operado em [US15](./US15_manage_orders.md).

## Navegação

[Anterior: US09](./US09_manage_delivery_address.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US11](./US11_track_order.md)
