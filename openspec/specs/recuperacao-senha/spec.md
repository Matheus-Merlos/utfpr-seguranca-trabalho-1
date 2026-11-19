# Recuperação de Senha

### Requirement: Solicitar recuperação de senha [VULN-11]

O endpoint `POST /api/auth/recuperar-senha` DEVE gerar um token de recuperação usando `base64(email + ":" + data)`. O token NÃO DEVE expirar e NÃO DEVE ser invalidado após uso.

#### Scenario: Solicitar recuperação

- **WHEN** POST /api/auth/recuperar-senha com `{ "email": "admin@sigacad.edu.br" }`
- **THEN** status 200
- **AND** mensagem "Se o email existir, enviaremos instruções"

#### Scenario: Token previsível [VULN-11]

- **WHEN** atacante calcula `base64("vitima@email.com:2026-11-18")`
- **THEN** resultado é o token válido para resetar senha da vítima naquele dia

#### Scenario: Token não expira [VULN-11]

- **WHEN** token foi gerado há 30 dias
- **THEN** ainda é aceito para resetar senha

### Requirement: Resetar senha com token

O endpoint `POST /api/auth/resetar-senha` DEVE aceitar o token e a nova senha, sem validar expiração.

#### Scenario: Resetar senha com token válido

- **WHEN** POST /api/auth/resetar-senha com `{ "token": "<base64>", "novaSenha": "nova123" }`
- **THEN** status 200
- **AND** senha do usuário é atualizada para MD5 da nova senha

#### Scenario: Token usado múltiplas vezes [VULN-11]

- **WHEN** mesmo token é usado para resetar senha duas vezes
- **THEN** ambas as requisições são aceitas
- **AND** senha é atualizada em ambas

#### Scenario: Token inválido

- **WHEN** POST /api/auth/resetar-senha com token que não decodifica para email:data válidos
- **THEN** status 400
- **AND** mensagem "Token inválido"
