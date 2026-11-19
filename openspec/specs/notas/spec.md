# Notas

### Requirement: Atualizar nota sem verificação de role [VULN-06]

O endpoint `PATCH /api/notas/:id` DEVE permitir atualização de notas usando apenas autenticação JWT, sem verificar se o usuário tem role PROFESSOR. Qualquer usuário autenticado pode alterar qualquer nota.

#### Scenario: Professor atualiza nota

- **WHEN** professor autenticado envia PATCH /api/notas/:id com `{ "nota1": 8.5 }`
- **THEN** status 200
- **AND** nota1 é atualizada para 8.5

#### Scenario: Aluno altera própria nota [VULN-06]

- **WHEN** aluno autenticado envia PATCH /api/notas/:id (sua própria nota) com `{ "nota1": 10 }`
- **THEN** status 200
- **AND** nota1 é alterada para 10
- **AND** não há verificação de role

#### Scenario: Aluno altera nota de outro aluno [VULN-06]

- **WHEN** aluno A autenticado envia PATCH /api/notas/:idB (nota de aluno B) com `{ "notaFinal": 10 }`
- **THEN** status 200
- **AND** notaFinal do aluno B é alterada para 10

#### Scenario: Atualizar múltiplos campos

- **WHEN** PATCH /api/notas/:id com `{ "nota1": 7, "nota2": 8, "notaFinal": 7.5 }`
- **THEN** status 200
- **AND** todos os campos são atualizados

#### Scenario: Nota não encontrada

- **WHEN** PATCH /api/notas/:id com ID inexistente
- **THEN** status 404

### Requirement: Usuário não autenticado

#### Scenario: Requisição sem autenticação

- **WHEN** PATCH /api/notas/:id sem cookie de autenticação
- **THEN** status 401
