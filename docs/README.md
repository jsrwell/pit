---
code: "DOCS-00"
name: "Documentação do sistema"
updated: "2026/10/18"
---

# Documentação do sistema

Documentação técnica e funcional da Loja Virtual de Cupcakes Gourmet. O que o sistema deve fazer está nos cartões de [planejamento](planning/README.md); o que ele faz, como foi construído e como é operado está nas pastas abaixo.

## Por onde começar

| Quero entender...                                  | Leia                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| Como as partes se encaixam e chegam à produção     | [Visão geral da arquitetura](ARCHITECTURE.md)                          |
| O que foi pedido em cada história de usuário       | [Planejamento](planning/README.md)                                     |
| Regras, API, banco e segurança                     | [Documentação do backend](backend/README.md)                           |
| Telas, jornada do usuário e sistema visual         | [Documentação do frontend](frontend/README.md)                         |
| A página de entrada da demonstração                | [Documentação do lançador](launcher/README.md)                         |
| Como cada requisito foi testado                    | [Rastreabilidade no backend](backend/quality/02_requirements_traceability.md) e [no frontend](frontend/quality/01_test_strategy_and_traceability.md) |

## Componentes

| Componente | Papel                                              | Hospedagem       | Documentação                          |
| ---------- | -------------------------------------------------- | ---------------- | ------------------------------------- |
| Backend    | API REST (Model e Controller do MVC)               | Render           | [backend/](backend/README.md)         |
| Frontend   | SPA da loja e do painel (View do MVC)              | Render           | [frontend/](frontend/README.md)       |
| Lançador   | Página que acorda os serviços e leva à loja        | Cloudflare Pages | [launcher/](launcher/README.md)       |
| Banco      | PostgreSQL                                         | Neon             | [Modelo de dados](backend/database/01_data_model.md) |

## Convenções da documentação

- Todo documento começa com cabeçalho YAML com `code` (identificador estável), `name` (título) e `updated` (data da última atualização, `AAAA/MM/DD`). Os arquivos de `planning/` seguem o cabeçalho próprio descrito no [planejamento](planning/README.md).
- Assuntos relacionados ficam numa pasta temática (`authentication/`, `orders/`), com arquivos numerados na ordem de leitura (`01_authentication_design.md`).
- Cada pasta de aplicação tem um `README.md` com o índice dos seus documentos e um `ARCHITECTURE.md` com as decisões técnicas.
- Documentos curtos e focados; o que vale para várias partes é escrito uma vez e referenciado por link.
- Textos em português do Brasil; nomes de arquivos em inglês.
