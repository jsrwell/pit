# Regras de Mensagem de Commit

- Formato da mensagem: **convenção de mensagens de commit da Angular**
- Corpo com pontos (bullets) em linhas individuais
- Linha de cabeçalho ≤ 72 caracteres
- Resumo no modo imperativo, tempo presente, sem ponto final no fim
- Rodapé referencia problemas (`Closes #123`) ou notas sobre alterações de quebra (breaking changes)
- Nunca inserir menção de colaborações feitas por algum agente (co-authored by Claude ou outro agente)
- **Âmbito com código de requisito:** se a tarefa tiver um código bem definido (ex.: `TM-CD-0005`, `s-109`), esse código é o âmbito — `feat(TM-CD-0005): ...`. Se o commit cobrir múltiplos códigos, o âmbito reflecte o domínio ou área da alteração e cada código aparece como bullet no corpo.

```text
<tipo>(<âmbito>): <resumo curto>

[corpo com bullets de uma linha (sem quebra de linha dentro do bullet)]

[rodapé(s) opcional(ais)]
```
