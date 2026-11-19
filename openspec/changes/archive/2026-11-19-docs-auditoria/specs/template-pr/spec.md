## ADDED Requirements

### Requirement: Template de Pull Request para correções

O arquivo `.github/pull_request_template.md` DEVE conter campos para:
- **Achado relacionado**: ID do achado (ACH-XX)
- **O que foi corrigido**: Descrição da correção aplicada
- **Como validar**: Instruções de teste com docker compose, payload e resultado esperado
- **Checklist de revisão**: Lista de verificações obrigatórias

#### Scenario: PR de correção segue template

- **WHEN** desenvolvedor abre PR para corrigir vulnerabilidade
- **THEN** template é preenchido automaticamente pelo GitHub
- **AND** todos os campos obrigatórios são visíveis

### Requirement: Instruções de validação reproduzíveis

A seção "Como validar" DEVE incluir:
1. Comando para subir ambiente: `docker compose up -d`
2. Payload ou ação para testar (antes da correção falhava)
3. Resultado esperado após a correção

#### Scenario: Revisor consegue validar a correção

- **WHEN** revisor segue as instruções de "Como validar"
- **THEN** consegue confirmar que a vulnerabilidade foi corrigida
- **AND** não precisa de conhecimento prévio do código

### Requirement: Checklist de revisão obrigatório

O template DEVE incluir checklist com:
- [ ] Ficha de achado preenchida em docs/achados/
- [ ] Evidências de antes da correção anexadas
- [ ] Evidências de depois da correção anexadas
- [ ] Reteste local realizado e documentado
- [ ] Código segue boas práticas (sem novos problemas)

#### Scenario: PR não é mergeado sem checklist completo

- **WHEN** PR é aberto com itens do checklist desmarcados
- **THEN** revisor identifica facilmente o que está faltando
- **AND** solicita que autor complete antes do merge
