---
code: "US01"
name: "Explorar a vitrine digital da loja"
status: "implemented"
history: []
---

# US01 — Explorar a vitrine digital da loja

## História

Como **cliente visitante**, eu quero visualizar o catálogo de cupcakes disponíveis, para que possa conhecer os produtos da loja e decidir o que comprar.

- **Requerente:** Cliente visitante
- **Prioridade:** A
- **Estimativa:** 3 pontos (~22h)
- **Eixo:** Vitrine e descoberta

O catálogo funciona como vitrine comercial. Deve transmitir organização, apelo visual e percepção de valor logo no primeiro contato.

## Critérios de aceitação

- **CA#1:** O sistema deve exibir os cupcakes disponíveis em formato visual organizado.
- **CA#2:** Cada item deve apresentar nome, imagem principal, preço e indicação de disponibilidade.
- **CA#3:** O usuário deve conseguir acessar a tela de detalhe do produto a partir da vitrine.

## Regras de negócio

- **RN#1:** Apenas produtos ativos e disponíveis devem aparecer como compráveis.
- **RN#2:** Produtos marcados como destaque devem ser exibidos com maior evidência na vitrine.

## Requisito não funcional

- **RNF#1:** A vitrine deve carregar com desempenho adequado e manter boa legibilidade em dispositivos móveis.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoint de listagem de produtos ativos | 6h | Concluída |
| 2 | Desenvolver componente de card de produto na vitrine | 8h | Concluída |
| 3 | Implementar lógica de destaque de produtos | 4h | Concluída |
| 4 | Escrever testes de integração da vitrine | 4h | Concluída |
| **Total** | | **22h** | |

## Relacionamentos

- Depende da disponibilidade mantida por [US14](./US14_manage_availability.md).
- Direciona ao detalhe definido em [US03](./US03_view_product_details.md).
- É refinada pela busca de [US02](./US02_filter_products.md) e pelos destaques de [US16](./US16_manage_promotions.md).

## Navegação

[Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US02](./US02_filter_products.md)
