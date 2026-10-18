---
code: "US12"
name: "Solicitar encomenda personalizada"
status: "implemented"
history: []
---

# US12 — Solicitar encomenda personalizada

## História

Como **cliente cadastrado**, eu quero registrar pedido especial para evento ou data específica, para que possa encomendar cupcakes sob medida para ocasiões que exigem personalização.

- **Requerente:** Cliente cadastrado
- **Prioridade:** B
- **Estimativa:** 8 pontos (~24h)
- **Eixo:** Carrinho e pedido

Amplia o escopo comercial para ticket médio maior sob demanda.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir informar quantidade, data desejada e observações do pedido especial.
- **CA#2:** O sistema deve registrar o pedido personalizado de forma separada do pedido comum.
- **CA#3:** O sistema deve permitir posterior análise e aprovação pela loja.

## Regras de negócio

- **RN#1:** Encomendas especiais devem respeitar antecedência mínima definida pela loja.
- **RN#2:** Pedidos personalizados podem depender de validação manual antes da confirmação final.

## Requisito não funcional

- **RNF#1:** O formulário de solicitação deve ser objetivo e fácil de preencher.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar modelo e endpoint de encomenda personalizada | 6h | Concluída |
| 2 | Desenvolver formulário de solicitação especial | 8h | Concluída |
| 3 | Implementar fluxo de análise e aprovação pela loja | 6h | Concluída |
| 4 | Escrever testes de encomenda | 4h | Concluída |
| **Total** | | **24h** | |

## Relacionamentos

- Requer cliente cadastrado e autenticado por [US04](./US04_create_account.md) e [US05](./US05_secure_login.md).
- A análise operacional se relaciona com a gestão de pedidos de [US15](./US15_manage_orders.md).

## Navegação

[Anterior: US11](./US11_track_order.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US13](./US13_manage_catalog.md)
