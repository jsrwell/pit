---
code: "BE-DB-03"
name: "Dados iniciais"
updated: "2026/10/18"
---

# Dados iniciais

Migrações só alteram esquema. Os dados que um ambiente novo precisa para ser usado são carregados pelo ponto de entrada `src/seed.py`, que pode ser executado quantas vezes for preciso.

## O que é carregado

| Seed                 | Condição                                         | Resultado                                                        |
| -------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| Administrador        | `ADMIN__EMAIL` e `ADMIN__PASSWORD` definidos     | Cria a conta com papel `admin`, ou promove uma conta existente com o mesmo e-mail |
| Catálogo demonstrativo | `SEED__DEMO_CATALOG=true` e nenhum produto cadastrado | 11 cupcakes em 4 categorias e 10 sabores, com ilustração SVG, composição e diferenciais |

O catálogo demonstrativo inclui produtos em destaque e um produto indisponível, para que vitrine, destaques e indisponibilidade possam ser vistos logo no primeiro acesso.

## Idempotência

- O administrador só é criado se o e-mail não existir; a senha de uma conta existente nunca é alterada.
- O catálogo só é inserido se a tabela de produtos estiver vazia; um catálogo com qualquer produto, demonstrativo ou não, é preservado.
- Tudo roda numa única transação: ou o seed inteiro é aplicado, ou nada.

## Execução

| Ambiente          | Como                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| Local             | `poetry run python src/seed.py`, depois de `alembic upgrade head`             |
| Imagem de release | Automática ao iniciar, logo após as migrações; desligada com `RUN_SEED=false` |

As ilustrações dos produtos são geradas por `modules/catalog/services/cupcake_illustration.py` a partir de uma paleta por produto, e os textos ficam em `modules/catalog/services/demo_catalog.py`. Uploads feitos pelo painel não aceitam SVG; o formato só existe para os dados de demonstração.
