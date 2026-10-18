---
code: "FE-JRN-02"
name: "Painel administrativo"
updated: "2026/10/18"
---

# Painel administrativo

Área da loja, disponível apenas para contas com papel `admin`. Contas de cliente que tentam acessá-la são levadas à vitrine. O painel abre na seção de pedidos e alterna entre as seções por uma barra de abas.

| Rota                       | Seção                | Cartões    |
| -------------------------- | -------------------- | ---------- |
| `/admin/pedidos`           | Pedidos              | US15       |
| `/admin/encomendas`        | Encomendas especiais | US12       |
| `/admin/produtos`          | Catálogo             | US13, US14 |
| `/admin/produtos/novo`     | Novo produto         | US13       |
| `/admin/produtos/:id`      | Editar produto       | US13, US14 |
| `/admin/promocoes`         | Promoções            | US16       |

## Pedidos (US15)

- Filtros em pílulas por status: todos, recebido, confirmado, em preparo, pronto, em rota de entrega, concluído e cancelado.
- Cada pedido mostra número, data, status, contato do cliente, modalidade com endereço e referência, pagamento, observações do cliente, itens e total.
- Os botões exibidos são exatamente os próximos passos permitidos ("Confirmar", "Iniciar preparo", "Marcar como pronto", "Saiu para entrega", "Concluir", "Cancelar"), o que impede pular etapas.
- O quadro se atualiza sozinho a cada 30 segundos, para uso contínuo durante o expediente.

## Encomendas especiais (US12)

- Filtros por situação, abrindo nas solicitações em análise.
- Cada solicitação mostra cliente, data desejada, descrição, quantidade e observações.
- Para decidir, o administrador informa o valor proposto (obrigatório para aprovar) e a resposta ao cliente, e escolhe "Aprovar" ou "Recusar". Solicitações decididas mostram o valor e a resposta registrados.

## Catálogo (US13, US14)

- Tabela com miniatura, nome, categoria, preço e selos de ativo, indisponível e destaque.
- Botão de disponibilidade em cada linha, que alterna entre disponível e indisponível sem abrir o produto.
- Formulário de produto com pré-visualização e envio de imagem (PNG, JPEG ou WebP), nome, categoria e sabor com sugestões dos já existentes, preço, descrição, composição, diferenciais (um por linha) e as opções ativo, disponível, visível quando indisponível e destaque.
- O formulário explica que publicar exige descrição, composição e imagem; produtos podem ser salvos inativos como rascunho.

## Promoções (US16)

- **Campanhas:** nome, produto, preço promocional, início e fim; a lista indica se cada campanha está em vigor e permite excluí-la.
- **Combos:** nome, preço do conjunto, início, fim, descrição e dois ou mais produtos com quantidades; a lista mostra a composição e a vigência.
- **Destaques:** lista de produtos com marcação de destaque, aplicada na hora.

Os horários são digitados no horário local do navegador e enviados à API com fuso.
