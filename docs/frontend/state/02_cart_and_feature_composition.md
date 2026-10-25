---
code: "FE-STA-02"
name: "Estado do carrinho e composição de features"
updated: "2026/10/25"
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

## Favoritos

`features/catalog/hooks/favorites-store.ts` guarda os produtos favoritados (IMP02) como lista de identificadores no `localStorage`, na chave `cupcakes-gourmet.favorites`, sem conta nem rota na API. O botão de coração do card e do detalhe e a opção "Favoritos" da vitrine leem o mesmo estado com `useFavorites`, por isso marcar num lugar atualiza todos os outros.

- A opção "Favoritos" filtra a resposta da vitrine pelos identificadores guardados; produtos inativos não vêm da API e, portanto, nunca aparecem, mesmo que continuem na lista.
- Leituras e gravações ficam em `try/catch`: com o armazenamento bloqueado ou corrompido, os favoritos funcionam só em memória durante a visita e a vitrine segue normal.

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

- `useAsync` carrega dados ao montar a tela e oferece `reload` e `refreshing`. `refreshing` vale `true` quando uma nova consulta corre sobre dados já exibidos, o que permite manter a tela anterior visível em vez de voltar ao "Carregando..."; a vitrine usa esse estado para atenuar a grade ao filtrar (IMP03). `reload` é usado depois de ações (como mudar a disponibilidade de um produto) e nas atualizações periódicas de pedidos.
- A cotação do checkout é refeita automaticamente quando a modalidade ou o endereço mudam, mantendo o resumo anterior na tela até a nova resposta chegar.
