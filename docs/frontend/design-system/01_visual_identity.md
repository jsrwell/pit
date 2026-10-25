---
code: "FE-UI-01"
name: "Identidade visual"
updated: "2026/10/25"
---

# Identidade visual

A loja se posiciona como confeitaria artesanal de luxo. A interface busca sofisticação contida: fundo marfim, tipografia serifada nos títulos, detalhes dourados e muito respiro. Atende à exigência de apelo visual e percepção de valor da vitrine (US01) e de clareza nas telas de compra (US03, US10).

## Paleta

Todas as cores são tokens em `app/global.css`; componentes nunca usam cores soltas.

| Token                 | Valor     | Uso                                                |
| --------------------- | --------- | -------------------------------------------------- |
| `--color-ink`         | `#1f1613` | Texto principal, botões primários, rodapé, hero    |
| `--color-ink-soft`    | `#4a3a34` | Texto secundário                                   |
| `--color-muted`       | `#85766e` | Legendas, dicas e metadados                        |
| `--color-ivory`       | `#faf6f0` | Fundo da página                                    |
| `--color-cream`       | `#f3ece2` | Fundos de apoio e selos neutros                    |
| `--color-surface`     | `#ffffff` | Painéis, cards e campos                            |
| `--color-line`        | `#e8dfd3` | Bordas e divisórias                                |
| `--color-gold`        | `#b8935a` | Destaques, foco e marcações ativas                 |
| `--color-gold-light`  | `#dcc394` | Dourado sobre fundo escuro                         |
| `--color-gold-dark`   | `#8c6c39` | Rótulos de seção e links                           |
| `--color-heart`       | `#b4495a` | Coração e contagem de favoritos                    |
| `--color-success`     | `#3f6b47` | Disponível, aprovado, descontos                    |
| `--color-danger`      | `#9c3434` | Erros, indisponível, ações destrutivas             |

## Tipografia

| Papel                      | Fonte               | Aplicação                                          |
| -------------------------- | ------------------- | -------------------------------------------------- |
| Títulos e preços           | Cormorant Garamond  | `h1` a `h3`, preços, totais e nomes de produto     |
| Texto e interface          | Manrope             | Parágrafos, campos, botões e navegação             |
| Rótulos de seção (eyebrow) | Manrope, caixa alta | Texto curto em dourado, com espaçamento largo, acima dos títulos |

Os tamanhos de título usam `clamp()` e se ajustam suavemente entre celular e desktop. Botões e rótulos usam caixa alta com espaçamento entre letras, um traço de estilo associado a marcas de luxo.

## Marca

- O logotipo combina o ícone de cupcake num círculo escuro com o nome "Cupcakes Gourmet" e o complemento "Maison de confeitaria".
- No rodapé escuro, o ícone usa o dourado e o nome fica em marfim (`Brand tone="light"`).
- O hero usa uma ilustração em traço dourado (`HeroArt`) em vez de fotografia, coerente com as ilustrações dos produtos demonstrativos.

## Linguagem

- Textos em português do Brasil, com tom acolhedor e direto ("Seja bem-vindo", "Tudo pronto").
- Mensagens de erro vêm do catálogo pelo código da API, sempre explicando o que o usuário pode fazer.
- Estados de disponibilidade e de pedido usam selos (`badge`) com cores consistentes em toda a aplicação.

## Acessibilidade

- Texto principal em tom quase preto sobre marfim, e marfim sobre o tom escuro; o tom acinzentado fica reservado a legendas e metadados.
- Foco visível em dourado em todos os elementos interativos.
- Carregamentos anunciados com `role="status"` e erros com `role="alert"`.
- Animações reduzidas quando o sistema pede menos movimento (`prefers-reduced-motion`).
