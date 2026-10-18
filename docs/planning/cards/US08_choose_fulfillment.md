---
code: "US08"
name: "Definir a modalidade de recebimento"
status: "implemented"
history: []
---

# US08 — Definir a modalidade de recebimento

## História

Como **cliente cadastrado**, eu quero escolher entre retirada na loja e entrega, para que possa receber meu pedido da forma mais conveniente para mim.

- **Requerente:** Cliente cadastrado
- **Prioridade:** A
- **Estimativa:** 3 pontos (~17h)
- **Eixo:** Carrinho e pedido

Altera o fluxo do pedido e impacta valor final, coleta de dados e operação logística.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir escolher retirada na loja ou entrega.
- **CA#2:** O sistema deve adaptar o fluxo conforme a opção selecionada.
- **CA#3:** O sistema deve refletir corretamente a incidência ou não de taxa de entrega.

## Regras de negócio

- **RN#1:** Pedidos por retirada não exigem endereço de entrega.
- **RN#2:** Pedidos por entrega exigem endereço válido cadastrado.

## Requisito não funcional

- **RNF#1:** A diferença entre as modalidades deve ser exibida de forma clara.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar lógica de modalidade de recebimento no backend | 4h | Concluída |
| 2 | Desenvolver seletor de retirada/entrega com adaptação de fluxo | 6h | Concluída |
| 3 | Implementar cálculo condicional de taxa de entrega | 4h | Concluída |
| 4 | Escrever testes de modalidade | 3h | Concluída |
| **Total** | | **17h** | |

## Relacionamentos

- Para entrega, requer o endereço de [US09](./US09_manage_delivery_address.md).
- Altera totais e validações do checkout em [US10](./US10_secure_checkout.md).
- Define informações operacionais usadas em [US15](./US15_manage_orders.md).

## Navegação

[Anterior: US07](./US07_update_cart.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US09](./US09_manage_delivery_address.md)
