export const UNEXPECTED_ERROR_CODE = 'CS-SYS-0001'
export const NETWORK_ERROR_CODE = 'CS-NET-0001'

const MESSAGES: Record<string, string> = {
  [UNEXPECTED_ERROR_CODE]: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
  'CS-SYS-0002': 'Alguns campos estão inválidos. Revise e tente novamente.',
  'CS-SYS-0003': 'O recurso solicitado não foi encontrado.',
  'CS-SYS-0004': 'Operação não permitida.',
  'CS-CAT-0001': 'Imagem não encontrada.',
  'CS-CAT-0003': 'Produto não encontrado ou fora do catálogo.',
  'CS-CAT-0002': 'O preço mínimo não pode ser maior que o preço máximo.',
  [NETWORK_ERROR_CODE]: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
}

export function messageForCode(code: string): string {
  return MESSAGES[code] ?? MESSAGES[UNEXPECTED_ERROR_CODE] ?? code
}
