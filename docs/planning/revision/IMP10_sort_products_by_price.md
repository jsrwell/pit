---
code: "IMP10"
name: "Ordenar a vitrine por preço"
status: "pending"
history: []
---

# IMP10 — Ordenar a vitrine por preço

## Solicitação

Como **cliente visitante**, eu quero ordenar os cupcakes do mais barato ao mais caro e vice-versa, para que compare preços de forma simples enquanto percorro todas as opções.

- **Origem:** [REV05](./ORIGINAL_REVISIONS.md#rev05)
- **Prioridade:** B
- **Estimativa:** 3 pontos (~7h)
- **Eixo:** Vitrine e descoberta

A barra de filtros pede preço mínimo e máximo, o que reduz a vitrine e exige digitação, embora a variação de preços do catálogo seja pequena.

## Critérios de aceitação

- **CA#1:** A barra de filtros deve oferecer ordenação por "Menor preço" e "Maior preço", além da ordem padrão da vitrine.
- **CA#2:** Os campos de preço mínimo e máximo devem ser removidos da barra de filtros.
- **CA#3:** A ordenação deve funcionar em conjunto com a pesquisa e os filtros de categoria, sabor e favoritos.

## Regras de negócio

- **RN#1:** A ordem padrão continua dando evidência aos produtos em destaque, conforme RN#2 de [US01](../cards/US01_explore_storefront.md).
- **RN#2:** A ordenação considera o preço efetivo, incluindo promoções vigentes.
- **RN#3:** Produtos com o mesmo preço mantêm ordem estável pelo nome.

## Requisito não funcional

- **RNF#1:** A ordenação deve ser feita pela API, sem carregar todo o catálogo para ordenar na interface.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Adicionar parâmetro de ordenação por preço ao endpoint de listagem de produtos | 2h | Pendente |
| 2 | Substituir os campos de faixa de preço pelo seletor de ordenação na barra de filtros | 2h | Pendente |
| 3 | Escrever testes de API e de interface da ordenação | 3h | Pendente |
| **Total** | | **7h** | |

## Relacionamentos

- Altera o CA#2 de [US02](../cards/US02_filter_products.md), que deixa de filtrar por faixa de preço; a implementação deve registrar a mudança no `history` desse cartão.
- Considera os preços promocionais de [US16](../cards/US16_manage_promotions.md).

## Navegação

[Anterior: IMP09](./IMP09_header_search.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP11](./IMP11_autofill_address_by_zip.md)
