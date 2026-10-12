# Princípios de Código

## Regras Gerais

- Todas as regras mencionadas nos ficheiros de rules DEVEM SEMPRE ser seguidas COMPLETAMENTE.
- Segue sempre as melhores práticas relacionadas à linguagem e ao formato do ficheiro com que estás a interagir.
- **Sem comentários internos:** Ao escrever código de implementação, EVITA SEMPRE escrever comentários internos. Comentários SÓ PODEM ser usados se forem absolutamente necessários para que o utilizador compreenda uma lógica complexa não declarada explicitamente no código. Se notares comentários desnecessários em ficheiros que estás a modificar, remove-os.
- **README.md:** O ficheiro `README.md` do projeto DEVE SEMPRE refletir a descrição do projeto diretamente, indicando o seu propósito e, ao lidar com itens como arquitetura e outros documentos específicos, deve conter links para os ficheiros em `docs/`.
- NUNCA insira comentários para divisão delimitadora interna de arquivo, dê preferencia em separar o arquivo em modulos, obedecendo principios SOLID, Clean Code, e DRY, arquitetura do projeto e boas praticas da linguagem.

## Princípios

- Usa sempre princípios **DRY** (tanto em código como em documentações).
- Usa sempre princípios **Clean Code**.
- Usa sempre princípios **SOLID**.

## Documentação

- Em caso de dúvidas, procura em `docs/` na raiz do projeto a documentação correspondente.
- Nunca cries nova documentação de projeto, a menos que seja **solicitado explícita e claramente pelo utilizador**.

## Comandos Durante Sessão

- Sempre dê preferencia em usar comandos listados no `.claude/settings.json` como autorizados.
