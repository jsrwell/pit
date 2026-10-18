---
code: "BE-CAT-02"
name: "Gestão do catálogo"
updated: "2026/10/18"
---

# Gestão do catálogo

Atende ao cartão **US13** (manter o catálogo de produtos). Todas as rotas ficam em `/api/catalog/admin` e exigem papel `admin`.

## Operações

| Operação                 | Rota                               | Resultado                                      |
| ------------------------ | ---------------------------------- | ---------------------------------------------- |
| Listar todos             | `GET /products`                    | Ativos e inativos, por nome, com datas de auditoria |
| Consultar                | `GET /products/{id}`               | Produto em qualquer situação                   |
| Cadastrar                | `POST /products`                   | `201` com o produto criado                     |
| Editar                   | `PUT /products/{id}`               | Substitui todos os campos editáveis            |
| Enviar imagem            | `POST /images`                     | `201` com o id da imagem, a ser usado em `image_id` |

## Campos do produto

| Campo                   | Regra                                                       |
| ----------------------- | ----------------------------------------------------------- |
| `name`                  | De 2 a 80 caracteres                                        |
| `description`           | Até 2000 caracteres                                         |
| `composition`           | Até 2000 caracteres                                         |
| `highlights`            | Até 10 itens; linhas vazias são descartadas                 |
| `price`                 | Maior que zero, duas casas decimais                         |
| `category_name`         | Nome da categoria; criada se ainda não existir              |
| `flavor_name`           | Nome do sabor; criado se ainda não existir                  |
| `image_id`              | Opcional; deve ser uma imagem enviada antes                 |
| `is_active`             | Publicado na vitrine                                        |
| `is_available`          | Pode ser comprado                                           |
| `show_when_unavailable` | Continua visível quando indisponível                        |
| `is_featured`           | Destaque na vitrine                                         |

Categoria e sabor são informados por nome para que o administrador nunca precise cadastrá-los antes de um produto.

## Regras de negócio

| Regra                                                 | Implementação                                          | Erro          |
| ----------------------------------------------------- | ------------------------------------------------------ | ------------- |
| CA#1: nome, categoria, descrição, preço, imagem, disponibilidade | Schema `ProductInput`                        | `CS-SYS-0002` |
| CA#2: editar produto existente                        | `update_product`                                       | `CS-CAT-0003` |
| CA#3: inativar sem apagar o histórico                 | `is_active=false`; o registro e as datas permanecem    | —             |
| RN#1 e US03 RN#2: dados mínimos para publicar          | Produto ativo exige descrição, composição e imagem     | `CS-CAT-0004` |
| RN#2: inativo não é comprável                         | Regra de vitrine e de compra (ver [vitrine](01_storefront_and_search.md)) | `CS-CAT-0007` |
| Imagem referenciada existe                            | Verificação de `image_id`                              | `CS-CAT-0001` |

Um produto pode ser salvo inativo e incompleto, como rascunho, e publicado depois.

## Imagens

- Formatos aceitos: PNG, JPEG e WebP. Outros, inclusive SVG, respondem `CS-CAT-0005`.
- Tamanho máximo: `CATALOG__MAX_IMAGE_BYTES` (padrão 2 MB). Acima disso, `CS-CAT-0006`.
- A imagem é gravada no banco e servida por `GET /api/catalog/images/{id}`. Trocar a foto de um produto é enviar uma nova imagem e atualizar `image_id`.

## Componentes

| Camada       | Arquivo                                                      |
| ------------ | ------------------------------------------------------------ |
| Rotas        | `modules/catalog/api/admin_product_routes.py`                |
| Casos de uso | `services/save_product.py`, `services/upload_product_image.py`, `services/list_all_products.py` |
