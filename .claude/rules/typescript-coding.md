---
paths:
  - "frontend/**"
---

# TypeScript e React — Regras de Código

Organização, camadas e convenções completas em
`docs/frontend/ARCHITECTURE.md`. Estas regras são o resumo obrigatório.

## Formatação e Estilo

- O **Prettier** é a única autoridade sobre formatação (100 colunas, sem
  ponto e vírgula, aspas simples). O **ESLint** fica com os erros lógicos e
  as regras de hooks.
- Valida com `npm run format:check`, `npm run lint`, `npm test` e
  `npm run build` (que inclui o `tsc`) após tarefas que envolvam o frontend.

## Tipagem Estrita

- `strict` e `noUncheckedIndexedAccess` estão ligados; nunca os desligar.
- Nunca usar `any`. Onde o tipo é genuinamente aberto, usar `unknown` e
  estreitar com um type guard.
- Contratos da API são declarados em `features/<módulo>/api/` espelhando os
  schemas do backend, com os mesmos nomes de campo.

## Organização

- Código de uma funcionalidade fica em `src/features/<módulo>/`, com o mesmo
  nome do módulo correspondente no backend.
- Código partilhado por mais de uma funcionalidade fica em `src/shared/`.
- Uma feature nunca importa outra feature; o que é comum sobe para `shared/`.
- Componentes em `PascalCase.tsx`; demais ficheiros em `kebab-case.ts`.
- Testes ficam ao lado do ficheiro testado, como `*.test.ts(x)`.
- Imports entre pastas usam o alias `@/`; imports relativos só dentro da
  mesma feature.

## Comunicação com a API

- Toda a chamada HTTP passa por `request` em `src/shared/api/http-client.ts`;
  nunca chamar `fetch` diretamente fora dele.
- Erros chegam como `ApiError`; o texto exibido é `error.message`, já
  traduzido pelo código.

## Comentários

- Sem comentários internos, conforme `principles.md`. Nomes descritivos
  substituem comentários.
