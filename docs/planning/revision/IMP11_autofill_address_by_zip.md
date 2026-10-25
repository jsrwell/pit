---
code: "IMP11"
name: "Preencher o endereço a partir do CEP"
status: "pending"
history: []
---

# IMP11 — Preencher o endereço a partir do CEP

## Solicitação

Como **cliente autenticado**, eu quero que o endereço seja preenchido automaticamente ao informar o CEP, para que cadastre o local de entrega mais rápido e com menos erros.

- **Origem:** [REV05](./ORIGINAL_REVISIONS.md#rev05)
- **Prioridade:** B
- **Estimativa:** 3 pontos (~7h)
- **Eixo:** Entrega e logística

O formulário de endereço pede CEP, logradouro e bairro, todos digitados manualmente. A consulta é feita pelo frontend diretamente no serviço público ViaCEP, sem mudança na API.

## Critérios de aceitação

- **CA#1:** Ao completar os 8 dígitos do CEP, o sistema deve consultar o ViaCEP e preencher logradouro e bairro.
- **CA#2:** Os campos preenchidos devem continuar editáveis pelo cliente.
- **CA#3:** Para CEP inexistente ou falha do serviço, o sistema deve avisar no campo e permitir o preenchimento manual.
- **CA#4:** Durante a consulta, o formulário deve indicar que o CEP está sendo pesquisado.

## Regras de negócio

- **RN#1:** A consulta ao CEP é um auxílio; a validação e o armazenamento do endereço continuam sob responsabilidade da API.
- **RN#2:** Valores já digitados pelo cliente não devem ser sobrescritos sem uma nova alteração do CEP.

## Requisito não funcional

- **RNF#1:** A indisponibilidade do serviço externo não pode impedir o cadastro do endereço.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Criar cliente de consulta ao ViaCEP no módulo de contas do frontend | 2h | Pendente |
| 2 | Integrar a consulta ao formulário de endereço com estados de carregamento e erro | 3h | Pendente |
| 3 | Escrever testes do preenchimento, do CEP inexistente e da falha do serviço | 2h | Pendente |
| **Total** | | **7h** | |

## Relacionamentos

- Evolui o cadastro de endereços de [US09](../cards/US09_manage_delivery_address.md); a implementação deve registrar a mudança no `history` desse cartão.
- Agiliza a entrega escolhida em [US08](../cards/US08_choose_fulfillment.md).

## Navegação

[Anterior: IMP10](./IMP10_sort_products_by_price.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md)
