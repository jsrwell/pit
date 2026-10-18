---
code: "FE-STA-02"
name: "Estado do carrinho e composição de features"
updated: "2026/10/18"
---

# Estado do carrinho e composição de features

## Estado do carrinho

`features/cart/hooks/cart-store.ts` mantém o último carrinho recebido da API, compartilhado entre o contador do cabeçalho, os botões de adicionar e a página do carrinho.

| Momento                         | Efeito                                                         |
| ------------------------------- | -------------------------------------------------------------- |
| Login ou troca de conta         | `useCartSync` busca o carrinho da conta                        |
| Logout                          | O carrinho em memória é descartado                             |
| Adicionar, alterar ou remover   | A resposta da API, já recalculada, substitui o estado          |
| Pedido confirmado               | O checkout pede um novo carrinho, que volta vazio              |

O frontend nunca calcula preços, subtotais ou descontos: sempre exibe o que a API devolveu. Isso mantém a tela fiel às regras de disponibilidade e promoção do servidor (US07, CA#3; US14, RN#1; US16, RN#2).

## Composição entre features

Features não importam umas das outras. Quando uma tela precisa de uma ação de outra área, ela oferece uma propriedade de renderização e a camada `app/routes/` encaixa ali o componente da outra feature.

| Tela (feature)                     | Encaixe                  | Componente encaixado (feature)      |
| ---------------------------------- | ------------------------ | ----------------------------------- |
| `Storefront` (`catalog`)           | `renderProductAction`    | `AddToCart` (`cart`)                |
| `ProductDetailView` (`catalog`)    | `renderPurchase`         | `AddToCart` com quantidade (`cart`) |
| `ComboShowcase` (`promotions`)     | `renderAction`           | `AddBundleToCart` (`cart`)          |
| `CheckoutView` (`orders`)          | `renderAddressPicker`    | `AddressPicker` (`accounts`)        |
| `CheckoutView` (`orders`)          | `onPlaced`               | Atualização do `cartStore` (`cart`) |

Com isso, cada feature continua testável isoladamente, e as dependências entre áreas ficam todas visíveis em `app/routes/`.

## Carregamento de dados

- `useAsync` carrega dados ao montar a tela e oferece `reload`, usado depois de ações (como mudar a disponibilidade de um produto) e nas atualizações periódicas de pedidos.
- A cotação do checkout é refeita automaticamente quando a modalidade ou o endereço mudam, mantendo o resumo anterior na tela até a nova resposta chegar.
