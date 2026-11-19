# Disciplinas

### Requirement: Buscar disciplinas por termo [VULN-02]

O endpoint `GET /api/disciplinas` DEVE aceitar um parâmetro `busca` e construir a query SQL concatenando o termo diretamente na cláusula LIKE, sem usar prepared statements ou query builder parametrizado.

#### Scenario: Busca simples por nome

- **WHEN** GET /api/disciplinas?busca=Algoritmos
- **THEN** status 200
- **AND** resposta contém disciplinas cujo nome contém "Algoritmos"

#### Scenario: Busca por código

- **WHEN** GET /api/disciplinas?busca=INF101
- **THEN** status 200
- **AND** resposta contém disciplinas cujo código contém "INF101"

#### Scenario: Busca vazia retorna todas

- **WHEN** GET /api/disciplinas (sem parâmetro busca)
- **THEN** status 200
- **AND** resposta contém todas as disciplinas cadastradas

#### Scenario: SQL Injection via UNION [VULN-02]

- **WHEN** GET /api/disciplinas?busca=' UNION SELECT username, senha, email, role, '1' FROM usuarios --
- **THEN** status 200
- **AND** resposta contém dados extraídos da tabela usuarios

### Requirement: Listar detalhes de disciplina

O endpoint `GET /api/disciplinas/:id` DEVE retornar os detalhes de uma disciplina específica.

#### Scenario: Disciplina existente

- **WHEN** GET /api/disciplinas/:id com ID válido
- **THEN** status 200
- **AND** resposta contém id, codigo, nome, cargaHoraria, professor

#### Scenario: Disciplina não encontrada

- **WHEN** GET /api/disciplinas/:id com ID inexistente
- **THEN** status 404
