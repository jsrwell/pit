---
code: "US16"
name: "Potencializar venda por campanhas e combinações"
status: "implemented"
history:
  - date: "2026/10/25"
    description: "Inclusão do CA#4 para manter cupons de desconto com código, percentual e vigência, conforme a melhoria IMP06 originada nos testes com usuários."
---

# US16 — Potencializar venda por campanhas e combinações

## História

Como **administrador**, eu quero configurar promoções, combos e produtos em destaque, para que possa responder a sazonalidade e campanhas, aumentando conversão e ticket médio.

- **Requerente:** Administrador
- **Prioridade:** B
- **Estimativa:** 5 pontos (~24h)
- **Eixo:** Administração

Introduz camada de estratégia comercial. A vitrine deixa de ser estática.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir cadastrar promoções com período de vigência.
- **CA#2:** O sistema deve permitir marcar produtos para destaque na vitrine.
- **CA#3:** O sistema deve permitir criar combinações promocionais de produtos.
- **CA#4:** O sistema deve permitir cadastrar, ativar e desativar cupons de desconto com código, percentual e período de vigência ([IMP06](../revision/IMP06_discount_coupons.md)).

## Regras de negócio

- **RN#1:** Promoções fora da vigência não podem continuar afetando o preço exibido.
- **RN#2:** O preço promocional deve prevalecer enquanto a campanha estiver ativa.

## Requisito não funcional

- **RNF#1:** A atualização promocional deve ser simples de operar e refletir corretamente na vitrine.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar modelo de promoções e combos no backend | 6h | Concluída |
| 2 | Desenvolver painel de configuração de campanhas | 8h | Concluída |
| 3 | Implementar lógica de vigência e preço promocional na vitrine | 6h | Concluída |
| 4 | Escrever testes de promoções | 4h | Concluída |
| **Total** | | **24h** | |

## Relacionamentos

- Aplica campanhas aos produtos mantidos em [US13](./US13_manage_catalog.md).
- Altera destaques e preços exibidos em [US01](./US01_explore_storefront.md) e [US03](./US03_view_product_details.md).
- O preço vigente deve ser respeitado por [US06](./US06_add_to_cart.md) e [US10](./US10_secure_checkout.md).

## Navegação

[Anterior: US15](./US15_manage_orders.md) · [Índice](../README.md) · [Documento original](../original/SP01.md)
