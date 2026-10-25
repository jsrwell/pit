---
code: "US02"
name: "Refinar a busca por cupcakes"
status: "implemented"
history:
  - date: "2026/10/25"
    description: "CA#3 reposicionado: a pesquisa textual sai da barra de filtros e passa ao cabeçalho de todas as páginas, levando à vitrine com o termo na URL, conforme a melhoria IMP09 originada nos testes com usuários."
  - date: "2026/10/25"
    description: "CA#2 alterado: a faixa de preço deixa a barra de filtros e dá lugar à ordenação por menor e maior preço, feita pela API com o preço efetivo, conforme a melhoria IMP10 originada nos testes com usuários."
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
- **CA#2:** O sistema deve permitir filtrar por sabor e ordenar a vitrine do menor para o maior preço e vice-versa ([IMP10](../revision/IMP10_sort_products_by_price.md)).
- **CA#3:** O sistema deve permitir pesquisa textual por nome do cupcake, a partir do campo de busca do cabeçalho ([IMP09](../revision/IMP09_header_search.md)).

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
