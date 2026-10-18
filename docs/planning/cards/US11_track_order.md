---
code: "US11"
name: "Acompanhar a evolução do pedido"
status: "implemented"
history: []
---

# US11 — Acompanhar a evolução do pedido

## História

Como **cliente cadastrado**, eu quero consultar o status do pedido após a compra, para que possa saber em que etapa meu pedido se encontra sem precisar contatar a loja.

- **Requerente:** Cliente cadastrado
- **Prioridade:** A
- **Estimativa:** 5 pontos (~19h)
- **Eixo:** Entrega e logística

A pós-compra precisa continuar transmitindo controle. Reduz ansiedade e diminui dependência de contato manual.

## Critérios de aceitação

- **CA#1:** O sistema deve exibir o status atual do pedido.
- **CA#2:** O sistema deve mostrar data e hora de criação do pedido.
- **CA#3:** O sistema deve informar quando o pedido estiver pronto, em rota de entrega ou concluído.

## Regras de negócio

- **RN#1:** Apenas o cliente dono do pedido pode visualizar seu acompanhamento.
- **RN#2:** Toda mudança de status deve ser registrada no sistema.

## Requisito não funcional

- **RNF#1:** As atualizações de status devem ser refletidas com boa consistência.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoint de consulta de status do pedido | 4h | Concluída |
| 2 | Desenvolver tela de acompanhamento com timeline de status | 8h | Concluída |
| 3 | Implementar registro de histórico de mudanças de status | 4h | Concluída |
| 4 | Escrever testes de acompanhamento | 3h | Concluída |
| **Total** | | **19h** | |

## Relacionamentos

- Acompanha o pedido criado por [US10](./US10_secure_checkout.md).
- Reflete as mudanças operacionais realizadas em [US15](./US15_manage_orders.md).

## Navegação

[Anterior: US10](./US10_secure_checkout.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US12](./US12_custom_order.md)
