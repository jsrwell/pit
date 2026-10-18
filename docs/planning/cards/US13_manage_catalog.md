---
code: "US13"
name: "Manter o catálogo atualizado"
status: "implemented"
history: []
---

# US13 — Manter o catálogo atualizado

## História

Como **administrador**, eu quero cadastrar, editar e inativar produtos do catálogo, para que possa garantir que a vitrine reflita corretamente a loja.

- **Requerente:** Administrador
- **Prioridade:** A
- **Estimativa:** 8 pontos (~28h)
- **Eixo:** Administração

O catálogo é a interface entre marketing e operação. Desatualizado, o sistema perde credibilidade.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir cadastrar nome, categoria, descrição, preço, imagem e disponibilidade.
- **CA#2:** O sistema deve permitir editar informações de um produto já existente.
- **CA#3:** O sistema deve permitir inativar produto sem apagar seu histórico administrativo.

## Regras de negócio

- **RN#1:** Todo produto deve possuir dados mínimos obrigatórios antes de ser publicado.
- **RN#2:** Produto inativo não deve aparecer como opção comprável na vitrine.

## Requisito não funcional

- **RNF#1:** O painel administrativo deve ser organizado e de fácil operação.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar CRUD completo de produtos no backend | 8h | Concluída |
| 2 | Desenvolver painel administrativo de catálogo | 10h | Concluída |
| 3 | Implementar upload e gerenciamento de imagens | 6h | Concluída |
| 4 | Escrever testes do CRUD de produtos | 4h | Concluída |
| **Total** | | **28h** | |

## Relacionamentos

- Fornece dados para [US01](./US01_explore_storefront.md), [US02](./US02_filter_products.md) e [US03](./US03_view_product_details.md).
- Complementa o controle de disponibilidade de [US14](./US14_manage_availability.md).
- Seus produtos podem receber campanhas em [US16](./US16_manage_promotions.md).

## Navegação

[Anterior: US12](./US12_custom_order.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US14](./US14_manage_availability.md)
