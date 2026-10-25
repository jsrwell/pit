---
code: "FE-UI-02"
name: "Layout e componentes"
updated: "2026/10/25"
---

# Layout e componentes

## Escala de espaçamento

| Token       | Valor   | Token       | Valor  |
| ----------- | ------- | ----------- | ------ |
| `--space-1` | 0,25rem | `--space-6` | 2rem   |
| `--space-2` | 0,5rem  | `--space-7` | 3rem   |
| `--space-3` | 0,75rem | `--space-8` | 4rem   |
| `--space-4` | 1rem    | `--space-9` | 6rem   |
| `--space-5` | 1,5rem  |             |        |

| Token             | Valor                         | Uso                                   |
| ----------------- | ----------------------------- | ------------------------------------- |
| `--container`     | 1200px                        | Largura máxima do conteúdo            |
| `--gutter`        | de 1,25rem a 3rem             | Margem lateral, cresce com a tela     |
| `--section-gap`   | de 4rem a 6,5rem              | Distância entre seções                |
| `--header-height` | 4,75rem (4,25rem no celular)  | Altura do cabeçalho fixo              |

Espaçamentos internos usam propriedades lógicas (`padding-inline`, `padding-block`) para que classes combinadas num mesmo elemento não se anulem.

## Raios

| Token             | Valor | Uso                                                                    |
| ----------------- | ----- | ---------------------------------------------------------------------- |
| `--radius-sm`     | 6px   | Botões, campos e alertas                                               |
| `--radius`        | 10px  | Opções em cartão, miniaturas e cards no celular                        |
| `--radius-lg`     | 18px  | Painéis, cards de produto e barra de filtros                           |
| `--radius-action` | 12px  | Botões de adicionar ao carrinho e seletor de quantidade ao lado (IMP01) |

Os botões de adicionar (`add-to-cart__button`), na vitrine, no detalhe e nos combos, usam `--radius-action` para um traço mais suave que o dos demais botões, sem mudar altura, contraste nem área de toque.

## Classes de layout

| Classe         | Função                                                              |
| -------------- | ------------------------------------------------------------------- |
| `container`    | Centraliza e aplica a margem lateral                                |
| `page`         | Espaço vertical de uma página                                       |
| `page-title`   | Rótulo, título e subtítulo da página                                |
| `panel`        | Cartão branco com borda, raio e sombra suave                        |
| `two-column`   | Conteúdo principal e coluna lateral (resumos); uma coluna abaixo de 60rem |
| `stack`, `stack--loose` | Pilha vertical com espaço de 1rem ou 2rem                  |
| `row`          | Linha flexível com quebra                                           |
| `facts`        | Lista de rótulo e valor em colunas, com quebra de textos longos     |
| `form`, `form-grid`, `form-grid--two`, `form-grid--three` | Formulários e grades de campos   |
| `pill-group`, `pill` | Filtros em pílulas com rolagem horizontal                     |
| `choice-group`, `choice` | Opções em cartão (modalidade, pagamento, endereço)        |
| `summary`      | Resumo de valores, fixo na lateral em telas grandes                 |
| `empty-panel`  | Estado vazio em painel tracejado                                    |

## Componentes compartilhados

| Componente        | Local                           | Função                                                  |
| ----------------- | ------------------------------- | ------------------------------------------------------- |
| `AsyncContent`    | `shared/components/`            | Mostra carregando, erro ou conteúdo de uma chamada      |
| `ErrorMessage`    | `shared/components/`            | Alerta de erro com `role="alert"`                       |
| `TextField`, `TextAreaField` | `shared/components/` | Campo com rótulo, dica e erro ligados por `aria`        |
| `QuantityStepper` | `shared/components/`            | Seletor de quantidade com limites                       |
| `PriceTag`        | `shared/components/`            | Preço, ou preço riscado e preço promocional             |
| `Brand`, `SiteHeader`, `SiteFooter`, `AdminLayout` | `app/layout/` | Estrutura comum das páginas      |

Hooks compartilhados: `useAsync` (carregamento com recarga), `useSubmit` (envio com erro geral e erros por campo) e `useDebouncedValue` (atraso de digitação na busca).

## Pontos de quebra

| Largura      | Mudança                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| até 64rem    | Menu recolhível no cabeçalho; filtros em duas colunas; destaques em duas por vez |
| até 60rem    | Colunas laterais (resumos) passam para baixo do conteúdo                 |
| até 52rem    | Hero sem ilustração; detalhe do produto e formulário de produto em uma coluna |
| até 40rem    | Vitrine em duas colunas compactas; grades de formulário em uma coluna    |
| até 36rem    | Marca reduzida e botões do hero em largura total                         |

O layout é pensado primeiro para celular, como pedem os requisitos não funcionais de vitrine e de formulários (US01, US09, US12).

## Padrões de interação

- **Destaques em carrossel:** rolagem com encaixe e setas quando há mais de três itens; no celular, um card e parte do próximo ficam visíveis.
- **Cards de produto:** imagem em 5:4, categoria, nome, sabor e rodapé com preço e ação, separados por linha fina.
- **Ações por estado:** botões só aparecem quando a ação é possível (por exemplo, próximos status de um pedido no painel).
- **Retorno imediato:** toda ação mostra estado de envio no botão e confirmação ou erro ao lado.
