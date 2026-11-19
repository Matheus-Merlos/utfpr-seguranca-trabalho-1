## ADDED Requirements

### Requirement: Estrutura do relatório final

O template do relatório DEVE conter as seguintes seções na ordem especificada:

1. **Capa**: Título, nome do grupo, data, versão
2. **Sumário executivo**: Visão para leitor não técnico
3. **Escopo e ambiente**: O que foi testado e como
4. **Metodologia**: Abordagem e ferramentas utilizadas
5. **Critérios de severidade**: Explicação do CVSS 3.1
6. **Tabela-resumo de achados**: Visão consolidada
7. **Achados detalhados**: Fichas completas de cada vulnerabilidade
8. **Correções e validação**: PRs e retestes realizados
9. **Limitações**: O que não foi testado e por quê
10. **Conclusão e recomendações gerais**: Postura geral de segurança
11. **Apêndices**: Relatórios de scan, referências

#### Scenario: Relatório segue estrutura completa

- **WHEN** grupo gera o relatório final a partir do template
- **THEN** todas as 11 seções estão presentes
- **AND** cada seção contém conteúdo relevante (não apenas placeholder)

### Requirement: Sumário executivo para leitor não técnico

O sumário executivo DEVE conter:
- Avaliação geral da postura de segurança (1-2 parágrafos)
- Contagem de achados por severidade (tabela ou gráfico)
- Top 3 riscos mais críticos com impacto de negócio
- Recomendação prioritária

#### Scenario: Executivo entende os riscos sem conhecimento técnico

- **WHEN** leitor não técnico lê apenas o sumário executivo
- **THEN** consegue entender a gravidade geral da situação
- **AND** consegue identificar as 3 principais preocupações
- **AND** consegue entender a recomendação prioritária

### Requirement: Metodologia documentada

A seção de metodologia DEVE especificar:
- Framework utilizado: OWASP Web Security Testing Guide (WSTG)
- Fases da auditoria: reconhecimento, mapeamento, descoberta, exploração, documentação
- Ferramentas: OWASP ZAP, Burp Suite Community, sqlmap, DevTools do navegador
- Período de execução dos testes

#### Scenario: Metodologia é reproduzível

- **WHEN** outro auditor lê a seção de metodologia
- **THEN** consegue entender exatamente como os testes foram conduzidos
- **AND** consegue reproduzir a abordagem em outra aplicação

### Requirement: Tabela-resumo de achados

O relatório DEVE incluir uma tabela consolidada com:
- ID do achado
- Título
- Categoria OWASP
- Severidade
- Nota CVSS
- Status

#### Scenario: Visão rápida de todos os achados

- **WHEN** leitor consulta a tabela-resumo
- **THEN** consegue ver todos os achados em uma única página
- **AND** consegue identificar rapidamente os mais críticos pela severidade
