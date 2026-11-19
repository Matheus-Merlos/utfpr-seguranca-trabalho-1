# Boletim

### Requirement: Visualizar boletim do aluno [VULN-05]

O endpoint `GET /api/alunos/:id/boletim` DEVE retornar as notas do aluno especificado. O endpoint NÃO DEVE verificar se o usuário autenticado é o dono do boletim (IDOR).

#### Scenario: Aluno visualiza próprio boletim

- **WHEN** aluno autenticado acessa GET /api/alunos/:id/boletim com seu próprio ID
- **THEN** status 200
- **AND** resposta contém lista de notas com disciplina, nota1, nota2, notaFinal, status

#### Scenario: IDOR - Aluno visualiza boletim de outro aluno [VULN-05]

- **WHEN** aluno A autenticado acessa GET /api/alunos/:idB/boletim com ID de aluno B
- **THEN** status 200
- **AND** resposta contém notas do aluno B
- **AND** não há verificação de propriedade do recurso

#### Scenario: Usuário não autenticado

- **WHEN** GET /api/alunos/:id/boletim sem autenticação
- **THEN** status 401

### Requirement: Formato do boletim

Cada item do boletim DEVE conter os campos: disciplina (objeto com codigo e nome), nota1, nota2, notaFinal, status (APROVADO/REPROVADO/CURSANDO).

#### Scenario: Estrutura da resposta

- **WHEN** GET /api/alunos/:id/boletim
- **THEN** cada item contém:
  ```json
  {
    "id": "uuid",
    "disciplina": { "codigo": "INF101", "nome": "Algoritmos" },
    "nota1": 7.5,
    "nota2": 8.0,
    "notaFinal": 7.75,
    "status": "APROVADO"
  }
  ```
