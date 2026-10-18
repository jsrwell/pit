---
code: "US06"
name: "Iniciar a composição do pedido"
status: "implemented"
history: []
---

# US06 — Iniciar a composição do pedido

## História

Como **cliente cadastrado**, eu quero adicionar cupcakes ao carrinho, para que possa reunir os produtos que desejo comprar antes de finalizar o pedido.

- **Requerente:** Cliente cadastrado
- **Prioridade:** A
- **Estimativa:** 3 pontos (~18h)
- **Eixo:** Carrinho e pedido

Primeira materialização da intenção de compra. O carrinho precisa ser simples, rápido e confiável.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir adicionar um produto ao carrinho a partir do catálogo ou do detalhe.
- **CA#2:** O sistema deve permitir escolher a quantidade do item.
- **CA#3:** O sistema deve atualizar o subtotal após a inclusão do produto.

## Regras de negócio

- **RN#1:** A quantidade mínima por item deve ser 1.
- **RN#2:** Itens indisponíveis não podem ser adicionados ao carrinho.

## Requisito não funcional

- **RNF#1:** A atualização do carrinho deve ser percebida rapidamente pelo usuário.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar estrutura de carrinho no backend | 6h | Concluída |
| 2 | Desenvolver componente de adição ao carrinho com seleção de quantidade | 6h | Concluída |
| 3 | Implementar cálculo de subtotal | 3h | Concluída |
| 4 | Escrever testes do carrinho | 3h | Concluída |
| **Total** | | **18h** | |

## Relacionamentos

- Pode ser iniciada pela vitrine de [US01](./US01_explore_storefront.md) ou pelo detalhe de [US03](./US03_view_product_details.md).
- Respeita a disponibilidade controlada em [US14](./US14_manage_availability.md).
- É continuada pelos ajustes de [US07](./US07_update_cart.md) e pelo checkout de [US10](./US10_secure_checkout.md).

## Navegação

[Anterior: US05](./US05_secure_login.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US07](./US07_update_cart.md)
