---
code: "BE-CAT-01"
name: "Vitrine, busca e detalhe do produto"
updated: "2026/10/18"
---

# Vitrine, busca e detalhe do produto

Atende aos cartões **US01** (explorar a vitrine), **US02** (refinar a busca) e **US03** (analisar o produto antes da compra).

## Quem aparece na vitrine

Um produto é listado quando está **ativo** e, além disso, **disponível** ou marcado para continuar visível quando indisponível (`show_when_unavailable`). A mesma regra vale para o detalhe: produto fora da vitrine responde `CS-CAT-0003`, exatamente como um produto inexistente.

| Situação do produto                     | Vitrine e detalhe | Pode comprar |
| --------------------------------------- | ----------------- | ------------ |
| Ativo e disponível                      | Sim               | Sim          |
| Ativo, indisponível, visível            | Sim, sinalizado   | Não          |
| Ativo, indisponível, oculto             | Não               | Não          |
| Inativo                                 | Não               | Não          |

## Listagem — `GET /api/catalog/products`

Cada item traz nome, preço, preço promocional em vigor, imagem, categoria, sabor, disponibilidade e destaque (US01, CA#2). A ordenação coloca os **destaques primeiro** e depois os demais por nome (US01, RN#2).

Filtros opcionais, combináveis entre si (US02):

| Parâmetro     | Efeito                                              |
| ------------- | --------------------------------------------------- |
| `category_id` | Só a categoria informada (CA#1)                     |
| `flavor_id`   | Só o sabor informado (CA#2)                         |
| `min_price`   | Preço base maior ou igual                           |
| `max_price`   | Preço base menor ou igual                           |
| `search`      | Trecho do nome, sem diferenciar maiúsculas (CA#3)   |

- Os filtros consideram apenas produtos da vitrine (RN#1) e devolvem a disponibilidade atual (RN#2).
- Faixa invertida (`min_price` maior que `max_price`) responde `CS-CAT-0002`.
- `GET /api/catalog/categories` e `GET /api/catalog/flavors` alimentam as opções dos filtros.

## Detalhe — `GET /api/catalog/products/{product_id}`

Além dos dados do card, traz descrição, composição e diferenciais (US03, CA#1 e CA#2). Os diferenciais são gravados um por linha e devolvidos como lista.

## Imagens — `GET /api/catalog/images/{image_id}`

Devolve os bytes com o tipo gravado no upload e `Cache-Control: public, max-age=31536000, immutable`. Como uma imagem nunca muda de conteúdo (trocar a foto gera um id novo), o navegador e o proxy podem guardá-la indefinidamente, o que atende ao desempenho pedido no US01, RNF#1.

## Preço exibido

Quando há campanha em vigor para o produto, `promotional_price` vem preenchido e prevalece sobre `price` (US16). As regras de vigência estão em [Campanhas, destaques e combos](../promotions/01_campaigns_featured_and_combos.md).

## Componentes

| Camada       | Arquivo                                                         |
| ------------ | --------------------------------------------------------------- |
| Rotas        | `api/product_routes.py`, `api/classification_routes.py`, `api/image_routes.py` |
| Casos de uso | `services/list_storefront_products.py`, `services/get_storefront_product.py`, `services/pricing.py` |
| Consultas    | `repositories/product_repository.py`                            |
