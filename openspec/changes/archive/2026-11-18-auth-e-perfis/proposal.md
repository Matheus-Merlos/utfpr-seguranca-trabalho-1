## Why

A aplicação precisa de autenticação para distinguir alunos, professores e administradores. Este change implementa login, gerenciamento de sessão via JWT, recuperação de senha e edição de perfil — incluindo as vulnerabilidades de autenticação do catálogo.

## What Changes

- Criar endpoint `POST /api/auth/login` com autenticação por username/senha
- Criar endpoint `POST /api/auth/recuperar-senha` para solicitar reset
- Criar endpoint `POST /api/auth/resetar-senha` para aplicar novo password
- Criar endpoint `GET /api/auth/me` para obter usuário autenticado
- Criar endpoint `PATCH /api/usuarios/me` para editar perfil próprio
- Implementar guard de autenticação JWT para rotas protegidas
- Criar decorator `@Roles()` para autorização por perfil
- Criar páginas de login, recuperação de senha e perfil no frontend

## Vulnerabilidades implementadas

- **VULN-01** [A05] SQLi no login: query concatena username e hash
- **VULN-07** [A01] Mass assignment em PATCH /api/usuarios/me aceita campo role
- **VULN-08** [A04] Senhas armazenadas como MD5 sem sal
- **VULN-09** [A07] JWT HS256 com segredo "segredo123", sem expiração
- **VULN-10** [A07] Login sem rate limit, mensagens distintas por tipo de erro
- **VULN-11** [A07] Token de recuperação previsível: base64(email:data)
- **VULN-12** [A07/A02] Cookie JWT sem HttpOnly (permite roubo via XSS)

## Fora de escopo

- Endpoints de disciplinas, boletim e notas (change `nucleo-academico`)
- Mural de recados (change `nucleo-academico`)
- Infraestrutura e deploy (change `infra`)

## Capabilities

### New Capabilities

- `autenticacao`: Login, validação JWT, guards de autenticação e autorização
- `recuperacao-senha`: Fluxo de recuperação de senha com token por email
- `perfil-usuario`: Visualização e edição do perfil próprio

### Modified Capabilities

(nenhuma)

## Impact

- Adiciona módulo `auth` no backend com controller, service e guards
- Adiciona módulo `usuarios` no backend para perfil
- Adiciona dependência `@nestjs/jwt`
- Frontend ganha páginas de login, recuperação de senha e perfil
- Todas as rotas futuras poderão usar `@UseGuards(JwtAuthGuard)` e `@Roles()`
