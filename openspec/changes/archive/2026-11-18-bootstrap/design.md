## Context

Projeto greenfield. Não há código existente — estamos criando a fundação do SIGAcad do zero. A stack foi definida: NestJS + TypeORM + PostgreSQL no backend, Svelte 5 + Vite no frontend, docker-compose para ambiente local.

Este change estabelece:
1. Estrutura de diretórios e configuração do monorepo
2. Entidades de domínio e dados de seed
3. Configurações globais da API (CORS, Swagger, exception handling)

## Goals / Non-Goals

**Goals:**
- Criar estrutura de projeto funcional que suba com `docker compose up --build`
- Definir todas as entidades do domínio acadêmico
- Seed com dados realistas para testes e demonstração
- Configurar CORS, Swagger e exception filter

**Non-Goals:**
- Autenticação e login (change `auth-e-perfis`)
- Endpoints de negócio (change `nucleo-academico`)
- Deploy em produção (change `infra`)

## Decisions

### D1: Estrutura do monorepo

```
/
├── backend/           # NestJS app
│   ├── src/
│   │   ├── entities/  # TypeORM entities
│   │   ├── modules/   # Feature modules
│   │   └── common/    # Shared: filters, utils
│   └── package.json
├── frontend/          # Svelte 5 + Vite
│   ├── src/
│   └── package.json
├── docker-compose.yml
└── .env.example
```

**Alternativa considerada:** Monorepo com Turborepo/Nx. Descartado por adicionar complexidade desnecessária para o escopo do laboratório.

### D2: Entidades de domínio

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Usuario    │       │  Disciplina  │       │   Recado     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ id           │       │ id           │
│ username     │       │ codigo       │       │ conteudo     │
│ email        │       │ nome         │       │ dataHora     │
│ senha        │◀──────│ professorId  │       │ autorId      │──▶ Usuario
│ nomeExibicao │       └──────────────┘       │ disciplinaId │──▶ Disciplina
│ role         │              │               └──────────────┘
└──────────────┘              │
       │                      │
       ▼                      ▼
┌──────────────────────────────────┐
│           Matricula              │
├──────────────────────────────────┤
│ id                               │
│ alunoId ──────────────▶ Usuario  │
│ disciplinaId ─────────▶ Disciplina│
└──────────────────────────────────┘
              │
              ▼
       ┌──────────────┐
       │     Nota     │
       ├──────────────┤
       │ id           │
       │ matriculaId  │
       │ tipo         │  (P1, P2, trabalho, etc.)
       │ valor        │
       └──────────────┘
```

### D3: CORS permissivo [VULN-13]

O CORS será configurado para refletir qualquer `Origin` recebida, com `credentials: true`. Isso se faz passando uma função para `origin` que retorna o header da requisição:

```typescript
app.enableCors({
  origin: (origin, callback) => callback(null, origin),
  credentials: true,
});
```

Parece um "atalho de desenvolvimento" que ficou em produção.

### D4: Swagger público [VULN-14]

Swagger habilitado em `/api/docs` sem autenticação. Configuração padrão do `@nestjs/swagger` sem nenhum middleware de proteção. Parece descuido de quem seguiu o tutorial e não pensou em produção.

### D5: Ausência de helmet [VULN-14]

Simplesmente não instalar nem configurar `helmet`. As respostas não terão headers de segurança como `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`. Ausência silenciosa — nenhum código errado, apenas código faltando.

### D6: lodash vulnerável [VULN-15]

Instalar lodash fixado em `4.17.15` (versão com CVEs de prototype pollution). Usar `_.get()` ou `_.merge()` em algum utilitário real para que o código efetivamente dependa dele. `npm audit` detectará a vulnerabilidade.

```json
"dependencies": {
  "lodash": "4.17.15"
}
```

### D7: Exception filter verboso [VULN-17]

Exception filter global que captura todas as exceções e retorna:
- `message`: mensagem de erro
- `stack`: stack trace completo
- `query`: se for `QueryFailedError` do TypeORM, inclui a query SQL

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = {
      message: exception.message,
      stack: exception.stack,
    };
    if (exception instanceof QueryFailedError) {
      response.query = exception.query;
    }
    // ...
  }
}
```

Parece código de debugging que nunca foi removido.

### D8: Sem logging [VULN-16]

Não configurar nenhum logger estruturado. O NestJS tem logging básico de requisições, mas não haverá log de eventos de negócio (falhas de login, alterações de nota, mudanças de role). Ausência silenciosa.

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| lodash 4.17.15 pode causar problemas reais se prototype pollution for explorado em runtime | A versão tem CVEs, mas os vetores específicos (Lodash.merge com input malicioso) não serão expostos diretamente em endpoints públicos. O risco é acadêmico — o `npm audit` acusará, mas a exploração real é contida. |
| Exception filter expondo queries pode vazar estrutura do banco | Aceitável para o laboratório. Não há dados reais. |
| CORS permissivo permite ataques cross-origin | Intencional. Este é o ponto do VULN-13. |

## Open Questions

Nenhuma — as decisões estão consolidadas para este change.
