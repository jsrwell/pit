---
code: "BE-QA-01"
name: "Estratégia de testes do backend"
updated: "2026/10/18"
---

# Estratégia de testes do backend

## Abordagem

O foco está em **testes de integração pela API**, que exercitam rota, validação, regra de negócio, persistência e formato de erro de uma vez, do jeito que o frontend usa o sistema. Testes unitários ficam para regras isoladas e invariantes do projeto.

| Tipo        | Pasta                      | Cobre                                                           |
| ----------- | -------------------------- | --------------------------------------------------------------- |
| Integração  | `tests/integration/<módulo>/` | Critérios de aceitação e regras de negócio de cada cartão, caminhos de erro |
| Unitário    | `tests/unit/`              | Catálogo de erros, configuração, bootstrap do administrador     |

## Ambiente

- Banco PostgreSQL real: o de `docker/dev/` localmente e um serviço PostgreSQL no CI, com as migrações aplicadas.
- Cada teste roda dentro de uma transação desfeita ao final (fixture `db_session`); a suíte não deixa dados no banco de desenvolvimento e os testes não dependem uns dos outros.
- A sessão de cada requisição é um savepoint dessa transação, com a mesma regra de confirmação da aplicação, inclusive para erros com `keeps_changes`.
- O `TestClient` usa `raise_server_exceptions=False`, para que erros 500 sejam verificados como resposta.

## Fixtures

| Fixture        | Fornece                                                   |
| -------------- | --------------------------------------------------------- |
| `client`       | Cliente HTTP da aplicação ligado à transação do teste     |
| `db_session`   | Sessão do banco, para preparar ou conferir dados          |
| `make_product` | Produto com categoria e sabor únicos e valores padrão     |
| `make_user`    | Conta com a senha de teste `doce1234`                     |
| `sign_in`      | Conta já autenticada, com os cabeçalhos `Authorization`   |

Os tipos dessas fábricas ficam em `tests/support/factories.py`.

## Invariantes verificadas automaticamente

- Todo código de erro tem formato `CS-XXX-0000` e é único.
- Toda rota documenta o erro 500 no OpenAPI.
- Nenhum erro inesperado vaza a mensagem interna.
- O CI roda `alembic check`: model alterado sem migração quebra o pipeline.

## Execução

```bash
cd backend
poetry run pytest
```

O CI executa também `black --check`, `ruff check`, `alembic upgrade head`, `alembic check` e o build da imagem. A relação entre cada critério dos cartões e os testes está em [Rastreabilidade de requisitos](02_requirements_traceability.md).
