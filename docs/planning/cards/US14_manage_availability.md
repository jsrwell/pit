---
code: "US14"
name: "Controlar disponibilidade operacional dos produtos"
status: "implemented"
history: []
---

# US14 — Controlar disponibilidade operacional dos produtos

## História

Como **administrador**, eu quero atualizar estoque lógico e disponibilidade de venda, para que possa manter coerência entre o que a vitrine exibe e o que a loja consegue vender.

- **Requerente:** Administrador
- **Prioridade:** A
- **Estimativa:** 5 pontos (~17h)
- **Eixo:** Administração

Não é controle industrial complexo, mas preserva coerência entre vitrine e capacidade real.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir marcar produtos como disponíveis ou indisponíveis.
- **CA#2:** A alteração deve refletir na vitrine e no fluxo de compra.
- **CA#3:** O sistema deve impedir inclusão no carrinho de itens indisponíveis.

## Regras de negócio

- **RN#1:** A disponibilidade atual deve prevalecer sobre qualquer estado anterior salvo no carrinho.
- **RN#2:** Produtos indisponíveis podem continuar visíveis, mas não compráveis, quando a loja optar.

## Requisito não funcional

- **RNF#1:** A atualização administrativa deve se propagar com rapidez e sem inconsistência.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoint de controle de disponibilidade | 4h | Concluída |
| 2 | Desenvolver controle de disponibilidade no painel administrativo | 6h | Concluída |
| 3 | Implementar propagação para vitrine e carrinho | 4h | Concluída |
| 4 | Escrever testes de disponibilidade | 3h | Concluída |
| **Total** | | **17h** | |

## Relacionamentos

- Opera sobre os produtos mantidos em [US13](./US13_manage_catalog.md).
- Propaga estado para [US01](./US01_explore_storefront.md), [US02](./US02_filter_products.md), [US03](./US03_view_product_details.md), [US06](./US06_add_to_cart.md) e [US07](./US07_update_cart.md).

## Navegação

[Anterior: US13](./US13_manage_catalog.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US15](./US15_manage_orders.md)
