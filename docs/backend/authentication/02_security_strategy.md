---
code: "BE-AUTH-02"
name: "Estratégia de segurança"
updated: "2026/10/18"
---

# Estratégia de segurança

Medidas aplicadas pela API para atender aos requisitos não funcionais de proteção de dados (US04, RNF#1), autenticação segura (US05, RNF#1) e checkout seguro (US10, RNF#1).

## Senhas

- Armazenadas apenas como hash **bcrypt** com sal individual; a senha em texto nunca é gravada nem devolvida.
- Política mínima (US04, RN#2): pelo menos 8 caracteres, com ao menos uma letra e um número. Fora disso, `CS-ACC-0002`.
- O tamanho máximo aceito é de 72 caracteres, o limite efetivo do bcrypt.

## Proteção contra tentativas sucessivas

Atende ao US05, RN#1.

| Parâmetro                   | Padrão | Efeito                                              |
| --------------------------- | ------ | --------------------------------------------------- |
| `AUTH__MAX_FAILED_ATTEMPTS` | `5`    | Falhas seguidas que disparam o bloqueio             |
| `AUTH__LOCKOUT_MINUTES`     | `15`   | Duração do bloqueio; até lá, até a senha certa é recusada |

- Cada senha errada incrementa `users.failed_login_attempts`; um login correto zera o contador.
- Ao atingir o limite, `locked_until` é preenchido e o contador volta a zero. Durante o bloqueio a resposta é `429 CS-ACC-0004`.
- A contagem precisa sobreviver à resposta de erro. Por isso `InvalidCredentials` e `AccountLocked` declaram `keeps_changes = True`, e a unidade de trabalho confirma a transação mesmo lançando o erro.

## Tokens e segredos

- `AUTH__SECRET_KEY` assina os tokens. O padrão serve só para desenvolvimento e **deve** ser trocado em produção; trocar a chave invalida todas as sessões abertas.
- Tokens forjados, malformados ou expirados respondem `CS-SYS-0005`, sem distinguir o motivo para o cliente.

## Dados de pagamento

- O número do cartão é validado (Luhn, validade e CVV) e descartado. Apenas a referência `CARD-****1234` é gravada.
- O total cobrado é sempre recalculado no servidor a partir do carrinho; valores enviados pelo cliente não existem no contrato.

## Superfície da API

- **CORS** restrito às origens em `CORS__ALLOW_ORIGINS`; a comparação é exata, sem barra no final.
- **Erros sem vazamento:** exceções não tratadas viram `CS-SYS-0001` com o registro apenas no log; `detail` nunca contém SQL, tabelas, caminhos ou credenciais.
- **Validação de entrada** por schemas Pydantic com limites de tamanho em todos os textos; falhas viram `CS-SYS-0002` apontando o campo.
- **Uploads** só aceitam PNG, JPEG e WebP até `CATALOG__MAX_IMAGE_BYTES`. SVG é recusado porque pode conter scripts.
- **Imagens** são servidas com o tipo gravado no upload e nunca interpretadas pelo servidor.
- **SQL** é sempre gerado pelo SQLAlchemy com parâmetros; não há concatenação de texto em consultas.

## Isolamento e menor privilégio

- Rotas de cliente usam o id do token, nunca um id informado na URL, para acessar dados próprios.
- Rotas administrativas exigem o papel `admin` no nível do router.
- O usuário do contêiner do backend não é `root`.
