---
code: "FE-JRN-01"
name: "Jornada do cliente"
updated: "2026/10/25"
---

# Jornada do cliente

Telas usadas por visitantes e clientes, na ordem natural de uso. Rotas marcadas como protegidas levam ao login e, depois dele, de volta à página pedida.

## Mapa de rotas

| Rota                | Tela                      | Acesso     | Cartões          |
| ------------------- | ------------------------- | ---------- | ---------------- |
| `/`                 | Vitrine                   | Público    | US01, US02, US16 |
| `/produtos/:id`     | Detalhe do produto        | Público    | US03, US06       |
| `/cadastro`         | Criar conta               | Público    | US04             |
| `/entrar`           | Entrar                    | Público    | US05             |
| `/conta`            | Minha conta               | Protegida  | US04, US09       |
| `/carrinho`         | Carrinho                  | Protegida  | US06, US07       |
| `/checkout`         | Finalizar pedido          | Protegida  | US08, US09, US10 |
| `/pedidos`          | Meus pedidos              | Protegida  | US11             |
| `/pedidos/:id`      | Acompanhamento            | Protegida  | US11             |
| `/encomendas`       | Encomendas especiais      | Protegida  | US12             |

## Vitrine (US01, US02, US16)

- Hero com chamada para a vitrine e para encomendas especiais.
- Combos em vigor, com o preço normal riscado, o preço do combo e o botão "Adicionar combo".
- Destaques em carrossel, seguidos da vitrine completa em grade.
- Cada card mostra nome, imagem, preço (com preço promocional quando houver), categoria, sabor, selos de destaque, promoção ou indisponível, o botão de adicionar e o coração de favorito (IMP02).
- A opção "Favoritos", no rodapé da barra de filtros, mostra só os cupcakes marcados neste navegador, com a contagem ao lado; sem nenhum marcado, a vitrine explica como favoritar.
- Barra de filtros por nome, categoria, sabor e faixa de preço. A busca espera 300 ms após a digitação antes de consultar, enquanto categoria e sabor consultam na hora. Durante a atualização, os cards atuais ficam atenuados, uma linha dourada corre acima da grade e leitores de tela ouvem "Atualizando a vitrine..." (IMP03). Enquanto há filtro ativo, os destaques ficam ocultos e um botão limpa os filtros.

## Detalhe do produto (US03, US06)

Imagem ampliada, categoria, nome com o coração de favorito ao lado, sabor, preço, situação de disponibilidade, descrição, composição e diferenciais. A área de compra combina seletor de quantidade e botão de adicionar; produtos indisponíveis mostram o aviso no lugar da compra.

## Conta (US04, US05, US09)

- **Cadastro:** nome, e-mail, telefone e senha, com erro indicado em cada campo. Concluído o cadastro, o cliente já entra logado.
- **Entrar:** e-mail e senha; tentativas excessivas mostram o aviso de bloqueio temporário. Clientes vão para "Minha conta" e administradores para o painel.
- **Minha conta:** dados do cliente, atalhos para pedidos, encomendas e carrinho, e o caderno de endereços, com cadastro, edição, exclusão e escolha do principal.
- **Sair:** limpa a sessão do navegador. Sessão expirada leva automaticamente ao login.

## Carrinho (US06, US07)

- Adicionar a partir da vitrine, do detalhe ou de um combo; visitantes são levados ao login primeiro.
- O contador do cabeçalho mostra as unidades no carrinho.
- Cada linha tem imagem, preço unitário, total, seletor de quantidade e "Remover". Linhas que ficaram indisponíveis aparecem sinalizadas, só podem diminuir e bloqueiam a continuação até serem removidas.
- O resumo mostra itens, subtotal, combos aplicados e total, atualizados a cada alteração.

## Checkout (US08, US09, US10)

1. **Recebimento:** retirada na loja (sem taxa, com o endereço da loja) ou entrega (escolha ou cadastro de endereço ali mesmo).
2. **Pagamento:** Pix, cartão de crédito (número, nome, validade e CVV) ou dinheiro na retirada ou entrega, mais observações do pedido.
3. **Resumo:** itens, subtotal, descontos, taxa e total, recalculados pela API a cada mudança de modalidade ou endereço.
4. **Confirmação:** tela com o número do pedido, o total, a situação do pagamento e o botão "Acompanhar pedido".

## Pedidos (US11)

- **Meus pedidos:** número, data, modalidade, total e status de cada pedido.
- **Acompanhamento:** status atual, data de criação, linha do tempo com o horário de cada etapa (com "Em rota de entrega" apenas para entregas), modalidade, endereço, pagamento, observações e resumo de valores. A tela se atualiza sozinha a cada 30 segundos.

## Encomendas especiais (US12)

Formulário com descrição, quantidade (mínimo de 6), data desejada e observações, ao lado da lista de solicitações com status (em análise, aprovada ou recusada), valor proposto e resposta da loja.
