---
code: "BE-ACC-01"
name: "Cadastro de clientes"
updated: "2026/10/18"
---

# Cadastro de clientes

Atende ao cartão **US04** (criar conta para comprar e acompanhar pedidos).

## Fluxo

`POST /api/accounts` cria uma conta com papel `customer` e responde `201` com os dados públicos da conta, sem senha nem hash. Em seguida o frontend faz o login automaticamente.

| Campo      | Regra                                                        |
| ---------- | ------------------------------------------------------------ |
| `name`     | De 2 a 100 caracteres, sem espaços nas pontas                |
| `email`    | E-mail válido; gravado em minúsculas                         |
| `phone`    | De 10 a 20 caracteres entre dígitos, espaço, parênteses, ponto e hífen, com `+` opcional |
| `password` | Política mínima de senha (ver [segurança](../authentication/02_security_strategy.md)) |

## Regras de negócio

| Regra                                          | Implementação                                                    | Erro          |
| ---------------------------------------------- | ---------------------------------------------------------------- | ------------- |
| CA#2: campos obrigatórios validados            | Schema `AccountRegistration`; cada campo inválido é apontado por JSON Pointer | `CS-SYS-0002` |
| CA#3 e RN#1: e-mail único                      | Consulta prévia sem diferenciar maiúsculas e restrição única no banco, para o caso de duas requisições simultâneas | `CS-ACC-0001` |
| RN#2: senha com padrão mínimo de segurança     | `enforce_password_policy`                                        | `CS-ACC-0002` |
| RNF#1: proteção dos dados                      | Hash bcrypt; resposta sem dados sensíveis                        | —             |

## Consulta da própria conta

`GET /api/accounts/me` devolve os dados da conta do token. Se a conta tiver sido removida, a resposta é `CS-SYS-0005` e o cliente precisa entrar de novo.

## Componentes

| Camada      | Arquivo                                         |
| ----------- | ----------------------------------------------- |
| Rota        | `modules/accounts/api/account_routes.py`        |
| Caso de uso | `modules/accounts/services/register_customer.py` |
| Política    | `modules/accounts/services/password_policy.py`  |
| Hash        | `modules/accounts/services/password_hashing.py` |
| Persistência | `modules/accounts/repositories/user_repository.py` |
