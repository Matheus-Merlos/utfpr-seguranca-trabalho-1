## ADDED Requirements

### Requirement: Explicação das métricas CVSS 3.1

O guia DEVE explicar de forma concisa cada métrica base do CVSS 3.1:

**Métricas de Exploitabilidade:**
- Attack Vector (AV): Network, Adjacent, Local, Physical
- Attack Complexity (AC): Low, High
- Privileges Required (PR): None, Low, High
- User Interaction (UI): None, Required

**Métricas de Impacto:**
- Scope (S): Unchanged, Changed
- Confidentiality (C): None, Low, High
- Integrity (I): None, Low, High
- Availability (A): None, Low, High

#### Scenario: Auditor entende cada métrica

- **WHEN** auditor consulta o guia para calcular CVSS
- **THEN** consegue entender o significado de cada métrica
- **AND** consegue escolher o valor correto para sua vulnerabilidade

### Requirement: Link para calculadora oficial

O guia DEVE incluir link para a calculadora oficial do FIRST:
https://www.first.org/cvss/calculator/3.1

#### Scenario: Acesso rápido à calculadora

- **WHEN** auditor precisa calcular o vetor CVSS
- **THEN** encontra o link da calculadora em destaque no guia

### Requirement: Faixas de severidade

O guia DEVE documentar as faixas de severidade padrão do CVSS 3.1:
- **Crítica**: 9.0 - 10.0
- **Alta**: 7.0 - 8.9
- **Média**: 4.0 - 6.9
- **Baixa**: 0.1 - 3.9
- **Informativa**: 0.0

#### Scenario: Classificação correta de severidade

- **WHEN** auditor obtém nota CVSS de 7.5
- **THEN** consulta o guia e classifica como severidade Alta

### Requirement: Exemplos genéricos de vetores

O guia DEVE incluir 3 exemplos genéricos de vetores CVSS com explicação:

1. **SQL Injection remoto sem autenticação** (Crítico ~9.8)
2. **XSS Stored que requer autenticação** (Alto ~6.1)
3. **Information Disclosure de versão do servidor** (Baixo ~3.1)

Exemplos DEVEM usar descrições genéricas, sem referência a aplicações específicas.

#### Scenario: Auditor aprende com exemplos

- **WHEN** auditor está em dúvida sobre como classificar uma vulnerabilidade
- **THEN** consulta os exemplos do guia para comparação
- **AND** consegue ajustar seu vetor com base em vulnerabilidades similares
