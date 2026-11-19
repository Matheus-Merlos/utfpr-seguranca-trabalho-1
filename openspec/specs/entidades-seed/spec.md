# Entidades e Seed

### Requirement: Entidade Usuario

A entidade `Usuario` DEVE ter os seguintes campos:
- `id`: UUID, chave primária
- `username`: string única, usado para login
- `email`: string única
- `senha`: string (hash da senha)
- `nomeExibicao`: string, nome para exibição na interface
- `role`: enum (ALUNO, PROFESSOR, ADMIN)

#### Scenario: Criar usuário válido

- **WHEN** um registro de Usuario é criado com todos os campos preenchidos
- **THEN** o registro é salvo no banco de dados
- **AND** o `id` é gerado automaticamente

### Requirement: Entidade Disciplina

A entidade `Disciplina` DEVE ter os seguintes campos:
- `id`: UUID, chave primária
- `codigo`: string única (ex: "CS101")
- `nome`: string (ex: "Introdução à Programação")
- `professorId`: UUID, referência ao Usuario (role PROFESSOR)

#### Scenario: Criar disciplina com professor

- **WHEN** uma Disciplina é criada com `professorId` de um professor existente
- **THEN** o registro é salvo
- **AND** a relação com o professor é estabelecida

### Requirement: Entidade Matricula

A entidade `Matricula` DEVE representar a associação entre aluno e disciplina:
- `id`: UUID, chave primária
- `alunoId`: UUID, referência ao Usuario (role ALUNO)
- `disciplinaId`: UUID, referência à Disciplina

#### Scenario: Matricular aluno em disciplina

- **WHEN** uma Matricula é criada ligando um aluno a uma disciplina
- **THEN** o registro é salvo
- **AND** o aluno pode ser listado na disciplina
- **AND** a disciplina aparece no boletim do aluno

### Requirement: Entidade Nota

A entidade `Nota` DEVE representar uma avaliação do aluno:
- `id`: UUID, chave primária
- `matriculaId`: UUID, referência à Matricula
- `tipo`: string (ex: "P1", "P2", "Trabalho")
- `valor`: decimal (0.0 a 10.0)

#### Scenario: Lançar nota para aluno

- **WHEN** uma Nota é criada para uma Matricula existente
- **THEN** o registro é salvo
- **AND** a nota aparece no boletim do aluno

### Requirement: Entidade Recado

A entidade `Recado` DEVE representar uma mensagem no mural:
- `id`: UUID, chave primária
- `conteudo`: text, conteúdo da mensagem
- `dataHora`: timestamp, momento da postagem
- `autorId`: UUID, referência ao Usuario
- `disciplinaId`: UUID, referência à Disciplina (opcional, null = mural geral)

#### Scenario: Postar recado no mural

- **WHEN** um Recado é criado com autor e conteúdo
- **THEN** o registro é salvo com `dataHora` preenchido automaticamente

### Requirement: Seed com dados fictícios

O comando `npm run seed` DEVE popular o banco com dados de demonstração:
- 1 usuário ADMIN (username: `admin`)
- 3 usuários PROFESSOR
- ~20 usuários ALUNO
- ~8 disciplinas
- Matrículas conectando alunos a disciplinas
- Notas para as matrículas
- Recados no mural

#### Scenario: Executar seed em banco vazio

- **WHEN** `npm run seed` é executado em banco vazio
- **THEN** todos os registros são criados
- **AND** o usuário `admin` existe com role ADMIN

### Requirement: Seed com credencial padrão [VULN-14]

O usuário admin do seed DEVE ter credenciais triviais:
- username: `admin`
- senha: `admin`

#### Scenario: Login com credencial padrão do seed

- **WHEN** login é tentado com username `admin` e senha `admin`
- **THEN** o login é bem-sucedido
- **AND** o usuário tem role ADMIN

### Requirement: Seed idempotente

O seed DEVE ser seguro para executar múltiplas vezes:
- Se os dados já existem, não duplicar
- Pode usar upsert ou verificação prévia

#### Scenario: Executar seed duas vezes

- **WHEN** `npm run seed` é executado em banco já populado
- **THEN** não há erro de duplicação
- **AND** os dados permanecem consistentes
