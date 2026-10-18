---
code: "US02"
name: "Refinar a busca por cupcakes"
status: "implemented"
history: []
---

# US02 — Refinar a busca por cupcakes

## História

Como **cliente visitante**, eu quero filtrar e localizar produtos por critérios relevantes, para que possa encontrar rapidamente o cupcake desejado sem percorrer todo o catálogo.

- **Requerente:** Cliente visitante
- **Prioridade:** B
- **Estimativa:** 3 pontos (~16h)
- **Eixo:** Vitrine e descoberta

A busca reduz ruído e acelera a decisão. Diminui abandono por excesso de opções.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir filtrar produtos por categoria.
- **CA#2:** O sistema deve permitir filtrar por sabor e faixa de preço.
- **CA#3:** O sistema deve permitir pesquisa textual por nome do cupcake.

## Regras de negócio

- **RN#1:** Os filtros devem considerar apenas produtos ativos no catálogo.
- **RN#2:** O resultado da busca deve refletir a disponibilidade atual do item.

## Requisito não funcional

- **RNF#1:** O retorno dos filtros deve ocorrer de forma rápida e sem confundir o usuário.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoint de filtro por categoria, sabor e faixa de preço | 6h | Concluída |
| 2 | Desenvolver componente de barra de filtros e busca textual | 6h | Concluída |
| 3 | Escrever testes dos filtros e busca | 4h | Concluída |
| **Total** | | **16h** | |

## Relacionamentos

- Refina a vitrine de [US01](./US01_explore_storefront.md).
- Usa o catálogo mantido por [US13](./US13_manage_catalog.md) e a disponibilidade de [US14](./US14_manage_availability.md).

## Navegação

[Anterior: US01](./US01_explore_storefront.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US03](./US03_view_product_details.md)
