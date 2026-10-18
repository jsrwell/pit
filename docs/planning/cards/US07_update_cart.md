---
code: "US07"
name: "Ajustar o pedido antes do fechamento"
status: "pending"
history: []
---

# US07 — Ajustar o pedido antes do fechamento

## História

Como **cliente cadastrado**, eu quero editar ou remover itens do carrinho, para que possa corrigir quantidades ou excluir produtos indesejados antes de finalizar a compra.

- **Requerente:** Cliente cadastrado
- **Prioridade:** A
- **Estimativa:** 3 pontos (~16h)
- **Eixo:** Carrinho e pedido

Reduz erros de compra e evita abandono por falta de flexibilidade.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir aumentar ou reduzir a quantidade de um item.
- **CA#2:** O sistema deve permitir remover item do carrinho.
- **CA#3:** O total do pedido deve ser recalculado automaticamente após qualquer alteração.

## Regras de negócio

- **RN#1:** O sistema não deve manter item com quantidade zero sem remoção explícita.
- **RN#2:** Alterações devem respeitar a disponibilidade atual do produto.

## Requisito não funcional

- **RNF#1:** O recálculo do carrinho deve ocorrer sem comprometer a fluidez da interação.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoints de edição e remoção de itens do carrinho | 4h | A fazer |
| 2 | Desenvolver tela de revisão do carrinho com controles de quantidade | 6h | A fazer |
| 3 | Implementar recálculo automático do total | 3h | A fazer |
| 4 | Escrever testes de edição do carrinho | 3h | A fazer |
| **Total** | | **16h** | |

## Relacionamentos

- Opera sobre o carrinho iniciado em [US06](./US06_add_to_cart.md).
- Respeita a disponibilidade controlada em [US14](./US14_manage_availability.md).
- Prepara o pedido para [US08](./US08_choose_fulfillment.md) e [US10](./US10_secure_checkout.md).

## Navegação

[Anterior: US06](./US06_add_to_cart.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US08](./US08_choose_fulfillment.md)
