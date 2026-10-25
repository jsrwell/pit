---
code: "IMP01"
name: "Arredondar as bordas dos botões de adicionar produtos"
status: "pending"
history: []
---

# IMP01 — Arredondar as bordas dos botões de adicionar produtos

## Solicitação

Como **cliente visitante**, eu quero botões de adicionar produtos com bordas levemente mais arredondadas, para que a vitrine transmita um visual mais suave e coerente com a identidade da confeitaria.

- **Origem:** [REV01](./ORIGINAL_REVISIONS.md#rev01)
- **Prioridade:** C
- **Estimativa:** 1 ponto (~2h)
- **Eixo:** Vitrine e descoberta

Hoje todos os botões usam o mesmo raio pequeno (`--radius-sm`), inclusive os de adicionar ao carrinho.

## Critérios de aceitação

- **CA#1:** Os botões de adicionar produtos ao carrinho, na vitrine e no detalhe do produto, devem exibir bordas mais arredondadas que as atuais.
- **CA#2:** O novo arredondamento deve ser definido por um token de estilo reutilizável, sem valores fixos espalhados.

## Regras de negócio

- **RN#1:** O ajuste é apenas visual e não altera o comportamento de adição ao carrinho.

## Requisito não funcional

- **RNF#1:** Os botões devem manter contraste, área de toque e legibilidade em dispositivos móveis.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Criar token de raio para os botões de adicionar e aplicá-lo nos componentes do carrinho | 1h | Pendente |
| 2 | Verificar o resultado na vitrine e no detalhe em larguras de desktop e celular | 1h | Pendente |
| **Total** | | **2h** | |

## Relacionamentos

- Ajusta a vitrine de [US01](../cards/US01_explore_storefront.md) e o botão de adicionar de [US06](../cards/US06_add_to_cart.md).

## Navegação

[Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP02](./IMP02_favorite_products.md)
