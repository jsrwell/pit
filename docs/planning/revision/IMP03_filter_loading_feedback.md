---
code: "IMP03"
name: "Indicar progresso ao filtrar produtos"
status: "implemented"
history: []
---

# IMP03 — Indicar progresso ao filtrar produtos

## Solicitação

Como **cliente visitante**, eu quero perceber que a vitrine está sendo atualizada quando aplico filtros ou busco um produto, para que saiba que o sistema respondeu ao meu comando.

- **Origem:** [REV02](./ORIGINAL_REVISIONS.md#rev02)
- **Prioridade:** B
- **Estimativa:** 2 pontos (~5h)
- **Eixo:** Vitrine e descoberta

A vitrine exibe carregamento apenas na primeira abertura; ao alterar filtros, o resultado muda sem nenhum sinal intermediário.

## Critérios de aceitação

- **CA#1:** Enquanto a vitrine busca o resultado de um novo filtro ou pesquisa, deve haver indicação visual de progresso.
- **CA#2:** Os produtos já exibidos devem permanecer visíveis, atenuados, até o novo resultado chegar.
- **CA#3:** A indicação de progresso deve ser anunciada a leitores de tela.

## Regras de negócio

- **RN#1:** A pesquisa textual deve aguardar uma breve pausa na digitação antes de consultar a API, evitando uma requisição por tecla.

## Requisito não funcional

- **RNF#1:** A indicação não deve deslocar o layout da vitrine nem atrasar a exibição do resultado.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Expor o estado de atualização na listagem de produtos e atrasar a busca textual | 2h | Concluída |
| 2 | Exibir indicador de progresso e atenuar a grade durante a atualização | 2h | Concluída |
| 3 | Escrever testes da vitrine durante a atualização dos filtros | 1h | Concluída |
| **Total** | | **5h** | |

## Relacionamentos

- Melhora o retorno dos filtros de [US02](../cards/US02_filter_products.md), em linha com seu RNF#1.
- Vale também para a busca do cabeçalho de [IMP09](./IMP09_header_search.md) e a ordenação de [IMP10](./IMP10_sort_products_by_price.md).

## Navegação

[Anterior: IMP02](./IMP02_favorite_products.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP04](./IMP04_validate_signup_fields.md)
