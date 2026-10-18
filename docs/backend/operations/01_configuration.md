---
code: "BE-OPS-01"
name: "Configuração do backend"
updated: "2026/10/18"
---

# Configuração do backend

O backend é configurado apenas por variáveis de ambiente, lidas por `Settings` (`app/shared/config/settings.py`). Localmente, os valores podem vir de `backend/.env` (modelo em `backend/.env.example`); variáveis definidas no ambiente têm precedência sobre o arquivo. Grupos aninhados usam `__` como separador.

## Aplicação e servidor

| Variável         | Padrão       | Uso                                                  |
| ---------------- | ------------ | ---------------------------------------------------- |
| `APP__VERSION`   | `0.0.0-dev`  | Versão exibida em `/api/health`; preenchida pela imagem de release |
| `SERVER__HOST`   | `0.0.0.0`    | Endereço de escuta                                   |
| `SERVER__PORT`   | `8000`       | Porta de escuta                                      |
| `SERVER__RELOAD` | `false`      | Recarga automática; útil só em desenvolvimento       |

## Banco de dados

| Variável          | Padrão                                                           | Uso                         |
| ----------------- | ---------------------------------------------------------------- | --------------------------- |
| `DATABASE__DSN`   | `postgresql+psycopg://cupcakes:cupcakes@localhost:5432/cupcakes` | Conexão; aceita o formato `postgresql://` do Neon |
| `DATABASE__ECHO`  | `false`                                                          | Registra o SQL no log       |

## Segurança e acesso

| Variável                     | Padrão                         | Uso                                               |
| ---------------------------- | ------------------------------ | ------------------------------------------------- |
| `CORS__ALLOW_ORIGINS`        | `["http://localhost:5173","http://localhost:4173"]` | Origens do navegador aceitas, em JSON, sem barra final |
| `AUTH__SECRET_KEY`           | segredo de desenvolvimento     | Assina os tokens; **obrigatório trocar em produção** |
| `AUTH__ACCESS_TOKEN_MINUTES` | `120`                          | Validade da sessão                                |
| `AUTH__MAX_FAILED_ATTEMPTS`  | `5`                            | Falhas de login antes do bloqueio                 |
| `AUTH__LOCKOUT_MINUTES`      | `15`                           | Duração do bloqueio                               |

## Administrador e dados iniciais

| Variável             | Padrão          | Uso                                                      |
| -------------------- | --------------- | -------------------------------------------------------- |
| `ADMIN__NAME`        | `Administrador` | Nome da conta criada pelo seed                           |
| `ADMIN__EMAIL`       | vazio           | E-mail do administrador; sem ele, nenhum admin é criado  |
| `ADMIN__PASSWORD`    | vazio           | Senha inicial; segue a política de senhas                |
| `SEED__DEMO_CATALOG` | `true`          | Carrega o catálogo demonstrativo num banco vazio         |

## Regras da loja

| Variável                         | Padrão                                         | Uso                               |
| -------------------------------- | ---------------------------------------------- | --------------------------------- |
| `STORE__DELIVERY_FEE`            | `12.00`                                        | Taxa de entrega                   |
| `STORE__PICKUP_ADDRESS`          | `Rua das Confeitarias, 100 - Centro, São Paulo` | Endereço exibido para retirada   |
| `STORE__CUSTOM_ORDER_LEAD_DAYS`  | `2`                                            | Antecedência mínima de encomendas |
| `CATALOG__MAX_IMAGE_BYTES`       | `2000000`                                      | Tamanho máximo de imagem enviada  |

## Somente na imagem de release

| Variável         | Padrão | Uso                                                   |
| ---------------- | ------ | ----------------------------------------------------- |
| `RUN_MIGRATIONS` | `true` | Aplica as migrações antes de servir                   |
| `RUN_SEED`       | `true` | Executa o seed idempotente antes de servir            |

Na imagem, `DATABASE__DSN` aponta para o serviço `database` e `CORS__ALLOW_ORIGINS` para `http://localhost:8080`; em qualquer outro ambiente esses valores são sobrescritos, nunca o Dockerfile.
