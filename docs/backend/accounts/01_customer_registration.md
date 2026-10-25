---
code: "BE-ACC-01"
name: "Cadastro de clientes"
updated: "2026/10/25"
---

# Cadastro de clientes

Atende ao cartão **US04** (criar conta para comprar e acompanhar pedidos) e à melhoria **IMP04** (validar o formato dos campos do cadastro).

## Fluxo

`POST /api/accounts` cria uma conta com papel `customer` e responde `201` com os dados públicos da conta, sem senha nem hash. Em seguida o frontend faz o login automaticamente.

| Campo      | Regra                                                        |
| ---------- | ------------------------------------------------------------ |
| `name`     | De 2 a 100 caracteres, sem espaços nas pontas                |
| `email`    | E-mail válido de até 254 caracteres; gravado em minúsculas   |
| `phone`    | DDD de dois dígitos (sem zero) mais fixo de 8 dígitos ou celular de 9 iniciado por 9, num total de 10 ou 11 dígitos; aceita máscara como `(11) 98765-4321`, recusa letras e código de país e é gravado só com dígitos |
| `password` | Até 72 caracteres e política mínima de senha (ver [segurança](../authentication/02_security_strategy.md)) |

Os tipos `Name` e `Phone` ficam em `modules/accounts/schemas/contact_fields.py`, para que toda escrita de dados de contato use as mesmas regras. Um telefone inválido é apontado em `/body/phone` com o código `phone_format`.

## Regras de negócio

| Regra                                          | Implementação                                                    | Erro          |
| ---------------------------------------------- | ---------------------------------------------------------------- | ------------- |
| CA#2: campos obrigatórios validados            | Schema `AccountRegistration`; cada campo inválido é apontado por JSON Pointer | `CS-SYS-0002` |
| IMP04 CA#4 e RN#1: telefone com DDD, só dígitos | Validador `phone_digits` do tipo `Phone`                         | `CS-SYS-0002` |
| CA#3 e RN#1: e-mail único                      | Consulta prévia sem diferenciar maiúsculas e restrição única no banco, para o caso de duas requisições simultâneas | `CS-ACC-0001` |
| RN#2: senha com padrão mínimo de segurança     | `enforce_password_policy`                                        | `CS-ACC-0002` |
| RNF#1: proteção dos dados                      | Hash bcrypt; resposta sem dados sensíveis                        | —             |

## Consulta da própria conta

`GET /api/accounts/me` devolve os dados da conta do token. Se a conta tiver sido removida ou excluída pelo cliente, a resposta é `CS-SYS-0005` e o cliente precisa entrar de novo. Edição, troca de senha e exclusão estão em [Manutenção da própria conta](03_account_self_service.md).

## Componentes

| Camada      | Arquivo                                         |
| ----------- | ----------------------------------------------- |
| Rota        | `modules/accounts/api/account_routes.py`        |
| Caso de uso | `modules/accounts/services/register_customer.py` |
| Política    | `modules/accounts/services/password_policy.py`  |
| Hash        | `modules/accounts/services/password_hashing.py` |
| Persistência | `modules/accounts/repositories/user_repository.py` |
