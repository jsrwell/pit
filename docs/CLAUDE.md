# Documentação

- Tudo aqui é escrito em português do Brasil, sem emojis, e serve tanto ao desenvolvimento quanto à entrega acadêmica do PIT.
- Os três `ARCHITECTURE.md` são a fonte das decisões técnicas; código que contrarie um deles exige atualizar o documento no mesmo commit.
- Diagramas são escritos em Mermaid dentro do Markdown, para ficarem versionados como texto e renderizarem no GitHub.
- `planning/cards/` é o backlog vivo; `planning/original/` é a entrega do PIT I e não é alterada.
- Todo arquivo de planejamento começa com front matter YAML (`code`, `name`, `status`, `history`), com `status` apenas `pending` ou `implemented`.
- Mudança de escopo, regra, critério, prioridade ou tarefa em um cartão é registrada em `history`; reorganização editorial não.
- Novos documentos só são criados quando pedidos explicitamente; preferir ampliar os existentes.
- Fora de `planning/`, todo documento começa com front matter YAML `code`, `name` e `updated` (`AAAA/MM/DD`), e `updated` muda sempre que o conteúdo muda.
- Códigos seguem o prefixo da área: `SYS-`, `DOCS-`, `BE-`, `FE-`, `LN-`, mais o tema (`BE-AUTH-01`); um código nunca é reaproveitado.
- Cada aplicação tem `README.md` (índice, também com front matter) e `ARCHITECTURE.md`; temas relacionados ficam em subpastas com arquivos numerados (`authentication/01_authentication_design.md`).
- Documentos de funcionalidade citam os cartões (`US01`) que atendem e descrevem o que está implementado, não o que foi planejado; a mudança de uma funcionalidade atualiza o documento no mesmo commit.
- Documentos curtos e focados: o que vale para mais de um lugar é escrito uma vez e referenciado por link.
