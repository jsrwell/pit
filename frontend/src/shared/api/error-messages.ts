export const UNEXPECTED_ERROR_CODE = 'CS-SYS-0001'
export const NETWORK_ERROR_CODE = 'CS-NET-0001'
export const AUTHENTICATION_REQUIRED_CODE = 'CS-SYS-0005'

const MESSAGES: Record<string, string> = {
  [UNEXPECTED_ERROR_CODE]: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
  'CS-SYS-0002': 'Alguns campos estão inválidos. Revise e tente novamente.',
  'CS-SYS-0003': 'O recurso solicitado não foi encontrado.',
  'CS-SYS-0004': 'Operação não permitida.',
  [AUTHENTICATION_REQUIRED_CODE]: 'Sua sessão expirou ou você não está conectado. Entre novamente.',
  'CS-SYS-0006': 'Você não tem permissão para realizar esta ação.',
  'CS-CAT-0001': 'Imagem não encontrada.',
  'CS-CAT-0002': 'O preço mínimo não pode ser maior que o preço máximo.',
  'CS-CAT-0003': 'Produto não encontrado ou fora do catálogo.',
  'CS-CAT-0004': 'Para publicar o produto, informe descrição, composição e imagem.',
  'CS-CAT-0005': 'Formato de imagem não aceito. Envie PNG, JPEG ou WebP.',
  'CS-CAT-0006': 'A imagem é grande demais. Envie um arquivo de até 2 MB.',
  'CS-CAT-0007': 'Este cupcake está indisponível no momento.',
  'CS-CRT-0001': 'Limite de 50 unidades por produto em um pedido.',
  'CS-CRT-0002': 'Este item não está mais no carrinho.',
  'CS-ACC-0001': 'Já existe uma conta cadastrada com este e-mail.',
  'CS-ACC-0002': 'A senha precisa ter no mínimo 8 caracteres, com letras e números.',
  'CS-ACC-0003': 'E-mail ou senha incorretos.',
  'CS-ACC-0004':
    'Muitas tentativas sem sucesso. Por segurança, o acesso foi bloqueado por alguns minutos.',
  'CS-ACC-0005': 'Endereço não encontrado.',
  'CS-ACC-0006': 'A senha atual não confere. Digite-a novamente.',
  'CS-ACC-0007':
    'Você tem pedidos em andamento. A conta pode ser excluída quando eles forem concluídos ou cancelados.',
  'CS-ORD-0001': 'Escolha um endereço de entrega cadastrado.',
  'CS-ORD-0002': 'Seu carrinho está vazio.',
  'CS-ORD-0003': 'Há itens indisponíveis no carrinho. Remova-os para continuar.',
  'CS-ORD-0004': 'Confira o número, a validade e o código de segurança do cartão.',
  'CS-ORD-0005':
    'O pagamento foi recusado pela operadora. Tente outro cartão ou forma de pagamento.',
  'CS-ORD-0006': 'Pedido não encontrado.',
  'CS-ORD-0007': 'Este pedido não pode ir para esse status. Siga as etapas na ordem.',
  'CS-ORD-0008': 'A data escolhida não respeita a antecedência mínima para encomendas.',
  'CS-ORD-0009': 'Encomenda não encontrada.',
  'CS-ORD-0010': 'Esta encomenda já foi analisada.',
  'CS-PRM-0001': 'O fim da vigência precisa ser posterior ao início.',
  'CS-PRM-0002': 'Promoção não encontrada.',
  'CS-PRM-0003': 'Combo não encontrado.',
  'CS-PRM-0004': 'Produto da promoção não encontrado.',
  'CS-PRM-0005': 'Cupom não encontrado.',
  'CS-PRM-0006': 'Já existe um cupom com este código.',
  'CS-PRM-0007':
    'Cupom inválido, inativo ou fora da validade. Confira o código ou finalize sem cupom.',
  [NETWORK_ERROR_CODE]: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
}

export function messageForCode(code: string): string {
  return MESSAGES[code] ?? MESSAGES[UNEXPECTED_ERROR_CODE] ?? code
}
