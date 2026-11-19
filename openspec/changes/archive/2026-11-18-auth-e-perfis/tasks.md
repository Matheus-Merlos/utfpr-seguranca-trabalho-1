## 1. Módulo de autenticação

- [x] 1.1 Criar módulo `auth` com controller, service e DTOs
- [x] 1.2 Instalar dependências: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`
- [x] 1.3 Implementar `POST /api/auth/login` com SQLi (query concatenada)
- [x] 1.4 Implementar hash MD5 sem sal para validação de senha
- [x] 1.5 Implementar geração de JWT com segredo "segredo123" sem expiração
- [x] 1.6 Configurar cookie `token` com `httpOnly: false`, `secure: true`, `sameSite: 'none'`
- [x] 1.7 Implementar mensagens de erro distintas (usuário/senha)
- [x] 1.8 Implementar `GET /api/auth/me` para obter usuário autenticado
- [x] 1.9 Implementar `POST /api/auth/logout` para limpar cookie
- [x] 1.10 Commit: `feat(backend): add auth module with login and jwt`

## 2. Guards e decorators

- [x] 2.1 Criar `JwtStrategy` que extrai token do cookie
- [x] 2.2 Criar `JwtAuthGuard` para proteger rotas
- [x] 2.3 Criar decorator `@Roles()` para autorização por perfil
- [x] 2.4 Criar `RolesGuard` que verifica role do JWT (sem consultar banco)
- [x] 2.5 Commit: `feat(backend): add jwt guards and roles decorator`

## 3. Recuperação de senha

- [x] 3.1 Implementar `POST /api/auth/recuperar-senha` com token previsível
- [x] 3.2 Gerar token como `base64(email:data)` sem expiração
- [x] 3.3 Implementar `POST /api/auth/resetar-senha` que aceita token sem validar expiração
- [x] 3.4 Permitir reutilização do mesmo token múltiplas vezes
- [x] 3.5 Commit: `feat(backend): add password recovery endpoints`

## 4. Módulo de usuários e perfil

- [x] 4.1 Criar módulo `usuarios` com controller e service
- [x] 4.2 Implementar `GET /api/usuarios/me` para visualizar perfil
- [x] 4.3 Implementar `PATCH /api/usuarios/me` com mass assignment (aceita role)
- [x] 4.4 Criar DTO `AtualizarPerfilDto` que inclui campo role
- [x] 4.5 Commit: `feat(backend): add user profile endpoints`

## 5. Frontend - páginas de autenticação

- [x] 5.1 Criar página de login em `/login`
- [x] 5.2 Criar página de recuperação de senha em `/recuperar-senha`
- [x] 5.3 Criar página de reset de senha em `/resetar-senha`
- [x] 5.4 Criar página de perfil em `/perfil`
- [x] 5.5 Implementar store de autenticação (lê cookie, estado do usuário)
- [x] 5.6 Adicionar navegação condicional (logado/não logado)
- [x] 5.7 Commit: `feat(frontend): add auth pages and profile`

## 6. Verificação das vulnerabilidades

- [x] 6.1 [VULN-01] Testar SQLi: `curl -X POST -d '{"username":"'"'"' OR '"'"'1'"'"'='"'"'1'"'"' --","senha":"x"}' http://localhost:3000/api/auth/login` retorna token do admin
- [x] 6.2 [VULN-07] Testar mass assignment: aluno faz PATCH com `{"role":"ADMIN"}` e vira admin
- [x] 6.3 [VULN-08] Verificar que senha "admin" gera hash "21232f297a57a5a743894a0e4a801fc3"
- [x] 6.4 [VULN-09] Verificar que JWT usa segredo "segredo123" e não tem expiração
- [x] 6.5 [VULN-10] Verificar mensagens distintas: "Usuário não encontrado" vs "Senha incorreta"
- [x] 6.6 [VULN-10] Verificar ausência de rate limit: 100 tentativas sem bloqueio
- [x] 6.7 [VULN-11] Testar token previsível: calcular base64 e resetar senha de outro usuário
- [x] 6.8 [VULN-12] Verificar que `document.cookie` retorna o token JWT
