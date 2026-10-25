---
code: "BE-ACC-02"
name: "Endereços de entrega"
updated: "2026/10/25"
---

# Endereços de entrega

Atende ao cartão **US09** (manter endereços de entrega) e fornece o endereço exigido pela entrega no US08.

## Recursos

Todas as rotas ficam em `/api/accounts/me/addresses` e só enxergam os endereços da conta autenticada.

| Operação            | Rota                              | Observação                                         |
| ------------------- | --------------------------------- | -------------------------------------------------- |
| Listar              | `GET /`                           | Principal primeiro, depois por ordem de cadastro   |
| Cadastrar           | `POST /`                          | O primeiro endereço vira principal automaticamente |
| Editar              | `PUT /{address_id}`               | Substitui todos os campos                          |
| Definir principal   | `POST /{address_id}/primary`      | Desmarca os demais                                 |
| Excluir             | `DELETE /{address_id}`            | Responde `204`; promove outro se era o principal   |

## Campos

| Campo        | Regra                                                   |
| ------------ | ------------------------------------------------------- |
| `label`      | Até 40 caracteres; padrão "Casa"                        |
| `zip_code`   | CEP com ou sem hífen; gravado como `00000-000`          |
| `street`     | Obrigatório, até 120 caracteres                         |
| `number`     | Obrigatório, até 10 caracteres                          |
| `complement` | Opcional, até 60 caracteres                             |
| `district`   | Obrigatório, até 60 caracteres                          |
| `reference`  | Opcional, até 120 caracteres                            |
| `is_primary` | Opcional; `true` torna o endereço o principal           |

## Regras de negócio

| Regra                                                    | Implementação                                         |
| -------------------------------------------------------- | ----------------------------------------------------- |
| CA#1: CEP, rua, número, complemento, bairro e referência | Schema `AddressInput`                                 |
| CA#2 e RN#1: endereço completo e válido                  | Campos obrigatórios e padrão do CEP; falhas viram `CS-SYS-0002` |
| CA#3: endereço principal                                 | Exatamente um principal enquanto houver endereços     |
| RN#2: mais de um endereço por cliente                    | Sem limite de quantidade                              |
| Isolamento                                               | Endereço de outra conta responde `CS-ACC-0005`        |

## Uso pelos pedidos

O módulo `orders` não importa o model de endereço. Ele chama `get_delivery_address`, que devolve uma cópia imutável (`DeliveryAddress`) com o endereço formatado. Essa cópia é gravada no pedido, então editar ou excluir o endereço depois não altera pedidos já feitos.

## Preenchimento pelo CEP

O preenchimento automático de rua e bairro (IMP11) é feito pelo frontend, que consulta o ViaCEP diretamente; a API não muda. A consulta é só um auxílio (RN#1): o endereço continua validado e gravado por estas rotas, com as mesmas regras, e a indisponibilidade do serviço externo não impede o cadastro (RNF#1). Detalhes em [Jornada do cliente](../../frontend/journeys/01_customer_journey.md).
