## Context

O change `bootstrap` criou a estrutura base com entidades e seed. Agora precisamos implementar autenticação e gerenciamento de perfil. O sistema terá três perfis (ALUNO, PROFESSOR, ADMIN) com diferentes permissões.

A entidade `Usuario` já existe com campos `username`, `email`, `senha`, `nomeExibicao` e `role`. O seed já criou usuários com senhas hasheadas em MD5.

## Goals / Non-Goals

**Goals:**
- Implementar login com JWT
- Implementar guards de autenticação e autorização
- Implementar recuperação de senha
- Implementar edição de perfil
- Criar páginas correspondentes no frontend

**Non-Goals:**
- Endpoints de disciplinas, boletim, notas (próximo change)
- Mural de recados (próximo change)
- Two-factor authentication
- OAuth/social login

## Decisions

### D1: SQLi no login [VULN-01]

O login usará `dataSource.query()` com template string ao invés de query parametrizada. Isso permite injeção SQL no campo username.

```typescript
const result = await this.dataSource.query(
  `SELECT * FROM usuarios WHERE username = '${username}' AND senha = '${hash}'`
);
```

Parece código de alguém que não conhece SQL injection ou que "simplificou" para evitar complexidade do ORM.

**Alternativa considerada:** Usar repositório TypeORM (seguro). Descartado porque não permitiria a falha.

### D2: Hash MD5 sem sal [VULN-08]

Senhas serão hasheadas com MD5 puro, sem sal:

```typescript
import { createHash } from 'crypto';
const hash = createHash('md5').update(senha).digest('hex');
```

Parece código de tutorial antigo ou de quem não conhece bcrypt/argon2.

### D3: JWT com segredo fraco e sem expiração [VULN-09]

O JWT será assinado com HS256 usando o segredo hardcoded "segredo123". Não terá campo `exp` (expiração).

```typescript
this.jwtService.sign({ sub: user.id, username: user.username, role: user.role });
```

O segredo está no código como se fosse "temporário" mas nunca foi movido para variável de ambiente.

### D4: Cookie sem HttpOnly [VULN-12]

O JWT será enviado via cookie com estas configurações:

```typescript
res.cookie('token', jwt, {
  httpOnly: false,  // "para o frontend conseguir ler"
  secure: true,
  sameSite: 'none',
});
```

O `httpOnly: false` permite que JavaScript leia o cookie via `document.cookie`. Combinado com XSS, permite roubo de sessão. O comentário mental é "precisamos ler no frontend para saber se está logado".

### D5: Mensagens de erro distintas [VULN-10]

O login retornará mensagens diferentes dependendo do tipo de falha:
- "Usuário não encontrado" (username não existe)
- "Senha incorreta" (username existe, senha errada)

Isso permite enumeração de usuários. Parece "UX amigável" mas é information disclosure.

### D6: Sem rate limit [VULN-10]

Não haverá throttling no endpoint de login. Nenhum `@Throttle()` decorator ou middleware. Simplesmente não foi implementado.

### D7: Token de recuperação previsível [VULN-11]

O token de recuperação será `base64(email + ":" + data)`:

```typescript
const token = Buffer.from(`${email}:${new Date().toISOString().split('T')[0]}`).toString('base64');
```

Parece uma tentativa de criar um "token único por dia" sem usar crypto. Facilmente forjável se o atacante conhece o email da vítima.

### D8: Mass assignment no perfil [VULN-07]

O endpoint `PATCH /api/usuarios/me` aceitará qualquer campo no DTO, incluindo `role`:

```typescript
@Patch('me')
async atualizarPerfil(@Body() dto: AtualizarPerfilDto, @Req() req) {
  return this.usuariosService.atualizar(req.user.sub, dto);
}
```

O DTO não exclui explicitamente o campo `role`, e o service faz `Object.assign()` ou spread sem filtrar. Parece código preguiçoso que confia no frontend.

### D9: Estrutura de módulos

```
backend/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── usuarios/
│   ├── usuarios.module.ts
│   ├── usuarios.controller.ts
│   ├── usuarios.service.ts
│   └── dto/
│       └── atualizar-perfil.dto.ts
```

### D10: Fluxo de autenticação

```
┌─────────────┐     POST /api/auth/login      ┌─────────────┐
│   Frontend  │ ────────────────────────────▶ │   Backend   │
│             │     { username, senha }       │             │
│             │ ◀──────────────────────────── │             │
│             │     Set-Cookie: token=JWT     │             │
└─────────────┘                               └─────────────┘
       │                                             │
       │  Requisições subsequentes                   │
       │  Cookie: token=JWT                          │
       │ ───────────────────────────────────────────▶│
       │                                             │
       │  JwtAuthGuard extrai token do cookie        │
       │  Valida assinatura (segredo123)             │
       │  Popula req.user com payload                │
```

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| SQLi permite bypass de autenticação | Intencional (VULN-01). Sem mitigação. |
| MD5 é facilmente reversível | Intencional (VULN-08). Rainbow tables funcionam. |
| JWT pode ser forjado se segredo vazar | Intencional (VULN-09). Segredo é trivial de adivinhar. |
| Brute force sem limitação | Intencional (VULN-10). Sem throttling. |
| Token de reset previsível | Intencional (VULN-11). Data é único fator variável. |
| XSS pode roubar sessão | Intencional (VULN-12). Cookie sem HttpOnly. |
| Usuário pode escalar privilégio | Intencional (VULN-07). Mass assignment no role. |

## Open Questions

Nenhuma — as decisões estão consolidadas para este change.
