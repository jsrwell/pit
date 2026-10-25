---
code: "FE-QA-01"
name: "Estratégia de testes e rastreabilidade do frontend"
updated: "2026/10/25"
---

# Estratégia de testes e rastreabilidade do frontend

## Abordagem

- Testes com Vitest e Testing Library (jsdom), escritos do ponto de vista do usuário: elementos são encontrados por papel, rótulo e texto visível.
- As funções de `api/` são substituídas com `vi.spyOn`; nenhum teste chama o backend real. As regras de negócio são cobertas pelos testes do backend, e os do frontend garantem que a tela coleta, envia e mostra corretamente.
- `src/test/render-with-router.tsx` renderiza componentes que usam rotas e confere redirecionamentos.

```bash
cd frontend
npm test
```

O CI executa também `format:check`, `lint`, `build` e o build da imagem.

## Rastreabilidade

| Cartão | O que é verificado                                                         | Teste                                           |
| ------ | -------------------------------------------------------------------------- | ----------------------------------------------- |
| US01   | Card com nome, imagem, preço e link; destaques e indisponíveis sinalizados | `catalog/components/Storefront.test.tsx`        |
| US02   | Filtros por categoria, sabor e faixa de preço                              | `catalog/components/FilterBar.test.tsx`         |
| US03   | Descrição, preço, imagem, composição, diferenciais e indisponibilidade     | `catalog/components/ProductDetailView.test.tsx` |
| US04   | Envio dos campos e erros por campo vindos da API                           | `accounts/components/RegisterForm.test.tsx`     |
| IMP04  | E-mail inválido barrado antes da API, máscara e limite do telefone, limites de tamanho | `accounts/components/RegisterForm.test.tsx`, `accounts/validation/account-fields.test.ts`, `shared/format/phone.test.ts` |
| US05   | Login grava a sessão; credencial errada mostra a mensagem                  | `accounts/components/LoginForm.test.tsx`        |
| US05   | Sessão vencida é descartada; token enviado e sessão apagada em 401         | `shared/auth/session-store.test.ts`, `shared/api/http-client.test.ts` |
| US06   | Quantidade escolhida, atualização do carrinho e login exigido              | `cart/components/AddToCart.test.tsx`            |
| US07   | Alterar quantidade, remover e bloquear com item indisponível               | `cart/components/CartView.test.tsx`             |
| US08   | Retirada sem taxa e entrega com taxa e endereço                            | `orders/components/CheckoutView.test.tsx`       |
| US09   | Cadastro de endereço e escolha do principal                                | `accounts/components/AddressBook.test.tsx`      |
| US10   | Pagamento com cartão e confirmação do pedido                               | `orders/components/CheckoutView.test.tsx`       |
| US11   | Status atual, data e linha do tempo da entrega                             | `orders/components/OrderTracking.test.tsx`      |
| US12   | Envio da encomenda e aviso de antecedência                                 | `orders/components/CustomOrderForm.test.tsx`    |
| US12   | Aprovação com valor e resposta                                             | `orders/components/admin/CustomOrderReviewCard.test.tsx` |
| US13   | Upload de imagem e cadastro completo; explicação de publicação incompleta  | `catalog/components/admin/ProductForm.test.tsx` |
| US14   | Alternância de disponibilidade                                             | `catalog/components/admin/AvailabilityToggle.test.tsx` |
| US15   | Dados do cliente, observações e apenas os próximos passos válidos          | `orders/components/admin/StoreOrderCard.test.tsx` |
| IMP02  | Marcar e desmarcar, persistência no navegador e falha do armazenamento     | `catalog/hooks/favorites-store.test.ts`         |
| IMP02  | Coração no card e no detalhe; opção "Favoritos" e estado vazio             | `catalog/components/Storefront.test.tsx`, `catalog/components/ProductDetailView.test.tsx` |
| IMP03  | Grade atenuada, `aria-busy` e anúncio enquanto um filtro é aplicado        | `catalog/components/Storefront.test.tsx`        |
| IMP05  | WhatsApp com mensagem inicial, telefone e e-mail como links no rodapé      | `app/layout/SiteFooter.test.tsx`                |
| IMP06  | Cupom aplicado no resumo e enviado no pedido; cupom recusado no campo sem perder dados | `orders/components/CheckoutView.test.tsx` |
| IMP06  | Cadastro e desativação de cupons no painel                                 | `promotions/components/admin/CouponManager.test.tsx` |
| IMP07  | Contador de caracteres, parada no limite e contador opcional em campos de linha única | `shared/components/TextAreaField.test.tsx`, `shared/components/TextField.test.tsx` |
| IMP07  | Limites de descrição e observações da encomenda iguais aos da API          | `orders/components/CustomOrderForm.test.tsx`    |
| IMP08  | Edição com validação, sessão atualizada, troca de senha, exclusão confirmada e bloqueada por pedidos | `accounts/components/AccountSettings.test.tsx` |
| IMP09  | Busca do cabeçalho como região de busca, termo na URL e retorno à vitrine completa | `catalog/components/HeaderSearch.test.tsx` |
| IMP09  | Vitrine filtrada pelo termo da URL, termo ativo com "Limpar busca", resultado vazio e barra sem campo de texto | `catalog/components/Storefront.test.tsx`, `catalog/components/FilterBar.test.tsx` |
| US16   | Preço promocional, vitrine de combos e cadastro de campanha                | `shared/components/PriceTag.test.tsx`, `promotions/components/ComboShowcase.test.tsx`, `promotions/components/admin/PromotionManager.test.tsx` |

Os caminhos são relativos a `frontend/src/features/`, exceto os que começam com `shared/` ou `app/`, relativos a `frontend/src/`.
