# Perfil de Usuário

### Requirement: Visualizar perfil próprio

O endpoint `GET /api/usuarios/me` DEVE retornar os dados do usuário autenticado (mesmo que /api/auth/me, mas no módulo de usuários).

#### Scenario: Obter perfil

- **WHEN** GET /api/usuarios/me com autenticação válida
- **THEN** status 200
- **AND** resposta contém `id`, `username`, `email`, `nomeExibicao`, `role`

### Requirement: Editar perfil com mass assignment [VULN-07]

O endpoint `PATCH /api/usuarios/me` DEVE aceitar um DTO que inclui o campo `role`, permitindo que o usuário altere seu próprio perfil de acesso.

#### Scenario: Atualizar nome de exibição

- **WHEN** PATCH /api/usuarios/me com `{ "nomeExibicao": "Novo Nome" }`
- **THEN** status 200
- **AND** nomeExibicao do usuário é atualizado

#### Scenario: Atualizar email

- **WHEN** PATCH /api/usuarios/me com `{ "email": "novo@email.com" }`
- **THEN** status 200
- **AND** email do usuário é atualizado

#### Scenario: Escalar privilégio via mass assignment [VULN-07]

- **WHEN** aluno envia PATCH /api/usuarios/me com `{ "role": "ADMIN" }`
- **THEN** status 200
- **AND** role do usuário é alterado para ADMIN
- **AND** próximo login terá permissões de administrador

### Requirement: Logout

O endpoint `POST /api/auth/logout` DEVE limpar o cookie de sessão.

#### Scenario: Fazer logout

- **WHEN** POST /api/auth/logout com sessão ativa
- **THEN** status 200
- **AND** cookie `token` é removido (expires no passado)
