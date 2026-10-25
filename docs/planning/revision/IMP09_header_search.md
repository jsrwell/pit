---
code: "IMP09"
name: "Mover a busca para o menu superior"
status: "implemented"
history: []
---

# IMP09 — Mover a busca para o menu superior

## Solicitação

Como **cliente visitante**, eu quero a barra de pesquisa no menu superior, para que possa buscar de qualquer página enquanto a vitrine fica livre para eu percorrer as opções.

- **Origem:** [REV05](./ORIGINAL_REVISIONS.md#rev05)
- **Prioridade:** C
- **Estimativa:** 2 pontos (~5h)
- **Eixo:** Vitrine e descoberta

A pesquisa textual hoje faz parte da barra de filtros da vitrine. A busca passa para o cabeçalho e leva à vitrine com o termo na URL, sem mudança na API.

## Critérios de aceitação

- **CA#1:** O cabeçalho deve exibir um campo de pesquisa em todas as páginas da loja, inclusive no menu em telas de celular.
- **CA#2:** Ao enviar a pesquisa, o cliente deve ser levado à vitrine filtrada pelo termo, com o termo registrado na URL.
- **CA#3:** A barra de filtros da vitrine deixa de ter campo de pesquisa e passa a exibir o termo ativo com opção de limpá-lo.

## Regras de negócio

- **RN#1:** A pesquisa do cabeçalho combina com os filtros de categoria, sabor, favoritos e a ordenação da vitrine.

## Requisito não funcional

- **RNF#1:** O campo deve ser identificado como região de busca para leitores de tela e caber no cabeçalho sem quebrar o layout móvel.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Criar o campo de pesquisa no cabeçalho com navegação para a vitrine | 2h | Concluída |
| 2 | Ler o termo da URL na vitrine e removê-lo da barra de filtros | 2h | Concluída |
| 3 | Escrever testes da pesquisa pelo cabeçalho | 1h | Concluída |
| **Total** | | **5h** | |

## Relacionamentos

- Reposiciona a pesquisa textual do CA#3 de [US02](../cards/US02_filter_products.md); a implementação deve registrar a mudança no `history` desse cartão.
- Combina com os favoritos de [IMP02](./IMP02_favorite_products.md) e a ordenação de [IMP10](./IMP10_sort_products_by_price.md).

## Navegação

[Anterior: IMP08](./IMP08_manage_own_account.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP10](./IMP10_sort_products_by_price.md)
