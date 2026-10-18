---
code: "US15"
name: "Orquestrar a operação dos pedidos"
status: "implemented"
history: []
---

# US15 — Orquestrar a operação dos pedidos

## História

Como **administrador**, eu quero visualizar pedidos e atualizar seu status operacional, para que possa controlar o fluxo de produção, embalagem e entrega de forma organizada.

- **Requerente:** Administrador
- **Prioridade:** A
- **Estimativa:** 8 pontos (~28h)
- **Eixo:** Administração

Espinha dorsal interna do app. Conecta venda, produção, embalagem, prontidão e entrega.

## Critérios de aceitação

- **CA#1:** O sistema deve listar os pedidos recebidos com dados principais do cliente e do pedido.
- **CA#2:** O sistema deve permitir atualizar o status do pedido ao longo do fluxo operacional.
- **CA#3:** O sistema deve permitir consultar a modalidade de recebimento e observações do cliente.

## Regras de negócio

- **RN#1:** O pedido deve seguir uma progressão lógica de estados.
- **RN#2:** O status final só pode ser aplicado após o cumprimento das etapas anteriores pertinentes.

## Requisito não funcional

- **RNF#1:** O painel operacional deve ser claro o suficiente para uso contínuo durante o expediente.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoints de listagem e atualização de status de pedidos | 8h | Concluída |
| 2 | Desenvolver painel operacional de gestão de pedidos | 10h | Concluída |
| 3 | Implementar máquina de estados do pedido | 6h | Concluída |
| 4 | Escrever testes do fluxo operacional | 4h | Concluída |
| **Total** | | **28h** | |

## Relacionamentos

- Recebe pedidos comuns de [US10](./US10_secure_checkout.md) e solicitações especiais de [US12](./US12_custom_order.md).
- Usa a modalidade escolhida em [US08](./US08_choose_fulfillment.md).
- Suas mudanças de status alimentam [US11](./US11_track_order.md).

## Navegação

[Anterior: US14](./US14_manage_availability.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US16](./US16_manage_promotions.md)
