---
globs: ["*.py"]
---

# Tratamento de Erros

Raciocínio, exemplos e formato completo em
`docs/DESIGN_PATTERNS.md`, secções _Domain Errors com Catálogo_,
_Problem Details_ e _Contrato de Erro no OpenAPI_. Estas regras são o resumo
obrigatório.

## Declaração

- Todo o erro de negócio é subclasse de `DomainError`, declarado em `errors/`
  do módulo dono, uma classe por ficheiro.
- Atributos obrigatórios: `code`, `status`, `title`.
- Erro que nunca atravessa HTTP declara `internal = True`.
- Formato do código: `SA-<MOD>-<NNNN>`, com o prefixo do módulo dono.
- Um código **nunca** é reutilizado. Retirar é marcar `deprecated = True`,
  nunca apagar nem reaproveitar o número.

## Lançamento

- Services lançam erros de domínio. `HTTPException` **nunca** é lançada fora
  de `app/api/`.
- Erros de bibliotecas e sistemas externos são convertidos em erro de domínio
  dentro do adapter, nunca propagados em cru.
- `detail` explica a ocorrência a um humano. Nunca contém SQL, nomes de
  tabelas, credenciais, caminhos internos ou estado interno.

## Resposta

- Toda a resposta de erro segue a RFC 9457, com `Content-Type`
  `application/problem+json`, produzida pelo handler único.
- O `status` do corpo é igual ao da linha de estado HTTP.
- Erros de validação devolvem `422` com a extensão `errors`, usando JSON
  Pointer (RFC 6901) para localizar o campo e um código por entrada.

## OpenAPI

- Toda a rota declara `responses=problem_responses(...)` com as classes de
  erro que pode propagar. **Nunca** escrever o dicionário `responses` à mão.
- Acrescentar um `raise` numa rota obriga a acrescentar a classe na
  declaração dessa rota.

## Ordem de trabalho ao criar um erro

1. Declarar a classe em `errors/` do módulo dono.
2. Declarar a classe na rota que a pode propagar, ou marcar `internal = True`.
3. Escrever o teste de integração que exercita esse caminho de erro.
4. Só depois lançar o erro no service.
