## ADDED Requirements

### Requirement: Template de ficha de achado

O template DEVE conter os seguintes campos obrigatórios:
- **ID**: Identificador único (ACH-XX)
- **Título**: Nome descritivo da vulnerabilidade
- **Categoria OWASP Top 10:2025**: Código e nome (ex: A01 Broken Access Control)
- **CWE**: Código e nome do weakness (ex: CWE-89 SQL Injection)
- **Teste WSTG**: Referência ao teste do OWASP Web Security Testing Guide
- **Severidade**: Crítica, Alta, Média, Baixa ou Informativa
- **Vetor CVSS 3.1**: String completa do vetor (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N)
- **Nota CVSS**: Valor numérico de 0.0 a 10.0
- **Ativo afetado**: URL, endpoint ou componente vulnerável
- **Responsável**: Membro do grupo que documentou o achado
- **Descrição**: Explicação técnica da vulnerabilidade
- **Pré-condições**: Estado necessário para exploração (ex: usuário autenticado)
- **Passos para reproduzir**: Lista numerada de ações
- **Payloads**: Código ou entrada maliciosa utilizada
- **Evidências**: Lista de arquivos no padrão evXX-descricao.png
- **Impacto**: Consequências concretas da exploração
- **Recomendação**: Como corrigir a vulnerabilidade
- **Correção aplicada**: Código antes/depois + link do PR
- **Reteste**: Resultado do reteste local e pós-deploy
- **Status**: Aberto, Em correção, Corrigido, Validado

#### Scenario: Preenchimento completo de achado SQLi

- **WHEN** auditor documenta uma vulnerabilidade de SQL Injection
- **THEN** todos os campos obrigatórios são preenchidos
- **AND** o vetor CVSS 3.1 está completo com todas as métricas base
- **AND** há pelo menos 2 evidências com URL visível na barra do navegador

### Requirement: Critério de aceite em checklist

O template DEVE incluir ao final uma seção de critério de aceite com checklist para auto-revisão:
- [ ] Vulnerabilidade é reproduzível apenas seguindo os passos documentados
- [ ] Vetor CVSS 3.1 está completo (todas as 8 métricas base)
- [ ] Há no mínimo 2 screenshots com URL visível
- [ ] Request e response do Burp estão incluídos
- [ ] Impacto concreto está descrito (não genérico)
- [ ] PR de correção está linkado
- [ ] Reteste local foi realizado e documentado
- [ ] Reteste pós-deploy foi realizado e documentado

#### Scenario: Validação por checklist antes de submeter

- **WHEN** auditor finaliza a documentação de um achado
- **THEN** todos os itens do checklist devem estar marcados
- **AND** revisão por outro membro do grupo deve validar os itens

### Requirement: Exemplo preenchido com aplicação fictícia

O template DEVE incluir um exemplo completo preenchido usando uma aplicação fictícia chamada "loja-exemplo", NUNCA usando dados do SIGAcad ou qualquer referência ao catálogo interno.

#### Scenario: Exemplo não revela vulnerabilidades reais

- **WHEN** o template com exemplo é commitado no repositório público
- **THEN** nenhuma referência a VULN-XX, endpoints do SIGAcad ou payloads específicos está presente
- **AND** o exemplo usa apenas dados fictícios da "loja-exemplo"
