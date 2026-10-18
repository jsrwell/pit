---
code: "US03"
name: "Analisar o produto antes da compra"
status: "implemented"
history: []
---

# US03 — Analisar o produto antes da compra

## História

Como **cliente visitante**, eu quero visualizar os detalhes completos de um cupcake, para que possa reduzir incerteza e tomar uma decisão de compra informada.

- **Requerente:** Cliente visitante
- **Prioridade:** A
- **Estimativa:** 3 pontos (~15h)
- **Eixo:** Vitrine e descoberta

O detalhe do produto é a camada onde o interesse se converte em intenção de compra. Precisa comunicar valor com precisão.

## Critérios de aceitação

- **CA#1:** O sistema deve exibir descrição, preço, imagem ampliada e status de disponibilidade.
- **CA#2:** O sistema deve exibir informações complementares relevantes, como composição e diferenciais.
- **CA#3:** O sistema deve permitir iniciar a compra a partir da tela de detalhe.

## Regras de negócio

- **RN#1:** Produtos indisponíveis devem ser claramente identificados.
- **RN#2:** Todo item ativo deve possuir informações mínimas obrigatórias cadastradas.

## Requisito não funcional

- **RNF#1:** A tela de detalhe deve preservar clareza visual e não comprometer o desempenho do app.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoint de detalhe do produto | 4h | Concluída |
| 2 | Desenvolver tela de detalhe com imagem ampliada, descrição e composição | 8h | Concluída |
| 3 | Escrever testes da tela de detalhe | 3h | Concluída |
| **Total** | | **15h** | |

## Relacionamentos

- É acessada pela vitrine de [US01](./US01_explore_storefront.md) e pelos resultados de [US02](./US02_filter_products.md).
- Inicia a adição ao carrinho de [US06](./US06_add_to_cart.md).
- Exibe dados mantidos por [US13](./US13_manage_catalog.md) e [US14](./US14_manage_availability.md).

## Navegação

[Anterior: US02](./US02_filter_products.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US04](./US04_create_account.md)
