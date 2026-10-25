---
code: "REV"
name: "Revisões originais dos testes com usuários"
status: "implemented"
history: []
---

# Revisões originais

Respostas coletadas pelo Google Forms durante os testes da aplicação publicada. Foram mantidas as cinco revisões com ajustes coerentes com o escopo do projeto e simples de implementar. O texto de cada resposta é transcrito sem edição; cada revisão recebe um código `REVnn`, e cada sugestão dela é encaminhada a um cartão de melhoria `IMPnn` desta pasta, que adota a solução mais simples capaz de atendê-la.

Este documento é histórico e não deve ser reescrito; evoluções ocorrem nos cartões de melhoria.

## REV01

| Campo | Resposta |
| --- | --- |
| Carimbo de data/hora | 18/10/2026 15:58:18 |
| Nome | Camila Afonso Lemes |
| Data do teste | 18/10/2026 |
| O que testou e funcionou | Testei toda a parte de navegação no menu, adição e remoção de produtos, também testei a parte de entrar para ver mais detalhes sobre o produto. |
| O que testou e não funcionou – O que deve ser corrigido | Tudo o que testado funcionou corretamente e acredito que um ponto de melhoria, poderia ser deixar os botões de adicionar os produtos com as bordas levemente mais arredondadas |
| Funcionalidade não testada (faltou ou não foi implementada) | Todas as funcionalidades foram testadas e acredito que algo que senti falta seria a opção de colocar os produtos em uma parte de favoritos tipo com o símbolo de coração, para facilitar achar eles na próxima vez que entrar no site |

| Sugestão | Encaminhamento |
| --- | --- |
| Bordas mais arredondadas nos botões de adicionar | [IMP01](./IMP01_round_add_buttons.md) |
| Lista de favoritos com símbolo de coração | [IMP02](./IMP02_favorite_products.md) |

## REV02

| Campo | Resposta |
| --- | --- |
| Carimbo de data/hora | 19/10/2026 07:40:23 |
| Nome | Erick Victor de Souza de Oliveira |
| Data do teste | 19/10/2026 |
| O que testou e funcionou | Acesso a tela principal, vitrine, filtragem de produtos, criação de pedido, acompanhar pedido, criação de conta, login, logout, carrinho. |
| O que testou e não funcionou – O que deve ser corrigido | Não encontrei falhas. |
| Funcionalidade não testada (faltou ou não foi implementada) | Senti falta de uma resposta melhor do site ao realizar filtragens, como um carregamento de tela ou algo pra dar essa ideia de progresso. |

| Sugestão | Encaminhamento |
| --- | --- |
| Indicação de progresso ao filtrar | [IMP03](./IMP03_filter_loading_feedback.md) |

## REV03

| Campo | Resposta |
| --- | --- |
| Carimbo de data/hora | 19/10/2026 11:11:42 |
| Nome | Daniel Moreira Ribeiro |
| Data do teste | 19/10/2026 |
| O que testou e funcionou | Criação de conta: O fluxo de cadastro foi concluído com sucesso. A inserção de dados válidos resultou na criação do perfil e liberação de acesso sem erros.<br><br>Vitrine: A navegação pelos produtos e a renderização da página de detalhes operaram perfeitamente, exibindo todas as informações do item selecionado.<br><br>Carrinho de compras: As ações de gerenciamento foram validadas. A inclusão e a remoção de itens responderam conforme o esperado, atualizando a interface corretamente. |
| O que testou e não funcionou – O que deve ser corrigido | Criação de conta (Validação de campos): Os campos de e-mail e telefone não possuem validação de formato. O sistema permite concluir o cadastro mesmo quando o usuário insere dados inválidos (como e-mails sem o caractere "@" ou telefones com letras e tamanho incorreto). |
| Funcionalidade não testada (faltou ou não foi implementada) | Atendimento ao cliente: Não foi identificada uma página ou botão de contato direto com a loja, o que pode dificultar o suporte em caso de dúvidas durante a navegação.<br><br>Checkout (Cupons de desconto): Sugere-se a inclusão de um campo para aplicação de cupons na etapa de pagamento. |

| Sugestão | Encaminhamento |
| --- | --- |
| Validação de formato de e-mail e telefone no cadastro | [IMP04](./IMP04_validate_signup_fields.md) |
| Contato direto com a loja | [IMP05](./IMP05_store_contact_channel.md) |
| Cupons de desconto no checkout | [IMP06](./IMP06_discount_coupons.md) |

## REV04

| Campo | Resposta |
| --- | --- |
| Carimbo de data/hora | 19/10/2026 11:37:37 |
| Nome | Daniel Bonam Rissardi |
| Data do teste | 19/10/2026 |
| O que testou e funcionou | Testei o fluxo de navegação padrão, testei a criação de uma nova conta, pedido de cupcake pelo pix com retirada no local, testei encomendas especiais. |
| O que testou e não funcionou – O que deve ser corrigido | No momento da criação da conta, o campo de telefone não tem limite de caracteres, daria para limitar pela quantidade de caracteres que o telefone aceita, acredito que os outros campos tbm não tenha nenhuma validação.<br><br>Além do campo de criação da conta, acho que diversos outros campos estão sem essa validação. Por ex: no momento de fazer um pedido especial, ao colocar muitos caracteres ele permite sem limite. (e a responsividade no mobile quebra com muitos caracteres.) |
| Funcionalidade não testada (faltou ou não foi implementada) | Não testei as outras formas de pedido como pedido para entrega (não testei o cadastro de endereço).<br><br>Algo que eu fui testar mas não havia o fluxo (não sei se entra no escopo da atividade). foi a questão de editar os dados da própria conta, como mudar nome, email, senha, etc ou até mesmo apagar a propria conta. (talvez um softdelete nos pedidos, na conta etc hehe) |

| Sugestão | Encaminhamento |
| --- | --- |
| Limite de caracteres no telefone e validação dos campos do cadastro | [IMP04](./IMP04_validate_signup_fields.md) |
| Limite de caracteres nos demais campos e quebra do layout móvel com textos longos | [IMP07](./IMP07_limit_text_fields.md) |
| Edição dos dados, troca de senha e exclusão lógica da própria conta | [IMP08](./IMP08_manage_own_account.md) |

## REV05

| Campo | Resposta |
| --- | --- |
| Carimbo de data/hora | 22/10/2026 20:43:13 |
| Nome | Fabio Henrique |
| Data do teste | 22/10/2026 |
| O que testou e funcionou | Navegação<br>- Criação de conta<br>- Adicionar produtos no carrinho<br>- Encomendas especiais<br>- Pedido na vitrine<br>- Adicionar endereço<br>- Pedido  e me obrigar a ter um endereço adicionado<br>- O front ta lindo |
| O que testou e não funcionou – O que deve ser corrigido | Não passei por nenhum erro de funcionamento, site ta muito bonito, apenas uma sugestão sobre a barra de pesquisa na vitrine. Apesar de tornar a pesquisa mais pratica sendo logo em cima das opções de produtos, ela me leva diretamente para oque eu busco, oque é uma oportunidade perdida de “obrigar” o usuário a passear pelas outras opções, poderia manter ela no menu superior. O filtro de preços também poderia ser mais simples, podendo ser de mais barato para mais caro e vice-versa, considerando que não exista uma variação de preços tão significativa entre os produtos, essas mudanças deixariam a barra mais simples e fariam o usuario passear mais pelas opções<br>(Não sou dev então não sei o quanto vou ajudar mas tentei fuçar o máximo possível, desejo todo sucesso |
| Funcionalidade não testada (faltou ou não foi implementada) | - Endereço ainda não puxa diretamente pelo cep.<br>- Edição de dados pessoais. |

| Sugestão | Encaminhamento |
| --- | --- |
| Barra de pesquisa no menu superior | [IMP09](./IMP09_header_search.md) |
| Filtro de preço substituído por ordenação do mais barato ao mais caro e vice-versa | [IMP10](./IMP10_sort_products_by_price.md) |
| Preenchimento do endereço a partir do CEP | [IMP11](./IMP11_autofill_address_by_zip.md) |
| Edição de dados pessoais | [IMP08](./IMP08_manage_own_account.md) |

## Navegação

[Índice](../README.md) · [Próximo: IMP01](./IMP01_round_add_buttons.md)
