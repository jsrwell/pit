---
code: "US09"
name: "Registrar endereço para entrega"
status: "implemented"
history: []
---

# US09 — Registrar endereço para entrega

## História

Como **cliente cadastrado**, eu quero cadastrar e selecionar endereços de entrega, para que possa garantir que meu pedido chegue no local correto sem erros de logística.

- **Requerente:** Cliente cadastrado
- **Prioridade:** A
- **Estimativa:** 5 pontos (~20h)
- **Eixo:** Entrega e logística

Endereço mal especificado é fonte direta de erro operacional.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir cadastrar CEP, rua, número, complemento, bairro e referência.
- **CA#2:** O sistema deve validar os campos obrigatórios do endereço.
- **CA#3:** O sistema deve permitir definir um endereço principal.

## Regras de negócio

- **RN#1:** O endereço escolhido para entrega deve estar completo e válido.
- **RN#2:** O cliente pode manter mais de um endereço cadastrado.

## Requisito não funcional

- **RNF#1:** O formulário deve ser simples, legível e adequado ao uso em smartphone.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar CRUD de endereços no backend | 6h | Concluída |
| 2 | Desenvolver tela de cadastro de endereço com validação | 8h | Concluída |
| 3 | Implementar seleção de endereço principal | 3h | Concluída |
| 4 | Escrever testes de endereço | 3h | Concluída |
| **Total** | | **20h** | |

## Relacionamentos

- Requer a conta de cliente de [US04](./US04_create_account.md).
- É obrigatório quando [US08](./US08_choose_fulfillment.md) seleciona entrega.
- É validado na conclusão da compra em [US10](./US10_secure_checkout.md).

## Navegação

[Anterior: US08](./US08_choose_fulfillment.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US10](./US10_secure_checkout.md)
