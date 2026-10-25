---
code: "IMP02"
name: "Favoritar produtos na vitrine"
status: "implemented"
history: []
---

# IMP02 — Favoritar produtos na vitrine

## Solicitação

Como **cliente visitante**, eu quero marcar cupcakes como favoritos com um ícone de coração, para que os encontre rapidamente na próxima vez que entrar no site.

- **Origem:** [REV01](./ORIGINAL_REVISIONS.md#rev01)
- **Prioridade:** B
- **Estimativa:** 3 pontos (~7h)
- **Eixo:** Vitrine e descoberta

Os favoritos ficam guardados no próprio navegador, sem novo modelo nem rota na API, o que atende ao pedido sem exigir conta.

## Critérios de aceitação

- **CA#1:** O card da vitrine e o detalhe do produto devem exibir um botão de coração que marca e desmarca o produto como favorito.
- **CA#2:** A vitrine deve oferecer a opção "Favoritos", que exibe apenas os produtos marcados.
- **CA#3:** Os favoritos devem continuar marcados ao fechar e reabrir o site no mesmo navegador.

## Regras de negócio

- **RN#1:** Os favoritos são guardados no `localStorage` do navegador, como lista de identificadores de produto.
- **RN#2:** Produtos favoritados que deixarem de estar ativos não aparecem na opção "Favoritos".
- **RN#3:** Se o armazenamento do navegador estiver indisponível, a vitrine funciona normalmente, sem a opção de favoritos persistida.

## Requisito não funcional

- **RNF#1:** O botão de coração deve ter rótulo acessível que indique o estado atual ("Adicionar aos favoritos" ou "Remover dos favoritos").

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Criar armazenamento de favoritos no navegador no módulo de catálogo do frontend | 2h | Concluída |
| 2 | Adicionar o botão de coração ao card e ao detalhe do produto | 2h | Concluída |
| 3 | Adicionar a opção "Favoritos" à barra de filtros da vitrine | 1h | Concluída |
| 4 | Escrever testes de marcação, persistência e filtro de favoritos | 2h | Concluída |
| **Total** | | **7h** | |

## Relacionamentos

- Amplia a vitrine de [US01](../cards/US01_explore_storefront.md), o detalhe de [US03](../cards/US03_view_product_details.md) e os filtros de [US02](../cards/US02_filter_products.md).

## Navegação

[Anterior: IMP01](./IMP01_round_add_buttons.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP03](./IMP03_filter_loading_feedback.md)
